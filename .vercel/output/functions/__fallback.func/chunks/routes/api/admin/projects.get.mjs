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

const projects_get = defineEventHandler(async (event) => {
  const files = await listProjectFiles();
  const projects = [];
  for (const f of files) {
    const slug = f.replace(/\.json$/, "");
    projects.push({ slug, ...await readProjectFile(slug) });
  }
  return projects;
});

export { projects_get as default };
//# sourceMappingURL=projects.get.mjs.map
