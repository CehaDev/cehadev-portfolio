import { d as defineEventHandler, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { g as getChatConfig, h as addVisitorMessage } from '../../../_/chat.mjs';
import { r as rateLimitOrThrow } from '../../../_/rate-limit.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const messages_post = defineEventHandler(async (event) => {
  rateLimitOrThrow(event, "chat-msg", 20, 5 * 60 * 1e3);
  const { enabled } = await getChatConfig();
  if (!enabled) {
    throw createError({ statusCode: 403, statusMessage: "Chat sedang nonaktif" });
  }
  const body = await readBody(event);
  if (typeof body.text !== "string" || !body.text.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Pesan wajib diisi" });
  }
  const result = await addVisitorMessage({
    conversationId: typeof body.conversationId === "string" ? body.conversationId : void 0,
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email : "",
    text: body.text
  });
  return result;
});

export { messages_post as default };
//# sourceMappingURL=messages.post.mjs.map
