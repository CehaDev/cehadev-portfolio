import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { f as findConversation } from '../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = getRouterParam(event, "id")) != null ? _a : "";
  const conv = await findConversation(id);
  if (!conv) {
    throw createError({ statusCode: 404, statusMessage: "Percakapan tidak ditemukan" });
  }
  return { id: conv.id, status: conv.status, messages: conv.messages };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
