import { d as defineEventHandler } from '../../../../nitro/nitro.mjs';
import { r as readSmtpSettings } from '../../../../_/settings.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const smtp_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const stored = await readSmtpSettings();
  return {
    host: (_a = stored.host) != null ? _a : "",
    port: (_b = stored.port) != null ? _b : 465,
    secure: (_c = stored.secure) != null ? _c : true,
    user: (_d = stored.user) != null ? _d : "",
    hasPass: Boolean(stored.pass),
    from: (_e = stored.from) != null ? _e : "",
    fromName: (_f = stored.fromName) != null ? _f : "CehaDev"
  };
});

export { smtp_get as default };
//# sourceMappingURL=smtp.get.mjs.map
