import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { c as countUnreadMessages } from '../../../../_/messages.mjs';
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

const unread_get = defineEventHandler(async (event) => {
  return { count: await countUnreadMessages() };
});

export { unread_get as default };
//# sourceMappingURL=unread.get.mjs.map
