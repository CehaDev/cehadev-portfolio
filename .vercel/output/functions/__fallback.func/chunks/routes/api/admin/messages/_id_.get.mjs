import { d as defineEventHandler, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { g as getMessage, m as markMessageRead } from '../../../../_/messages.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = getRouterParam(event, "id")) != null ? _a : "";
  const msg = await getMessage(id);
  await markMessageRead(id);
  return msg;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
