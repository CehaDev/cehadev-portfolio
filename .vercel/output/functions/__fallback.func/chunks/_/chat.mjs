import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { i as isUsingTurso, e as ensureSchema, k as kvGet, h as kvSet, f as db, c as createError } from '../nitro/nitro.mjs';

const chatFile = path.resolve(process.cwd(), ".data/chat.json");
async function readLocalChat() {
  try {
    const parsed = JSON.parse(await readFile(chatFile, "utf-8"));
    return {
      enabled: parsed.enabled !== false,
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : []
    };
  } catch {
    return { enabled: true, conversations: [] };
  }
}
async function writeLocalChat(store) {
  await mkdir(path.dirname(chatFile), { recursive: true });
  await writeFile(chatFile, JSON.stringify(store, null, 2) + "\n", "utf-8");
}
function nowIso() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function getChatConfig() {
  if (isUsingTurso()) {
    await ensureSchema();
    const raw = await kvGet("chat_enabled");
    return { enabled: raw !== "false" };
  }
  const store = await readLocalChat();
  return { enabled: store.enabled };
}
async function setChatEnabled(enabled) {
  if (isUsingTurso()) {
    await ensureSchema();
    await kvSet("chat_enabled", String(enabled));
    return { enabled };
  }
  const store = await readLocalChat();
  store.enabled = enabled;
  await writeLocalChat(store);
  return { enabled };
}
async function listConversations() {
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute(`
      SELECT
        c.id, c.visitor_name, c.visitor_email, c.created_at, c.updated_at, c.status, c.unread,
        (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id) AS message_count,
        (SELECT json_object('id', m.id, 'role', m.role, 'text', m.text, 'at', m.at)
         FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.at DESC LIMIT 1) AS last_message
      FROM chat_conversations c ORDER BY c.updated_at DESC
    `);
    return result.rows.map((row) => ({
      id: row.id,
      visitor: { name: row.visitor_name, email: row.visitor_email },
      status: row.status,
      unread: row.unread,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      messageCount: row.message_count,
      lastMessage: row.last_message ? JSON.parse(row.last_message) : null
    }));
  }
  const store = await readLocalChat();
  return store.conversations.map((c) => {
    var _a;
    return {
      id: c.id,
      visitor: c.visitor,
      status: c.status,
      unread: c.unread,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      messageCount: c.messages.length,
      lastMessage: (_a = c.messages[c.messages.length - 1]) != null ? _a : null
    };
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
async function findConversation(id) {
  var _a;
  if (isUsingTurso()) {
    await ensureSchema();
    const convResult = await db().execute({ sql: "SELECT * FROM chat_conversations WHERE id = ?", args: [id] });
    const row = convResult.rows[0];
    if (!row) return null;
    const msgResult = await db().execute({
      sql: "SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY at ASC",
      args: [id]
    });
    return {
      id: row.id,
      visitor: { name: row.visitor_name, email: row.visitor_email },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status,
      unread: row.unread,
      messages: msgResult.rows.map((m) => ({
        id: m.id,
        role: m.role,
        text: m.text,
        at: m.at
      }))
    };
  }
  const store = await readLocalChat();
  return (_a = store.conversations.find((c) => c.id === id)) != null ? _a : null;
}
async function getConversation(id) {
  const conv = await findConversation(id);
  if (!conv) throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
  return conv;
}
async function addVisitorMessage(input) {
  var _a, _b, _c;
  const text = input.text.trim().slice(0, 2e3);
  if (!text) throw createError({ statusCode: 400, statusMessage: "Pesan wajib diisi" });
  if (isUsingTurso()) {
    await ensureSchema();
    const now = nowIso();
    let convId = (_a = input.conversationId) != null ? _a : null;
    if (convId) {
      const existing = await db().execute({ sql: "SELECT id FROM chat_conversations WHERE id = ?", args: [convId] });
      if (!existing.rows[0]) convId = null;
    }
    if (!convId) {
      convId = randomUUID();
      await db().execute({
        sql: "INSERT INTO chat_conversations (id, visitor_name, visitor_email, created_at, updated_at, status, unread) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [convId, input.name.trim().slice(0, 80), input.email.trim().slice(0, 120), now, now, "open", 0]
      });
    }
    const messageId = randomUUID();
    await db().execute({
      sql: "INSERT INTO chat_messages (id, conversation_id, role, text, at) VALUES (?, ?, ?, ?, ?)",
      args: [messageId, convId, "visitor", text, now]
    });
    await db().execute({
      sql: `UPDATE chat_conversations SET updated_at = ?, unread = unread + 1, status = CASE WHEN status = 'resolved' THEN 'open' ELSE status END WHERE id = ?`,
      args: [now, convId]
    });
    return { id: convId, message: { id: messageId, role: "visitor", text, at: now } };
  }
  const store = await readLocalChat();
  let conv = input.conversationId ? (_b = store.conversations.find((c) => c.id === input.conversationId)) != null ? _b : null : null;
  if (!conv) {
    conv = {
      id: randomUUID(),
      visitor: { name: input.name.trim().slice(0, 80), email: input.email.trim().slice(0, 120) },
      createdAt: nowIso(),
      updatedAt: nowIso(),
      status: "open",
      unread: 0,
      messages: []
    };
    store.conversations.push(conv);
  }
  const message = { id: randomUUID(), role: "visitor", text, at: nowIso() };
  conv.messages.push(message);
  conv.updatedAt = message.at;
  conv.unread = ((_c = conv.unread) != null ? _c : 0) + 1;
  if (conv.status === "resolved") conv.status = "open";
  await writeLocalChat(store);
  return { id: conv.id, message };
}
async function addAdminReply(id, text) {
  const clean = text.trim().slice(0, 2e3);
  if (!clean) throw createError({ statusCode: 400, statusMessage: "Balasan tidak boleh kosong" });
  if (isUsingTurso()) {
    await ensureSchema();
    const conv2 = await db().execute({ sql: "SELECT id FROM chat_conversations WHERE id = ?", args: [id] });
    if (!conv2.rows[0]) throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
    const now = nowIso();
    const messageId = randomUUID();
    await db().execute({
      sql: "INSERT INTO chat_messages (id, conversation_id, role, text, at) VALUES (?, ?, ?, ?, ?)",
      args: [messageId, id, "admin", clean, now]
    });
    await db().execute({ sql: "UPDATE chat_conversations SET updated_at = ?, unread = 0 WHERE id = ?", args: [now, id] });
    return { message: { id: messageId, role: "admin", text: clean, at: now } };
  }
  const store = await readLocalChat();
  const conv = store.conversations.find((c) => c.id === id);
  if (!conv) throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
  const message = { id: randomUUID(), role: "admin", text: clean, at: nowIso() };
  conv.messages.push(message);
  conv.updatedAt = message.at;
  conv.unread = 0;
  await writeLocalChat(store);
  return { message };
}
async function markConversationRead(id) {
  if (isUsingTurso()) {
    await ensureSchema();
    await db().execute({ sql: "UPDATE chat_conversations SET unread = 0 WHERE id = ?", args: [id] });
    return { ok: true };
  }
  const store = await readLocalChat();
  const conv = store.conversations.find((c) => c.id === id);
  if (conv) conv.unread = 0;
  await writeLocalChat(store);
  return { ok: true };
}
async function setConversationStatus(id, status) {
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute({ sql: "UPDATE chat_conversations SET status = ? WHERE id = ?", args: [status, id] });
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
    return { status };
  }
  const store = await readLocalChat();
  const conv = store.conversations.find((c) => c.id === id);
  if (!conv) throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
  conv.status = status;
  await writeLocalChat(store);
  return { status: conv.status };
}
async function deleteConversation(id) {
  if (isUsingTurso()) {
    await ensureSchema();
    await db().execute({ sql: "DELETE FROM chat_messages WHERE conversation_id = ?", args: [id] });
    const result = await db().execute({ sql: "DELETE FROM chat_conversations WHERE id = ?", args: [id] });
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
    return { ok: true };
  }
  const store = await readLocalChat();
  const idx = store.conversations.findIndex((c) => c.id === id);
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
  store.conversations.splice(idx, 1);
  await writeLocalChat(store);
  return { ok: true };
}
async function countUnreadConversations() {
  var _a, _b;
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute("SELECT COUNT(*) AS cnt FROM chat_conversations WHERE unread > 0");
    return (_b = (_a = result.rows[0]) == null ? void 0 : _a.cnt) != null ? _b : 0;
  }
  const store = await readLocalChat();
  return store.conversations.reduce((n, c) => n + (c.unread > 0 ? 1 : 0), 0);
}

export { getConversation as a, setConversationStatus as b, addAdminReply as c, deleteConversation as d, countUnreadConversations as e, findConversation as f, getChatConfig as g, addVisitorMessage as h, listConversations as l, markConversationRead as m, setChatEnabled as s };
//# sourceMappingURL=chat.mjs.map
