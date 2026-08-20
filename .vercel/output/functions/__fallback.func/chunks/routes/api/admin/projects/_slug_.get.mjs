import { d as defineEventHandler, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { r as readProjectFile } from '../../../../_/projects.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import '../../../../_/ls.mjs';

const _slug__get = defineEventHandler(async (event) => {
  var _a;
  const slug = (_a = getRouterParam(event, "slug")) != null ? _a : "";
  return await readProjectFile(slug);
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
