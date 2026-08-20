import { d as defineEventHandler, t as readPending, c as createError } from '../../../../nitro/nitro.mjs';
import { i as issueOtp, g as getAdminEmail } from '../../../../_/otp.mjs';
import { m as mailConfigured, s as sendMail } from '../../../../_/mailer.mjs';
import { r as rateLimitOrThrow } from '../../../../_/rate-limit.mjs';
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
import '../../../../_/settings.mjs';

const resend_post = defineEventHandler(async (event) => {
  rateLimitOrThrow(event, "otp-resend", 3, 10 * 60 * 1e3);
  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: "Sesi verifikasi tidak ditemukan. Silakan login ulang." });
  }
  const { code } = await issueOtp();
  let smtpOk = true;
  try {
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
  } catch {
    smtpOk = false;
  }
  return { ok: true, ...!smtpOk ? { devCode: code } : {} };
});

export { resend_post as default };
//# sourceMappingURL=resend.post.mjs.map
