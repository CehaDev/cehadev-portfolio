import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { l as listProjectFiles, r as readProjectFile } from '../../../_/projects.mjs';
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

const projects_get = defineEventHandler(async () => {
  const files = await listProjectFiles();
  const projects = [];
  for (const slug of files) {
    try {
      projects.push(await readProjectFile(slug));
    } catch {
    }
  }
  return projects.filter((p) => !p.archived);
});

export { projects_get as default };
//# sourceMappingURL=projects.get.mjs.map
