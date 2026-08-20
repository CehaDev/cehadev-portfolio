import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import { n as normalizeSite, w as writeSiteFile } from '../../../_/site.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import '../../../_/ls.mjs';

const site_put = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const site = normalizeSite(body);
  await writeSiteFile(site);
  return { ok: true, site };
});

export { site_put as default };
//# sourceMappingURL=site.put.mjs.map
