import { d as defineEventHandler, c as createError, r as readBody, m as issuePending } from '../../../nitro/nitro.mjs';
import { timingSafeEqual } from 'node:crypto';
import { i as issueOtp, g as getAdminEmail } from '../../../_/otp.mjs';
import { m as mailConfigured, s as sendMail } from '../../../_/mailer.mjs';
import { r as rateLimitOrThrow } from '../../../_/rate-limit.mjs';
import { l as logSecurityEvent } from '../../../_/security-log.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import '@libsql/client';
import 'node:fs/promises';
import 'nodemailer';
import '../../../_/settings.mjs';

async function sendOtpEmail(code) {
  if (!await mailConfigured()) {
    throw createError({ statusCode: 503, statusMessage: "SMTP belum dikonfigurasi. Atur di halaman Settings admin." });
  }
  const to = await getAdminEmail();
  if (!to) {
    throw createError({ statusCode: 500, statusMessage: "Email admin tidak ditemukan. Atur NUXT_ADMIN_EMAIL atau SMTP di Settings." });
  }
  await sendMail({
    to,
    subject: `Kode login CehaDev: ${code}`,
    text: `Kode verifikasi login admin Anda adalah ${code}. Berlaku 10 menit. Jika bukan Anda yang login, abaikan email ini.`
  });
}
const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  rateLimitOrThrow(event, "login", 5, 15 * 60 * 1e3);
  const expected = process.env.NUXT_ADMIN_PASSWORD;
  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: "Password admin belum dikonfigurasi (NUXT_ADMIN_PASSWORD)" });
  }
  const body = await readBody(event);
  const input = (_a = body.password) != null ? _a : "";
  const len = Math.max(input.length, expected.length);
  const inputBuf = Buffer.alloc(len, 0);
  const expectedBuf = Buffer.alloc(len, 0);
  inputBuf.write(input);
  expectedBuf.write(expected);
  if (!input || !timingSafeEqual(inputBuf, expectedBuf)) {
    await logSecurityEvent("login_failed", { ip: (_d = (_c = (_b = event.node) == null ? void 0 : _b.req) == null ? void 0 : _c.socket) == null ? void 0 : _d.remoteAddress });
    throw createError({ statusCode: 401, statusMessage: "Password salah" });
  }
  const { code } = await issueOtp();
  let smtpOk = true;
  try {
    await sendOtpEmail(code);
  } catch {
    smtpOk = false;
  }
  issuePending(event);
  return { ok: true, pending: true, ...!smtpOk ? { devCode: code } : {} };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
