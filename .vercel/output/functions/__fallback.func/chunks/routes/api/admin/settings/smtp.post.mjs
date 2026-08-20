import { d as defineEventHandler, r as readBody } from '../../../../nitro/nitro.mjs';
import { r as readSmtpSettings, s as saveSmtpSettings } from '../../../../_/settings.mjs';
import { m as mailConfigured } from '../../../../_/mailer.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import 'nodemailer';

const smtp_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const body = await readBody(event);
  const stored = await readSmtpSettings();
  const pass = typeof body.pass === "string" && body.pass.trim() ? body.pass.trim() : (_a = stored.pass) != null ? _a : "";
  await saveSmtpSettings({
    host: (_d = (_c = (_b = body.host) == null ? void 0 : _b.trim()) != null ? _c : stored.host) != null ? _d : "",
    port: Number((_f = (_e = body.port) != null ? _e : stored.port) != null ? _f : 465),
    secure: Boolean((_h = (_g = body.secure) != null ? _g : stored.secure) != null ? _h : true),
    user: (_k = (_j = (_i = body.user) == null ? void 0 : _i.trim()) != null ? _j : stored.user) != null ? _k : "",
    pass,
    from: (_n = (_m = (_l = body.from) == null ? void 0 : _l.trim()) != null ? _m : stored.from) != null ? _n : "",
    fromName: (_q = (_p = (_o = body.fromName) == null ? void 0 : _o.trim()) != null ? _p : stored.fromName) != null ? _q : "CehaDev"
  });
  return { ok: true, configured: await mailConfigured() };
});

export { smtp_post as default };
//# sourceMappingURL=smtp.post.mjs.map
