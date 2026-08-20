import { d as defineEventHandler, g as getRouterParam, b as getQuery } from '../../../../nitro/nitro.mjs';
import { d as deleteProjectFile, r as readProjectFile, w as writeProjectFile } from '../../../../_/projects.mjs';
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

const _slug__delete = defineEventHandler(async (event) => {
  var _a;
  const slug = (_a = getRouterParam(event, "slug")) != null ? _a : "";
  const { permanent, restore } = getQuery(event);
  if (permanent === "true") {
    await deleteProjectFile(slug);
    return { ok: true };
  }
  const data = await readProjectFile(slug);
  await writeProjectFile(slug, { ...data, archived: restore !== "true" });
  return { ok: true };
});

export { _slug__delete as default };
//# sourceMappingURL=_slug_.delete.mjs.map
