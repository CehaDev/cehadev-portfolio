import { d as defineEventHandler, g as getRouterParam } from '../../../../../nitro/nitro.mjs';
import { a as getConversation, m as markConversationRead } from '../../../../../_/chat.mjs';
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
  const conv = await getConversation(id);
  await markConversationRead(id);
  return conv;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
