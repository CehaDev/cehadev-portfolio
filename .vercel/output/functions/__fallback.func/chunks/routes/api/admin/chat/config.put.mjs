import { d as defineEventHandler, r as readBody } from '../../../../nitro/nitro.mjs';
import { s as setChatEnabled } from '../../../../_/chat.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const config_put = defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await setChatEnabled(body.enabled === true);
});

export { config_put as default };
//# sourceMappingURL=config.put.mjs.map
