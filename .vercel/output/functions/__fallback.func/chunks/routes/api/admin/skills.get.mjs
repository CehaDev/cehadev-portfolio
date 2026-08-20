import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { r as readSkillsFile } from '../../../_/skills.mjs';
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

const skills_get = defineEventHandler(async (event) => {
  return await readSkillsFile();
});

export { skills_get as default };
//# sourceMappingURL=skills.get.mjs.map
