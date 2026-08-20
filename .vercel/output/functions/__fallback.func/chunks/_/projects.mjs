import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { j as kvGetJson, c as createError, l as kvSetJson } from '../nitro/nitro.mjs';
import { b as normalizeLS, a as normalizeLSArray } from './ls.mjs';

const PROJECTS_KEY = "content_projects";
const projectsDir = path.resolve(process.cwd(), "content/projects");
function isValidSlug(slug) {
  return /^[a-z0-9][a-z0-9-]*$/.test(slug);
}
async function readLocalProjects() {
  try {
    const files = (await readdir(projectsDir)).filter((f) => f.endsWith(".json"));
    const projects = [];
    for (const f of files) {
      projects.push(JSON.parse(await readFile(path.join(projectsDir, f), "utf-8")));
    }
    return projects;
  } catch {
    return [];
  }
}
async function listProjectFiles() {
  let projects = await kvGetJson(PROJECTS_KEY, []);
  if (!projects.length) {
    projects = await readLocalProjects();
  }
  return projects.map((p) => p.slug).filter((s) => typeof s === "string").sort();
}
async function readProjectFile(slug) {
  if (!isValidSlug(slug)) throw createError({ statusCode: 400, statusMessage: "Slug tidak valid" });
  let projects = await kvGetJson(PROJECTS_KEY, []);
  if (!projects.length) projects = await readLocalProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw createError({ statusCode: 404, statusMessage: "Project tidak ditemukan" });
  return project;
}
async function writeProjectFile(slug, data) {
  if (!isValidSlug(slug)) throw createError({ statusCode: 400, statusMessage: "Slug tidak valid" });
  const projects = await kvGetJson(PROJECTS_KEY, []);
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx >= 0) projects[idx] = data;
  else projects.push(data);
  await kvSetJson(PROJECTS_KEY, projects);
}
async function deleteProjectFile(slug) {
  if (!isValidSlug(slug)) throw createError({ statusCode: 400, statusMessage: "Slug tidak valid" });
  const projects = await kvGetJson(PROJECTS_KEY, []);
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx < 0) throw createError({ statusCode: 404, statusMessage: "Project tidak ditemukan" });
  projects.splice(idx, 1);
  await kvSetJson(PROJECTS_KEY, projects);
}
function normalizeProject(body) {
  const str = (v) => typeof v === "string" ? v.trim() : "";
  const arr = (v) => Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
  const bool = (v) => v === true || v === "true" || v === 1;
  const featureCards = (v) => (Array.isArray(v) ? v : []).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { icon: str(o.icon), color: str(o.color), title: normalizeLS(o.title), desc: normalizeLS(o.desc) };
  }).filter((f) => f.title.id);
  const processSteps = (v) => (Array.isArray(v) ? v : []).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { num: str(o.num), icon: str(o.icon), title: normalizeLS(o.title), desc: normalizeLS(o.desc) };
  }).filter((p) => p.title.id);
  const challenges = (v) => (Array.isArray(v) ? v : []).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { title: normalizeLS(o.title), desc: normalizeLS(o.desc) };
  }).filter((c) => c.title.id);
  const results = (v) => (Array.isArray(v) ? v : []).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { icon: str(o.icon), value: normalizeLS(o.value), label: normalizeLS(o.label) };
  }).filter((r) => r.label.id);
  const gallery = (v) => (Array.isArray(v) ? v : []).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    const image = str(o.image);
    return { label: normalizeLS(o.label), seed: Number(o.seed) || 1, ...image ? { image } : {} };
  }).filter((g) => g.label.id);
  const codeFiles = (v) => (Array.isArray(v) ? v : []).map((x) => {
    const o = x && typeof x === "object" ? x : {};
    return { name: str(o.name), language: str(o.language), content: str(o.content) };
  }).filter((f) => f.name && f.content);
  const demoRaw = body.demo && typeof body.demo === "object" ? body.demo : void 0;
  let demo;
  if (demoRaw) {
    const codeRaw = demoRaw.code && typeof demoRaw.code === "object" ? demoRaw.code : void 0;
    const files = codeRaw ? codeFiles(codeRaw.files) : [];
    demo = { enabled: bool(demoRaw.enabled), type: str(demoRaw.type), title: normalizeLS(demoRaw.title), note: normalizeLS(demoRaw.note), ...files.length ? { code: { files } } : {} };
    if (!demo.enabled) demo = void 0;
  }
  const rawDetail = body.detail && typeof body.detail === "object" ? body.detail : void 0;
  let detail;
  if (rawDetail) {
    detail = {
      overview: normalizeLS(rawDetail.overview),
      featureHighlights: featureCards(rawDetail.featureHighlights),
      mainFeatures: featureCards(rawDetail.mainFeatures),
      techStack: arr(rawDetail.techStack),
      process: processSteps(rawDetail.process),
      challenges: challenges(rawDetail.challenges),
      results: results(rawDetail.results),
      gallery: gallery(rawDetail.gallery)
    };
  }
  return {
    slug: str(body.slug).toLowerCase(),
    title: normalizeLS(body.title),
    tagline: normalizeLS(body.tagline),
    description: normalizeLS(body.description),
    tags: normalizeLSArray(body.tags),
    tech: arr(body.tech),
    category: normalizeLS(body.category),
    year: str(body.year),
    role: normalizeLS(body.role),
    duration: normalizeLS(body.duration),
    featured: bool(body.featured),
    archived: bool(body.archived),
    liveUrl: str(body.liveUrl),
    githubUrl: str(body.githubUrl),
    ...demo ? { demo } : {},
    ...detail ? { detail } : {}
  };
}

export { deleteProjectFile as d, listProjectFiles as l, normalizeProject as n, readProjectFile as r, writeProjectFile as w };
//# sourceMappingURL=projects.mjs.map
