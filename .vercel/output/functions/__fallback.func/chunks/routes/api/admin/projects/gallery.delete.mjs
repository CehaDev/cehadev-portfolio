import { d as defineEventHandler, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { del } from '@vercel/blob';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';

const gallery_delete = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.url) || typeof body.url !== "string") {
    throw createError({ statusCode: 400, statusMessage: "URL gambar wajib diisi" });
  }
  try {
    await del(body.url);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Gagal menghapus gambar" });
  }
  return { ok: true };
});

export { gallery_delete as default };
//# sourceMappingURL=gallery.delete.mjs.map
