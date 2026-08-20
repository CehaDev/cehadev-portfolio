import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { Play, Monitor, Smartphone, ExternalLink, FolderKanban } from 'lucide-vue-next';
import { a as lsId } from './localize-vezARIz8.mjs';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@libsql/client';
import 'node:fs/promises';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "demos",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: projects } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-demos-list",
      () => useRequestFetch()("/api/admin/projects")
    )), __temp = await __temp, __restore(), __temp);
    const demoProjects = computed(
      () => {
        var _a;
        return ((_a = projects.value) != null ? _a : []).filter((p) => {
          var _a2;
          return ((_a2 = p.demo) == null ? void 0 : _a2.enabled) && !p.archived;
        });
      }
    );
    const demoBadges = {
      store: "Store",
      kanban: "Kanban",
      dashboard: "Dashboard",
      api: "API",
      todo: "Task",
      code: "Code",
      studio: "Studio"
    };
    function demoTypeOf(p) {
      const d = p.demo;
      if (!(d == null ? void 0 : d.type)) return "";
      return demoBadges[d.type] || d.type;
    }
    const avatarGradients = [
      "from-violet-500 to-indigo-600",
      "from-cyan-500 to-blue-600",
      "from-emerald-500 to-lime-600",
      "from-amber-500 to-rose-600",
      "from-fuchsia-500 to-violet-600",
      "from-teal-500 to-emerald-600"
    ];
    function initialOf(title) {
      return lsId(title).trim().charAt(0).toUpperCase() || "?";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="card relative overflow-hidden p-7"><div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-5"><div class="flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Play), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h2 class="text-lg font-extrabold tracking-tight text-text">Demo Interaktif</h2><p class="mt-1 text-sm text-text-secondary">${ssrInterpolate(unref(demoProjects).length)} project dengan demo aktif. Klik untuk melihat live preview.</p></div></div></div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(demoProjects), (p, i) => {
        _push(`<div class="card group relative overflow-hidden p-0 transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-primary/25"><div class="relative h-40 overflow-hidden bg-gradient-to-br from-bg-alt to-bg"><div class="absolute inset-0 flex items-center justify-center"><span class="${ssrRenderClass([avatarGradients[i % avatarGradients.length], "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-extrabold text-white shadow-lg"])}" aria-hidden="true">${ssrInterpolate(initialOf(p.title))}</span></div><div class="absolute left-3 top-3"><span class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary backdrop-blur-sm">`);
        _push(ssrRenderComponent(unref(Play), {
          size: 9,
          "stroke-width": 2.5,
          class: "fill-primary"
        }, null, _parent));
        _push(` ${ssrInterpolate(demoTypeOf(p))}</span></div><div class="absolute right-3 top-3 flex gap-1.5"><span class="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 bg-bg/80 text-text-muted backdrop-blur-sm">`);
        _push(ssrRenderComponent(unref(Monitor), {
          size: 11,
          "stroke-width": 1.75
        }, null, _parent));
        _push(`</span><span class="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 bg-bg/80 text-text-muted backdrop-blur-sm">`);
        _push(ssrRenderComponent(unref(Smartphone), {
          size: 11,
          "stroke-width": 1.75
        }, null, _parent));
        _push(`</span></div></div><div class="p-4"><h3 class="text-sm font-bold text-text">${ssrInterpolate(unref(lsId)(p.title))}</h3><p class="mt-1 text-xs text-text-muted">${ssrInterpolate(unref(lsId)(p.category))} \xB7 ${ssrInterpolate(p.year)}</p><div class="mt-4 flex gap-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/projects/${p.slug}`,
          target: "_blank",
          class: "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-2 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ExternalLink), {
                size: 12,
                "stroke-width": 1.75
              }, null, _parent2, _scopeId));
              _push2(` Detail `);
            } else {
              return [
                createVNode(unref(ExternalLink), {
                  size: 12,
                  "stroke-width": 1.75
                }),
                createTextVNode(" Detail ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/projects/${p.slug}`,
          class: "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-2 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Edit `);
            } else {
              return [
                createTextVNode(" Edit ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (!unref(demoProjects).length) {
        _push(`<div class="card flex flex-col items-center justify-center py-16 text-center"><span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-alt text-text-muted">`);
        _push(ssrRenderComponent(unref(FolderKanban), {
          size: 28,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</span><p class="mt-4 text-sm font-medium text-text-secondary">Belum ada project dengan demo aktif.</p><p class="mt-1 text-xs text-text-muted">Aktifkan demo di pengaturan project untuk melihatnya di sini.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/projects",
          class: "btn-primary mt-5 !py-2.5 text-xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Kelola Projects `);
            } else {
              return [
                createTextVNode(" Kelola Projects ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/demos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=demos-CXU2NqF0.mjs.map
