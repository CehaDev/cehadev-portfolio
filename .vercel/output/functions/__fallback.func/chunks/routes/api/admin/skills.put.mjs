import { d as defineEventHandler, r as readBody } from '../../../nitro/nitro.mjs';
import { n as normalizeSkills, w as writeSkillsFile } from '../../../_/skills.mjs';
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

const skills_put = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const skills = normalizeSkills(body);
  await writeSkillsFile(skills);
  return { ok: true, skills };
});

export { skills_put as default };
//# sourceMappingURL=skills.put.mjs.map
