import { d as defineEventHandler, g as getRouterParam, r as readBody } from '../../../../../nitro/nitro.mjs';
import { c as addAdminReply } from '../../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const _id__post = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = getRouterParam(event, "id")) != null ? _a : "";
  const body = await readBody(event);
  const { message } = await addAdminReply(id, typeof body.text === "string" ? body.text : "");
  return { message };
});

export { _id__post as default };
//# sourceMappingURL=_id_.post.mjs.map
