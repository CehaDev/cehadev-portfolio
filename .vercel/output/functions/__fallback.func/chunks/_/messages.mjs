import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { i as isUsingTurso, e as ensureSchema, f as db, c as createError } from '../nitro/nitro.mjs';
import { g as getMailConfig, s as sendMail } from './mailer.mjs';

const messagesFile = path.resolve(process.cwd(), ".data/messages.json");
async function readLocalMessages() {
  try {
    const parsed = JSON.parse(await readFile(messagesFile, "utf-8"));
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
}
async function writeLocalMessages(messages) {
  await mkdir(path.dirname(messagesFile), { recursive: true });
  await writeFile(messagesFile, JSON.stringify({ messages }, null, 2) + "\n", "utf-8");
}
function rowToMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    read: row.read === 1,
    at: row.at,
    replies: (() => {
      try {
        return JSON.parse(row.replies || "[]");
      } catch {
        return [];
      }
    })()
  };
}
async function addContactMessage(input) {
  const name = input.name.trim().slice(0, 80);
  const email = input.email.trim().slice(0, 120);
  const subject = input.subject.trim().slice(0, 160);
  const message = input.message.trim().slice(0, 5e3);
  if (!name) throw createError({ statusCode: 400, statusMessage: "Nama wajib diisi" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Email tidak valid" });
  }
  if (!subject) throw createError({ statusCode: 400, statusMessage: "Subjek wajib diisi" });
  if (message.length < 10) throw createError({ statusCode: 400, statusMessage: "Pesan minimal 10 karakter" });
  const id = randomUUID();
  const at = (/* @__PURE__ */ new Date()).toISOString();
  if (isUsingTurso()) {
    await ensureSchema();
    await db().execute({
      sql: "INSERT INTO messages (id, name, email, subject, message, read, at, replies) VALUES (?, ?, ?, ?, ?, 0, ?, ?)",
      args: [id, name, email, subject, message, at, "[]"]
    });
  } else {
    const messages = await readLocalMessages();
    messages.push({ id, name, email, subject, message, read: false, at, replies: [] });
    await writeLocalMessages(messages);
  }
  return { id, at };
}
async function listMessages() {
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute("SELECT * FROM messages ORDER BY at DESC");
    return result.rows.map(rowToMessage);
  }
  const messages = await readLocalMessages();
  return messages.sort((a, b) => b.at.localeCompare(a.at));
}
async function getMessage(id) {
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute({ sql: "SELECT * FROM messages WHERE id = ?", args: [id] });
    const row = result.rows[0];
    if (!row) throw createError({ statusCode: 404, statusMessage: "Pesan tidak ditemukan" });
    return rowToMessage(row);
  }
  const messages = await readLocalMessages();
  const msg = messages.find((m) => m.id === id);
  if (!msg) throw createError({ statusCode: 404, statusMessage: "Pesan tidak ditemukan" });
  return msg;
}
async function markMessageRead(id) {
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute({ sql: "UPDATE messages SET read = 1 WHERE id = ?", args: [id] });
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: "Pesan tidak ditemukan" });
    return { ok: true };
  }
  const messages = await readLocalMessages();
  const msg = messages.find((m) => m.id === id);
  if (!msg) throw createError({ statusCode: 404, statusMessage: "Pesan tidak ditemukan" });
  msg.read = true;
  await writeLocalMessages(messages);
  return { ok: true };
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
async function addMessageReply(id, text) {
  const msg = await getMessage(id);
  const clean = text.trim().slice(0, 5e3);
  if (!clean) throw createError({ statusCode: 400, statusMessage: "Balasan tidak boleh kosong" });
  let status = "failed";
  let error = "";
  try {
    const cfg = await getMailConfig();
    await sendMail({
      to: msg.email,
      bcc: cfg ? cfg.from : void 0,
      subject: `Re: ${msg.subject}`,
      text: clean,
      html: `<p>Halo <strong>${escapeHtml(msg.name)}</strong>,</p>
<p>${escapeHtml(clean).replace(/\n/g, "<br />")}</p>
<br />
<p>Salam,<br />${cfg ? escapeHtml(cfg.fromName) : "CehaDev"}</p>`
    });
    status = "sent";
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }
  const reply = { id: randomUUID(), text: clean, at: (/* @__PURE__ */ new Date()).toISOString(), status, error };
  if (isUsingTurso()) {
    const replies = [...msg.replies, reply];
    await db().execute({
      sql: "UPDATE messages SET replies = ?, read = 1 WHERE id = ?",
      args: [JSON.stringify(replies), id]
    });
  } else {
    const messages = await readLocalMessages();
    const m = messages.find((x) => x.id === id);
    if (m) {
      m.replies.push(reply);
      m.read = true;
      await writeLocalMessages(messages);
    }
  }
  return { reply };
}
async function deleteMessage(id) {
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute({ sql: "DELETE FROM messages WHERE id = ?", args: [id] });
    if (result.rowsAffected === 0) throw createError({ statusCode: 404, statusMessage: "Pesan tidak ditemukan" });
    return { ok: true };
  }
  const messages = await readLocalMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: "Pesan tidak ditemukan" });
  messages.splice(idx, 1);
  await writeLocalMessages(messages);
  return { ok: true };
}
async function countUnreadMessages() {
  var _a, _b;
  if (isUsingTurso()) {
    await ensureSchema();
    const result = await db().execute("SELECT COUNT(*) as count FROM messages WHERE read = 0");
    return Number((_b = (_a = result.rows[0]) == null ? void 0 : _a.count) != null ? _b : 0);
  }
  const messages = await readLocalMessages();
  return messages.filter((m) => !m.read).length;
}

export { addMessageReply as a, addContactMessage as b, countUnreadMessages as c, deleteMessage as d, getMessage as g, listMessages as l, markMessageRead as m };
//# sourceMappingURL=messages.mjs.map
