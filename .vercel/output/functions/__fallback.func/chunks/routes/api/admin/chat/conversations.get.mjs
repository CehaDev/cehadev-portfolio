import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { l as listConversations } from '../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const conversations_get = defineEventHandler(async (event) => {
  return await listConversations();
});

export { conversations_get as default };
//# sourceMappingURL=conversations.get.mjs.map
