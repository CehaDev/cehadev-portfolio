import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$1 } from './AdminProjectForm-BvLI39v6.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Pencil, ArrowLeft } from 'lucide-vue-next';
import { a as lsId } from './localize-vezARIz8.mjs';
import { u as useRoute, n as navigateTo } from './server.mjs';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
import { a as useHead } from './v3-C1_XsqpX.mjs';
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
import './LocaleInput--oTP_896.mjs';
import './LocaleTextarea-B9r3XgP5.mjs';
import './useSkills-YG6FZoMb.mjs';
import './demoCode-DHLAJk19.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const route = useRoute();
    const slug = computed(() => String(route.params.slug));
    const { data: project } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-project-edit",
      () => useRequestFetch()(`/api/admin/projects/${slug.value}`)
    )), __temp = await __temp, __restore(), __temp);
    useHead({ title: `Edit ${lsId((_a = project.value) == null ? void 0 : _a.title) || slug.value} | Admin` });
    async function onSaved(data) {
      const newSlug = String(data.slug);
      if (newSlug !== slug.value) await navigateTo(`/admin/projects/${newSlug}`, { replace: true });
      await navigateTo("/admin/projects");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AdminProjectForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="card relative overflow-hidden p-7"><div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-5"><div class="flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Pencil), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h2 class="text-lg font-extrabold tracking-tight text-text">Edit Project</h2><p class="mt-1 text-sm text-text-secondary">${ssrInterpolate(unref(lsId)((_a2 = unref(project)) == null ? void 0 : _a2.title) || unref(slug))}</p></div></div><div class="flex flex-col items-center gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/projects",
        class: "btn-outline !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), {
              size: 15,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` Kembali ke Daftar `);
          } else {
            return [
              createVNode(unref(ArrowLeft), {
                size: 15,
                "stroke-width": 2
              }),
              createTextVNode(" Kembali ke Daftar ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Kelola semua project</span></div></div></div>`);
      if (unref(project)) {
        _push(ssrRenderComponent(_component_AdminProjectForm, {
          initial: unref(project),
          endpoint: `/api/admin/projects/${unref(slug)}`,
          method: "PUT",
          onSaved
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/projects/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CBAjs-54.mjs.map
