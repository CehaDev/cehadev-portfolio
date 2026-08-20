import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { j as kvGetJson, c as createError, l as kvSetJson } from '../nitro/nitro.mjs';
import { a as normalizeLSArray, b as normalizeLS } from './ls.mjs';

const skillsFile = path.resolve(process.cwd(), "content/skills.json");
async function readSkillsFile() {
  const data = await kvGetJson("content_skills", null);
  if (data) return data;
  try {
    return JSON.parse(await readFile(skillsFile, "utf-8"));
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Data skill tidak ditemukan" });
  }
}
async function writeSkillsFile(data) {
  await kvSetJson("content_skills", data);
}
function normalizeSkills(body) {
  const str = (v) => typeof v === "string" ? v.trim() : "";
  const arr = (v) => Array.isArray(v) ? v : [];
  const skillItems = (v, hasCategory) => arr(v).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    const item = { name: normalizeLS(o.name), level: Math.min(100, Math.max(0, Number(o.level) || 0)), tech: str(o.tech) };
    if (hasCategory) item.category = normalizeLS(o.category);
    return item;
  }).filter((i) => i.name.id);
  const summaryCards = (v) => arr(v).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { label: normalizeLS(o.label), value: normalizeLS(o.value), icon: str(o.icon) };
  }).filter((i) => i.label.id);
  return {
    homeSkills: skillItems(body.homeSkills, false),
    technicalSkills: skillItems(body.technicalSkills, true),
    marqueeTech: normalizeLSArray(body.marqueeTech),
    skillsSummary: summaryCards(body.skillsSummary),
    toolsList: normalizeLSArray(body.toolsList),
    softSkills: normalizeLSArray(body.softSkills)
  };
}

export { normalizeSkills as n, readSkillsFile as r, writeSkillsFile as w };
//# sourceMappingURL=skills.mjs.map
