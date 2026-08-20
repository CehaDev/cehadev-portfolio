import { randomInt, timingSafeEqual, createHash } from 'node:crypto';
import { c as createError, l as kvSetJson, j as kvGetJson } from '../nitro/nitro.mjs';
import { g as getMailConfig } from './mailer.mjs';

const OTP_TTL = 10 * 60 * 1e3;
const MAX_TRIES = 5;
function hashCode(code) {
  return createHash("sha256").update(`otp:${code}`).digest("hex");
}
async function readStore() {
  return kvGetJson("otp_state", {});
}
async function writeStore(store) {
  await kvSetJson("otp_state", store);
}
async function issueOtp() {
  const code = String(randomInt(0, 1e6)).padStart(6, "0");
  await writeStore({ codeHash: hashCode(code), exp: Date.now() + OTP_TTL, tries: 0 });
  return { code };
}
async function verifyOtp(code) {
  var _a;
  if (!/^\d{6}$/.test(code)) {
    throw createError({ statusCode: 400, statusMessage: "Kode harus 6 digit angka" });
  }
  const store = await readStore();
  if (!store.codeHash || typeof store.exp !== "number" || store.exp < Date.now()) {
    await clearOtp();
    throw createError({ statusCode: 400, statusMessage: "Kode sudah kedaluwarsa. Minta kode baru." });
  }
  const tries = (_a = store.tries) != null ? _a : 0;
  if (tries >= MAX_TRIES) {
    await clearOtp();
    throw createError({ statusCode: 429, statusMessage: "Terlalu banyak percobaan. Minta kode baru." });
  }
  const expected = Buffer.from(store.codeHash, "hex");
  const actual = Buffer.from(hashCode(code), "hex");
  if (!timingSafeEqual(actual, expected)) {
    await writeStore({ ...store, tries: tries + 1 });
    throw createError({ statusCode: 400, statusMessage: "Kode tidak valid" });
  }
  await clearOtp();
}
async function clearOtp() {
  await writeStore({});
}
async function getAdminEmail() {
  const cfg = await getMailConfig();
  return (process.env.NUXT_ADMIN_EMAIL || (cfg == null ? void 0 : cfg.from) || (cfg == null ? void 0 : cfg.user) || "").trim() || null;
}

export { getAdminEmail as g, issueOtp as i, verifyOtp as v };
//# sourceMappingURL=otp.mjs.map
