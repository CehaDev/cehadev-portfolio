import { c as createError, n as getHeader } from '../nitro/nitro.mjs';

const store = /* @__PURE__ */ new Map();
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 6e5);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}
setInterval(cleanup, 6e4).unref();
function getClientIP(event) {
  var _a, _b, _c, _d;
  const forwarded = getHeader(event, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = getHeader(event, "x-real-ip");
  if (realIP) return realIP.trim();
  return (_d = (_c = (_b = (_a = event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.socket) == null ? void 0 : _c.remoteAddress) != null ? _d : "unknown";
}
function checkRateLimit(key, limit, windowMs) {
  var _a;
  const now = Date.now();
  const entry = (_a = store.get(key)) != null ? _a : { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
  if (entry.timestamps.length >= limit) return false;
  entry.timestamps.push(now);
  store.set(key, entry);
  return true;
}
function rateLimitOrThrow(event, name, limit, windowMs) {
  const ip = getClientIP(event);
  const key = `${name}:${ip}`;
  if (!checkRateLimit(key, limit, windowMs)) {
    throw createError({
      statusCode: 429,
      statusMessage: "Terlalu banyak permintaan. Coba lagi beberapa menit."
    });
  }
}

export { rateLimitOrThrow as r };
//# sourceMappingURL=rate-limit.mjs.map
