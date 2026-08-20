import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { n as normalizeProject, r as readProjectFile, w as writeProjectFile } from '../../../_/projects.mjs';
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

const projects_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const project = normalizeProject(body);
  if (!project.slug || !project.title) {
    throw createError({ statusCode: 400, statusMessage: "Slug dan judul wajib diisi" });
  }
  try {
    await readProjectFile(project.slug);
    throw createError({ statusCode: 409, statusMessage: "Slug sudah digunakan" });
  } catch (e) {
    const err = e;
    if (err.statusCode !== 404) throw e;
  }
  await writeProjectFile(project.slug, project);
  return { ok: true, project };
});

export { projects_post as default };
//# sourceMappingURL=projects.post.mjs.map
