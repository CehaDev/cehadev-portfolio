import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { l as listMessages } from '../../../_/messages.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import '../../../_/mailer.mjs';
import 'nodemailer';
import '../../../_/settings.mjs';

const index_get = defineEventHandler(async (event) => {
  return await listMessages();
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
