import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { r as readSiteFile } from '../../../_/site.mjs';
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

const site_get = defineEventHandler(async (event) => {
  return await readSiteFile();
});

export { site_get as default };
//# sourceMappingURL=site.get.mjs.map
