import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { e as countUnreadConversations } from '../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const unread_get = defineEventHandler(async (event) => {
  return { count: await countUnreadConversations() };
});

export { unread_get as default };
//# sourceMappingURL=unread.get.mjs.map
