import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { i as isUsingTurso, e as ensureSchema, f as db } from '../nitro/nitro.mjs';

const visitsFile = path.resolve(process.cwd(), ".data/visits.json");
const MAX_VISITS = 2e4;
async function readLocalVisits() {
  try {
    const parsed = JSON.parse(await readFile(visitsFile, "utf-8"));
    return Array.isArray(parsed.visits) ? parsed.visits : [];
  } catch {
    return [];
  }
}
async function writeLocalVisits(visits) {
  await mkdir(path.dirname(visitsFile), { recursive: true });
  await writeFile(visitsFile, JSON.stringify({ visits }, null, 2) + "\n", "utf-8");
}
function detectDevice(ua) {
  if (/iphone|ipod|android.*mobile/i.test(ua)) return "Mobile";
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  return "Desktop";
}
function detectBrowser(ua) {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|chromium/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  if (/opr\//i.test(ua)) return "Opera";
  return "Lainnya";
}
async function addVisit(input) {
  var _a, _b, _c, _d;
  const p = ((_a = input.path) != null ? _a : "").trim().slice(0, 200);
  if (!p || p.startsWith("/admin") || p.startsWith("/_")) {
    return { ok: false };
  }
  const ua = (_b = input.ua) != null ? _b : "";
  const visit = {
    id: crypto.randomUUID(),
    at: (/* @__PURE__ */ new Date()).toISOString(),
    path: p,
    session: ((_c = input.session) != null ? _c : "").trim().slice(0, 80),
    referrer: ((_d = input.referrer) != null ? _d : "").trim().slice(0, 400),
    device: detectDevice(ua),
    browser: detectBrowser(ua)
  };
  if (isUsingTurso()) {
    await ensureSchema();
    await db().execute({
      sql: "INSERT INTO visits (id, at, path, session, referrer, device, browser) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [visit.id, visit.at, visit.path, visit.session, visit.referrer, visit.device, visit.browser]
    });
  } else {
    const visits = await readLocalVisits();
    visits.push(visit);
    if (visits.length > MAX_VISITS) visits.splice(0, visits.length - MAX_VISITS);
    await writeLocalVisits(visits);
  }
  return { ok: true };
}
async function listVisits() {
  if (isUsingTurso()) {
    await ensureSchema();
    const { rows } = await db().execute({
      sql: "SELECT * FROM visits ORDER BY rowid DESC LIMIT 20000",
      args: []
    });
    return rows;
  }
  return readLocalVisits();
}
function dayKey(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function visitDay(v) {
  return dayKey(new Date(v.at));
}
function dailySeries(visits, days) {
  const today = /* @__PURE__ */ new Date();
  const dates = [];
  const byDay = /* @__PURE__ */ new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const key = dayKey(d);
    dates.push(key);
    byDay.set(key, { views: 0, visitors: /* @__PURE__ */ new Set() });
  }
  for (const v of visits) {
    const key = visitDay(v);
    const bucket = byDay.get(key);
    if (!bucket) continue;
    bucket.views++;
    if (v.session) bucket.visitors.add(v.session);
  }
  return dates.map((date) => {
    const b = byDay.get(date);
    return { date, views: b.views, visitors: b.visitors.size };
  });
}
async function getAnalyticsOverview() {
  var _a, _b, _c, _d;
  const visits = await listVisits();
  const sessions = /* @__PURE__ */ new Set();
  const todayKey = dayKey(/* @__PURE__ */ new Date());
  let todayViews = 0;
  const todaySessions = /* @__PURE__ */ new Set();
  const pageViews = /* @__PURE__ */ new Map();
  const projectViews = /* @__PURE__ */ new Map();
  const devices = /* @__PURE__ */ new Map();
  const browsers = /* @__PURE__ */ new Map();
  for (const v of visits) {
    if (v.session) sessions.add(v.session);
    if (visitDay(v) === todayKey) {
      todayViews++;
      if (v.session) todaySessions.add(v.session);
    }
    const pv = (_a = pageViews.get(v.path)) != null ? _a : { views: 0, visitors: /* @__PURE__ */ new Set() };
    pv.views++;
    if (v.session) pv.visitors.add(v.session);
    pageViews.set(v.path, pv);
    if (v.path.startsWith("/projects/")) {
      const slug = v.path.replace("/projects/", "").split("/")[0];
      const pr = (_b = projectViews.get(slug)) != null ? _b : { slug, views: 0 };
      pr.views++;
      projectViews.set(slug, pr);
    }
    devices.set(v.device, ((_c = devices.get(v.device)) != null ? _c : 0) + 1);
    browsers.set(v.browser, ((_d = browsers.get(v.browser)) != null ? _d : 0) + 1);
  }
  return {
    total: {
      views: visits.length,
      visitors: sessions.size,
      todayViews,
      todayVisitors: todaySessions.size
    },
    daily: dailySeries(visits, 30),
    topPages: [...pageViews.entries()].map(([path2, { views }]) => ({ path: path2, views })).sort((a, b) => b.views - a.views).slice(0, 8),
    topProjects: [...projectViews.values()].sort((a, b) => b.views - a.views).slice(0, 8),
    devices: [...devices.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    browsers: [...browsers.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  };
}

export { addVisit as a, getAnalyticsOverview as g, listVisits as l };
//# sourceMappingURL=visits.mjs.map
