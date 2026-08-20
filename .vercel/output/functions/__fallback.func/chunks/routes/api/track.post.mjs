import { d as defineEventHandler, r as readBody, w as getRequestHeader } from '../../nitro/nitro.mjs';
import { a as addVisit } from '../../_/visits.mjs';
import { r as rateLimitOrThrow } from '../../_/rate-limit.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const track_post = defineEventHandler(async (event) => {
  var _a;
  rateLimitOrThrow(event, "track", 30, 60 * 1e3);
  const body = await readBody(event);
  const ua = (_a = getRequestHeader(event, "user-agent")) != null ? _a : "";
  return await addVisit({
    path: typeof body.path === "string" ? body.path : "",
    referrer: typeof body.referrer === "string" ? body.referrer : "",
    session: typeof body.session === "string" ? body.session : "",
    ua
  });
});

export { track_post as default };
//# sourceMappingURL=track.post.mjs.map
