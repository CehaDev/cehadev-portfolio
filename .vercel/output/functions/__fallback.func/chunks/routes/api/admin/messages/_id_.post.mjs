import { d as defineEventHandler, g as getRouterParam, r as readBody } from '../../../../nitro/nitro.mjs';
import { a as addMessageReply } from '../../../../_/messages.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import '../../../../_/mailer.mjs';
import 'nodemailer';
import '../../../../_/settings.mjs';

const _id__post = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = getRouterParam(event, "id")) != null ? _a : "";
  const body = await readBody(event);
  const { reply } = await addMessageReply(id, typeof body.text === "string" ? body.text : "");
  return { reply };
});

export { _id__post as default };
//# sourceMappingURL=_id_.post.mjs.map
