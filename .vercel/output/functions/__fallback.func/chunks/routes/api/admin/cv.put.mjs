import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import { n as normalizeCv, w as writeCvFile } from '../../../_/cv.mjs';
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

const cv_put = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const cv = normalizeCv(body);
  await writeCvFile(cv);
  return { ok: true, cv };
});

export { cv_put as default };
//# sourceMappingURL=cv.put.mjs.map
