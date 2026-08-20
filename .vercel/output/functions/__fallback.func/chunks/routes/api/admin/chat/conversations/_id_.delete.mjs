import { d as defineEventHandler, g as getRouterParam } from '../../../../../nitro/nitro.mjs';
import { d as deleteConversation } from '../../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = getRouterParam(event, "id")) != null ? _a : "";
  await deleteConversation(id);
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
