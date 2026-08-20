import { d as defineEventHandler, t as readPending, c as createError, r as readBody, u as setAdminSession, v as clearPending } from '../../../nitro/nitro.mjs';
import { v as verifyOtp } from '../../../_/otp.mjs';
import { r as rateLimitOrThrow } from '../../../_/rate-limit.mjs';
import { l as logSecurityEvent } from '../../../_/security-log.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import '../../../_/mailer.mjs';
import 'nodemailer';
import '../../../_/settings.mjs';

const verify_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  rateLimitOrThrow(event, "otp-verify", 5, 10 * 60 * 1e3);
  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: "Sesi verifikasi tidak ditemukan. Silakan login ulang." });
  }
  const body = await readBody(event);
  try {
    await verifyOtp(((_a = body.code) != null ? _a : "").trim());
  } catch (e) {
    await logSecurityEvent("otp_verify_failed", { ip: (_d = (_c = (_b = event.node) == null ? void 0 : _b.req) == null ? void 0 : _c.socket) == null ? void 0 : _d.remoteAddress });
    throw e;
  }
  setAdminSession(event);
  clearPending(event);
  await logSecurityEvent("login_success", { ip: (_g = (_f = (_e = event.node) == null ? void 0 : _e.req) == null ? void 0 : _f.socket) == null ? void 0 : _g.remoteAddress });
  return { ok: true };
});

export { verify_post as default };
//# sourceMappingURL=verify.post.mjs.map
