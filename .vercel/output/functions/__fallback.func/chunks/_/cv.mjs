import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { j as kvGetJson, c as createError, l as kvSetJson } from '../nitro/nitro.mjs';
import { n as normalizeLSObject, a as normalizeLSArray, b as normalizeLS } from './ls.mjs';

const cvFile = path.resolve(process.cwd(), "content/cv.json");
async function readCvFile() {
  const data = await kvGetJson("content_cv", null);
  if (data) return data;
  try {
    return JSON.parse(await readFile(cvFile, "utf-8"));
  } catch {
    throw createError({ statusCode: 404, statusMessage: "CV tidak ditemukan" });
  }
}
async function writeCvFile(data) {
  await kvSetJson("content_cv", data);
}
function normalizeCv(body) {
  const str = (v) => typeof v === "string" ? v.trim() : "";
  return {
    fullName: str(body.fullName),
    title: normalizeLS(body.title),
    photo: str(body.photo),
    email: str(body.email),
    phone: str(body.phone),
    location: normalizeLS(body.location),
    website: str(body.website),
    linkedin: str(body.linkedin),
    github: str(body.github),
    summary: normalizeLS(body.summary),
    experiences: normalizeLSObject(body.experiences, ["role", "company", "period", "description"]),
    education: normalizeLSObject(body.education, ["degree", "school", "period", "description"]),
    skills: normalizeLSArray(body.skills),
    languages: normalizeLSObject(body.languages, ["name", "level"]),
    certifications: normalizeLSObject(body.certifications, ["name", "issuer", "year"])
  };
}

export { normalizeCv as n, readCvFile as r, writeCvFile as w };
//# sourceMappingURL=cv.mjs.map
