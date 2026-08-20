import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { j as kvGetJson, c as createError, l as kvSetJson } from '../nitro/nitro.mjs';
import { d as deepLS, b as normalizeLS, n as normalizeLSObject, a as normalizeLSArray } from './ls.mjs';

const siteFile = path.resolve(process.cwd(), "content/site.json");
async function readSiteFile() {
  const data = await kvGetJson("content_site", null);
  if (data) return data;
  try {
    return JSON.parse(await readFile(siteFile, "utf-8"));
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Data pengaturan website tidak ditemukan" });
  }
}
async function writeSiteFile(data) {
  await kvSetJson("content_site", data);
}
function normalizeSite(body) {
  const str = (v) => typeof v === "string" ? v.trim() : "";
  const arr = (v) => Array.isArray(v) ? v : [];
  const strings = (v) => normalizeLSArray(v);
  const stats = (v) => arr(v).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { icon: str(o.icon), label: normalizeLS(o.label), sub: normalizeLS(o.sub), end: Number(o.end) || 0, suffix: normalizeLS(o.suffix) };
  }).filter((i) => i.label.id);
  const socials = (v) => {
    const o = v && typeof v === "object" ? v : {};
    return { github: str(o.github), linkedin: str(o.linkedin), instagram: str(o.instagram) };
  };
  const faqs = (v) => normalizeLSObject(v, ["q", "a"]);
  const statCards = (v) => arr(v).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { icon: str(o.icon), label: normalizeLS(o.label), value: normalizeLS(o.value) };
  }).filter((i) => i.label.id);
  return {
    name: str(body.name),
    role: normalizeLS(body.role),
    heroBadge: normalizeLS(body.heroBadge),
    heroTitle1: normalizeLS(body.heroTitle1),
    heroTitleGradient: normalizeLS(body.heroTitleGradient),
    heroSubtitle: normalizeLS(body.heroSubtitle),
    heroDescription: normalizeLS(body.heroDescription),
    aboutIntro: strings(body.aboutIntro),
    aboutChecklist: strings(body.aboutChecklist),
    quote: normalizeLS(body.quote),
    quoteHighlight: normalizeLS(body.quoteHighlight),
    stats: stats(body.stats),
    email: str(body.email),
    location: normalizeLS(body.location),
    website: str(body.website),
    phone: str(body.phone),
    socials: socials(body.socials),
    cvUrl: str(body.cvUrl),
    faqs: faqs(body.faqs),
    projectStats: statCards(body.projectStats),
    seo: deepLS(body.seo),
    headings: deepLS(body.headings)
  };
}

export { normalizeSite as n, readSiteFile as r, writeSiteFile as w };
//# sourceMappingURL=site.mjs.map
