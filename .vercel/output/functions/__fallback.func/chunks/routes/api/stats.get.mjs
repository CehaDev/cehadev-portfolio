import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { l as listVisits } from '../../_/visits.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const stats_get = defineEventHandler(async () => {
  var _a;
  const visits = await listVisits();
  const sessions = /* @__PURE__ */ new Set();
  const projectViews = /* @__PURE__ */ new Map();
  let fromGoogle = 0;
  let direct = 0;
  let other = 0;
  for (const v of visits) {
    if (v.session) sessions.add(v.session);
    if (v.path.startsWith("/projects/")) {
      const slug = v.path.replace("/projects/", "").split("/")[0];
      projectViews.set(slug, ((_a = projectViews.get(slug)) != null ? _a : 0) + 1);
    }
    if (/google\./i.test(v.referrer) && /search|url\?/i.test(v.referrer)) fromGoogle++;
    else if (!v.referrer) direct++;
    else other++;
  }
  return {
    total: { views: visits.length, visitors: sessions.size },
    sources: [
      { label: "Google", value: fromGoogle },
      { label: "Langsung", value: direct },
      { label: "Lainnya", value: other }
    ],
    projects: [...projectViews.entries()].map(([slug, views]) => ({ slug, views })).sort((a, b) => b.views - a.views)
  };
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
