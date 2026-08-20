import nodemailer from 'nodemailer';
import { c as createError } from '../nitro/nitro.mjs';
import { r as readSmtpSettings } from './settings.mjs';

async function getMailConfig() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const stored = await readSmtpSettings();
  const host = (_b = (_a = stored.host) != null ? _a : process.env.NUXT_SMTP_HOST) == null ? void 0 : _b.trim();
  const user = (_d = (_c = stored.user) != null ? _c : process.env.NUXT_SMTP_USER) == null ? void 0 : _d.trim();
  const pass = (_e = stored.pass || process.env.NUXT_SMTP_PASS) == null ? void 0 : _e.trim();
  if (!host || !user || !pass) return null;
  const secure = (_f = stored.secure) != null ? _f : process.env.NUXT_SMTP_SECURE === "true";
  return {
    host,
    port: Number((_h = (_g = stored.port) != null ? _g : process.env.NUXT_SMTP_PORT) != null ? _h : secure ? 465 : 587),
    secure,
    user,
    pass,
    from: ((_j = (_i = stored.from) != null ? _i : process.env.NUXT_MAIL_FROM) == null ? void 0 : _j.trim()) || user,
    fromName: ((_l = (_k = stored.fromName) != null ? _k : process.env.NUXT_MAIL_FROM_NAME) == null ? void 0 : _l.trim()) || "CehaDev"
  };
}
async function mailConfigured() {
  return await getMailConfig() !== null;
}
async function sendMail(opts) {
  const cfg = await getMailConfig();
  if (!cfg) {
    throw createError({
      statusCode: 503,
      statusMessage: "SMTP belum dikonfigurasi. Atur di halaman Settings admin."
    });
  }
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass }
  });
  try {
    await transporter.sendMail({
      from: `"${cfg.fromName}" <${cfg.from}>`,
      to: opts.to,
      bcc: opts.bcc,
      subject: opts.subject,
      text: opts.text,
      html: opts.html
    });
    return { ok: true };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Gagal mengirim email";
    throw createError({ statusCode: 502, statusMessage: friendlyMailError(raw) });
  }
}
async function testMailConnection(input) {
  var _a, _b, _c, _d;
  const host = (_a = input.host) == null ? void 0 : _a.trim();
  const user = (_b = input.user) == null ? void 0 : _b.trim();
  const pass = input.pass || void 0;
  if (!host || !user) return { ok: false, message: "Host dan user SMTP wajib diisi" };
  const transporter = nodemailer.createTransport({
    host,
    port: Number((_c = input.port) != null ? _c : 465),
    secure: (_d = input.secure) != null ? _d : true,
    auth: pass ? { user, pass } : void 0
  });
  try {
    await transporter.verify();
    return { ok: true, message: "Koneksi SMTP berhasil. Balasan akan terkirim ke pengirim + salinan ke email Anda." };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Gagal terhubung ke SMTP";
    return { ok: false, message: friendlyMailError(raw) };
  }
}
function friendlyMailError(raw) {
  if (/invalid login|username and password not accepted|5\.7\.8|535/i.test(raw)) {
    return "Login SMTP ditolak: pastikan user adalah alamat email Gmail Anda dan pass adalah App Password 16 karakter (bukan password biasa), serta 2-Step Verification aktif.";
  }
  if (/could not connect|econnrefused|etimedout|enotfound|getaddrinfo/i.test(raw)) {
    return "Tidak bisa terhubung ke server SMTP. Periksa host, port, dan koneksi internet Anda.";
  }
  if (/too many login attempts|eacc|auth/i.test(raw)) {
    return "Permintaan login terlalu banyak. Tunggu beberapa menit lalu coba lagi.";
  }
  return raw;
}

export { getMailConfig as g, mailConfigured as m, sendMail as s, testMailConnection as t };
//# sourceMappingURL=mailer.mjs.map
