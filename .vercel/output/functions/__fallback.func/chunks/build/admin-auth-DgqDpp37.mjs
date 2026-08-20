import { P as executeAsync } from '../nitro/nitro.mjs';
import { h as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const adminAuth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  let me = null;
  try {
    me = ([__temp, __restore] = executeAsync(() => useRequestFetch()("/api/auth/me")), __temp = await __temp, __restore(), __temp);
  } catch {
  }
  if (to.path === "/admin/login") {
    if (me == null ? void 0 : me.authenticated) return navigateTo("/admin");
    return;
  }
  if (to.path === "/admin/verify") {
    if (me == null ? void 0 : me.authenticated) return navigateTo("/admin");
    if (me == null ? void 0 : me.pending) return;
    return navigateTo("/admin/login");
  }
  if (me == null ? void 0 : me.authenticated) return;
  return navigateTo("/admin/login");
});

export { adminAuth as default };
//# sourceMappingURL=admin-auth-DgqDpp37.mjs.map
