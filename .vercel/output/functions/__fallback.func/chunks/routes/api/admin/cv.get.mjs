import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { r as readCvFile } from '../../../_/cv.mjs';
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

const cv_get = defineEventHandler(async (event) => {
  return await readCvFile();
});

export { cv_get as default };
//# sourceMappingURL=cv.get.mjs.map
