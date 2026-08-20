import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { n as normalizeProject, r as readProjectFile, d as deleteProjectFile, w as writeProjectFile } from '../../../../_/projects.mjs';
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

const _slug__put = defineEventHandler(async (event) => {
  var _a, _b;
  const slug = (_a = getRouterParam(event, "slug")) != null ? _a : "";
  const body = await readBody(event);
  const project = normalizeProject({ ...body, slug: (_b = body.slug) != null ? _b : slug });
  if (!project.title) {
    throw createError({ statusCode: 400, statusMessage: "Judul wajib diisi" });
  }
  if (project.slug !== slug) {
    try {
      await readProjectFile(project.slug);
      throw createError({ statusCode: 409, statusMessage: "Slug sudah digunakan" });
    } catch (e) {
      const err = e;
      if (err.statusCode !== 404) throw e;
    }
    await deleteProjectFile(slug);
  }
  await writeProjectFile(project.slug, project);
  return { ok: true, project };
});

export { _slug__put as default };
//# sourceMappingURL=_slug_.put.mjs.map
