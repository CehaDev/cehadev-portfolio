import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { g as getChatConfig } from '../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const config_get = defineEventHandler(async (event) => {
  return await getChatConfig();
});

export { config_get as default };
//# sourceMappingURL=config.get.mjs.map
