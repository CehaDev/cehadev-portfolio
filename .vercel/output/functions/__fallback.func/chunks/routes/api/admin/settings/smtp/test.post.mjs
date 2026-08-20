import { d as defineEventHandler, r as readBody } from '../../../../../nitro/nitro.mjs';
import { r as readSmtpSettings } from '../../../../../_/settings.mjs';
import { t as testMailConnection } from '../../../../../_/mailer.mjs';
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

const test_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const body = await readBody(event);
  const stored = await readSmtpSettings();
  const merged = {
    host: (_c = (_b = (_a = body.host) == null ? void 0 : _a.trim()) != null ? _b : stored.host) != null ? _c : "",
    port: Number((_e = (_d = body.port) != null ? _d : stored.port) != null ? _e : 465),
    secure: Boolean((_g = (_f = body.secure) != null ? _f : stored.secure) != null ? _g : true),
    user: (_j = (_i = (_h = body.user) == null ? void 0 : _h.trim()) != null ? _i : stored.user) != null ? _j : "",
    pass: (typeof body.pass === "string" ? body.pass : void 0) || stored.pass || "",
    from: (_m = (_l = (_k = body.from) == null ? void 0 : _k.trim()) != null ? _l : stored.from) != null ? _m : "",
    fromName: (_p = (_o = (_n = body.fromName) == null ? void 0 : _n.trim()) != null ? _o : stored.fromName) != null ? _p : "CehaDev"
  };
  return testMailConnection(merged);
});

export { test_post as default };
//# sourceMappingURL=test.post.mjs.map
