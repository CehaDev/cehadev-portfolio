import { d as defineEventHandler, g as getRouterParam, r as readBody } from '../../../../../nitro/nitro.mjs';
import { b as setConversationStatus } from '../../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const _id__patch = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = getRouterParam(event, "id")) != null ? _a : "";
  const body = await readBody(event);
  const status = body.status === "resolved" ? "resolved" : "open";
  return await setConversationStatus(id, status);
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
