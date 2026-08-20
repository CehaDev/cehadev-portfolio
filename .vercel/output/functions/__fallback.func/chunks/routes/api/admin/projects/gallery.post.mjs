import { d as defineEventHandler, a as readMultipartFormData, c as createError } from '../../../../nitro/nitro.mjs';
import { put } from '@vercel/blob';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const ALLOWED = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_SIZE = 10 * 1024 * 1024;
function validateMagicBytes(data, expectedType) {
  const signatures = {
    "image/jpeg": [[255, 216, 255]],
    "image/png": [[137, 80, 78, 71]],
    "image/webp": [[82, 73, 70, 70]],
    "image/avif": [[0, 0, 0]]
  };
  const sigs = signatures[expectedType];
  if (!sigs) return false;
  return sigs.some((sig) => sig.every((byte, i) => data[i] === byte));
}
const gallery_post = defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const file = parts == null ? void 0 : parts.find((p) => p.name === "image" && p.filename);
  if (!(file == null ? void 0 : file.data) || !file.type) {
    throw createError({ statusCode: 400, statusMessage: "File gambar wajib diisi" });
  }
  if (!ALLOWED.has(file.type)) {
    throw createError({ statusCode: 400, statusMessage: "Format gambar harus JPG, PNG, WEBP, atau AVIF" });
  }
  if (!validateMagicBytes(file.data, file.type)) {
    throw createError({ statusCode: 400, statusMessage: "File tidak sesuai dengan format yang dinyatakan" });
  }
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: "Ukuran gambar maksimal 10 MB" });
  }
  const ext = file.type === "image/jpeg" ? ".jpg" : file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".avif";
  const filename = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const blob = await put(`projects/${filename}`, file.data, {
    access: "public",
    contentType: file.type
  });
  return { ok: true, url: blob.url };
});

export { gallery_post as default };
//# sourceMappingURL=gallery.post.mjs.map
