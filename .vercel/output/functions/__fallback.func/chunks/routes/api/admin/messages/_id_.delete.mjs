import { d as defineEventHandler, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { d as deleteMessage } from '../../../../_/messages.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = getRouterParam(event, "id")) != null ? _a : "";
  return await deleteMessage(id);
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
