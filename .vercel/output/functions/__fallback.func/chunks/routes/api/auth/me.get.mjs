import { d as defineEventHandler, q as getCookie, s as isSessionValid, t as readPending, S as SESSION_COOKIE } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const me_get = defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE);
  const authenticated = await isSessionValid(token);
  return { authenticated, pending: !authenticated && readPending(event) };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
