import { _ as _sfc_main$2 } from './Reveal-B94-pL53.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$3 } from './ProjectThumb-BmgOVLSh.mjs';
import { _ as _sfc_main$4 } from './TechBadge-CFNCzhp8.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderVNode, ssrRenderAttr, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { Code2, CalendarRange, Tag, FolderKanban, BarChart3, ExternalLink, Eye, ArrowRight } from 'lucide-vue-next';
import { u as useTilt } from './useTilt-LzR139NB.mjs';
import { u as useStats } from './useStats-Dk9h29Wa.mjs';
import { u as useI18n } from './useI18n-Djb0t6ty.mjs';
import { f as findTechByName } from './useSkills-YG6FZoMb.mjs';
import { d as useProjectsContent, a as useSiteSettings } from './useContentData-B9bxi5bI.mjs';
import { u as useSeoMeta } from './v3-C1_XsqpX.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import './localize-vezARIz8.mjs';
import './ssr-DMxvrB_f.mjs';
import './asyncData-I2BNYYXU.mjs';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProjectCard",
  __ssrInlineRender: true,
  props: {
    project: {}
  },
  setup(__props) {
    const { tiltRef } = useTilt(7);
    const { viewsOf, formatCount } = useStats();
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ProjectThumb = _sfc_main$3;
      const _component_TechBadge = _sfc_main$4;
      _push(`<article${ssrRenderAttrs(mergeProps({
        ref_key: "tiltRef",
        ref: tiltRef,
        class: "card group relative flex flex-col overflow-hidden p-0 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
      }, _attrs))}><span class="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true"></span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/projects/${__props.project.slug}`,
        class: "block p-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ProjectThumb, {
              seed: __props.project.title.length + __props.project.year.length,
              label: __props.project.category,
              height: "h-44"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ProjectThumb, {
                seed: __props.project.title.length + __props.project.year.length,
                label: __props.project.category,
                height: "h-44"
              }, null, 8, ["seed", "label"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-1 flex-col gap-3 p-5 pt-2"><div class="flex items-start justify-between gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/projects/${__props.project.slug}`,
        class: "text-lg font-semibold text-text transition-colors hover:text-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.project.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.project.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a${ssrRenderAttr("href", __props.project.liveUrl)} target="_blank" rel="noopener noreferrer"${ssrRenderAttr("aria-label", unref(t)("projectCard.viewDemoAria", { title: __props.project.title }))} class="mt-0.5 shrink-0 text-text-muted transition-colors hover:text-primary">`);
      _push(ssrRenderComponent(unref(ExternalLink), {
        size: 18,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</a></div><p class="text-sm leading-relaxed text-text-secondary">${ssrInterpolate(__props.project.description)}</p><div class="mt-auto flex flex-wrap items-center gap-2 pt-1"><!--[-->`);
      ssrRenderList(__props.project.tags.slice(0, 3), (tag) => {
        _push(ssrRenderComponent(_component_TechBadge, {
          key: tag,
          name: tag
        }, null, _parent));
      });
      _push(`<!--]--><span class="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-bg-alt px-2.5 py-1 text-[11px] font-medium text-text-muted">`);
      _push(ssrRenderComponent(unref(Eye), {
        size: 12,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(formatCount)(unref(viewsOf)(__props.project.slug)))} ${ssrInterpolate(unref(t)("common.viewed"))}</span></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/projects/${__props.project.slug}`,
        class: "mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("projectCard.viewProject"))} `);
            _push2(ssrRenderComponent(unref(ArrowRight), {
              size: 15,
              "stroke-width": 2,
              class: "transition-transform group-hover:translate-x-0.5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("projectCard.viewProject")) + " ", 1),
              createVNode(unref(ArrowRight), {
                size: 15,
                "stroke-width": 2,
                class: "transition-transform group-hover:translate-x-0.5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProjectCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: projects } = ([__temp, __restore] = withAsyncContext(() => useProjectsContent()), __temp = await __temp, __restore(), __temp);
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    useSeoMeta({
      title: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.projects) == null ? void 0 : _c.title) != null ? _d : "Projects | CehaDev";
      },
      description: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.projects) == null ? void 0 : _c.description) != null ? _d : "Kumpulan project yang pernah dikerjakan CehaDev \u2014 dari web app, e-commerce, dashboard, hingga backend API.";
      }
    });
    const headings = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.projects) != null ? _c : {};
    });
    const categories = computed(() => {
      var _a;
      return ["All", ...new Set(((_a = projects.value) != null ? _a : []).map((p) => p.category))];
    });
    const activeCategory = ref("All");
    const filtered = computed(
      () => {
        var _a, _b;
        return activeCategory.value === "All" ? (_a = projects.value) != null ? _a : [] : ((_b = projects.value) != null ? _b : []).filter((p) => p.category === activeCategory.value);
      }
    );
    function categoryCount(cat) {
      var _a, _b, _c;
      return cat === "All" ? (_b = (_a = projects.value) == null ? void 0 : _a.length) != null ? _b : 0 : ((_c = projects.value) != null ? _c : []).filter((p) => p.category === cat).length;
    }
    const totalProjects = computed(() => {
      var _a, _b;
      return (_b = (_a = projects.value) == null ? void 0 : _a.length) != null ? _b : 0;
    });
    const totalCategories = computed(() => categories.value.length - 1);
    const yearsRange = computed(() => {
      var _a;
      const list = ((_a = projects.value) != null ? _a : []).map((p) => Number(p.year)).filter(Number.isFinite);
      return list.length ? `${Math.min(...list)} \u2013 ${Math.max(...list)}` : "";
    });
    const techStats = computed(() => {
      var _a, _b, _c;
      const counts = /* @__PURE__ */ new Map();
      for (const p of (_a = projects.value) != null ? _a : []) {
        for (const key of (_b = p.tech) != null ? _b : []) counts.set(key, ((_c = counts.get(key)) != null ? _c : 0) + 1);
      }
      const total = [...counts.values()].reduce((a, b) => a + b, 0);
      return [...counts.entries()].map(([key, count]) => {
        var _a2, _b2, _c2;
        const t = findTechByName(key);
        return {
          key,
          name: (_a2 = t == null ? void 0 : t.name) != null ? _a2 : key,
          glyph: (_b2 = t == null ? void 0 : t.glyph) != null ? _b2 : key.slice(0, 2).toUpperCase(),
          color: (_c2 = t == null ? void 0 : t.color) != null ? _c2 : "#8B5CF6",
          count,
          pct: Math.round(count / total * 100)
        };
      }).sort((a, b) => b.count - a.count);
    });
    const statIcons = {
      FolderKanban,
      Tag,
      CalendarRange,
      Code2
    };
    const statItems = computed(() => {
      var _a, _b, _c, _d, _e, _f;
      const config = (_b = (_a = site.value) == null ? void 0 : _a.projectStats) != null ? _b : [];
      const defaults = [
        { icon: "FolderKanban", label: (_c = headings.value.statProject) != null ? _c : "Project", value: String(totalProjects.value) },
        { icon: "Tag", label: (_d = headings.value.statCategory) != null ? _d : "Kategori", value: String(totalCategories.value) },
        { icon: "CalendarRange", label: (_e = headings.value.statYear) != null ? _e : "Tahun", value: yearsRange.value },
        { icon: "Code2", label: (_f = headings.value.statTech) != null ? _f : "Tech", value: String(techStats.value.length) }
      ];
      return defaults.map((d, i) => {
        const c = config[i];
        return {
          icon: (c == null ? void 0 : c.icon) && statIcons[c.icon] || statIcons[d.icon],
          label: (c == null ? void 0 : c.label) || d.label,
          value: (c == null ? void 0 : c.value) || d.value
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_Reveal = _sfc_main$2;
      const _component_ProjectCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-site min-h-[calc(100vh-76px)] py-16 md:py-20" }, _attrs))} data-v-744824b6><div class="text-center" data-v-744824b6><span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card" data-v-744824b6><span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" data-v-744824b6></span> ${ssrInterpolate((_a = unref(headings).portfolio) != null ? _a : "Portofolio")}</span><h1 class="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl" data-v-744824b6>${ssrInterpolate((_b = unref(headings).myHead1) != null ? _b : "My")} <span class="bg-gradient-brand bg-clip-text text-transparent" data-v-744824b6>${ssrInterpolate((_c = unref(headings).myHead2) != null ? _c : "Projects")}</span></h1><p class="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary" data-v-744824b6>${ssrInterpolate((_d = unref(headings).heroDesc) != null ? _d : "Kumpulan project yang saya kerjakan \u2014 dari aplikasi web, e-commerce, dashboard, hingga backend API. Setiap project dibangun dengan fokus pada kualitas, performa, dan pengalaman pengguna.")}</p><div class="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4" data-v-744824b6><!--[-->`);
      ssrRenderList(unref(statItems), (s, i) => {
        _push(ssrRenderComponent(_component_Reveal, {
          key: s.label,
          delay: i * 80,
          direction: i % 2 === 0 ? "up" : "scale",
          parallax: 8 + i * 3
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="rounded-card border border-border bg-card px-3 py-5 text-center shadow-card" data-v-744824b6${_scopeId}><span class="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true" data-v-744824b6${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(s.icon), {
                size: 16,
                "stroke-width": 1.75
              }, null), _parent2, _scopeId);
              _push2(`</span><p class="mt-2.5 font-mono text-xl font-extrabold leading-none text-text" data-v-744824b6${_scopeId}>${ssrInterpolate(s.value)}</p><p class="mt-1.5 text-xs text-text-muted" data-v-744824b6${_scopeId}>${ssrInterpolate(s.label)}</p></div>`);
            } else {
              return [
                createVNode("div", { class: "rounded-card border border-border bg-card px-3 py-5 text-center shadow-card" }, [
                  createVNode("span", {
                    class: "mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
                    "aria-hidden": "true"
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(s.icon), {
                      size: 16,
                      "stroke-width": 1.75
                    }))
                  ]),
                  createVNode("p", { class: "mt-2.5 font-mono text-xl font-extrabold leading-none text-text" }, toDisplayString(s.value), 1),
                  createVNode("p", { class: "mt-1.5 text-xs text-text-muted" }, toDisplayString(s.label), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div class="mt-12 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start" data-v-744824b6><div class="min-w-0 lg:order-1" data-v-744824b6><div class="flex flex-wrap justify-center gap-2.5 lg:justify-start" role="tablist"${ssrRenderAttr("aria-label", (_e = unref(headings).filterAria) != null ? _e : "Filter kategori project")} data-v-744824b6><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        var _a2;
        _push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeCategory) === cat)} class="${ssrRenderClass([unref(activeCategory) === cat ? "border-transparent bg-gradient-brand text-white shadow-btn-glow" : "border-border bg-card text-text-secondary hover:border-primary/50 hover:text-text", "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"])}" data-v-744824b6>${ssrInterpolate(cat === "All" ? (_a2 = unref(headings).allCategory) != null ? _a2 : "All" : cat)} <span class="${ssrRenderClass([unref(activeCategory) === cat ? "text-white/80" : "text-text-muted", "ml-1.5 text-xs"])}" data-v-744824b6>(${ssrInterpolate(categoryCount(cat))})</span></button>`);
      });
      _push(`<!--]--></div><div class="mt-8 grid gap-6 sm:grid-cols-2" data-v-744824b6><!--[-->`);
      ssrRenderList(unref(filtered), (p, i) => {
        _push(ssrRenderComponent(_component_Reveal, {
          key: p.slug,
          delay: i % 2 * 80,
          direction: i % 2 === 0 ? "left" : "up",
          parallax: 10 + i % 3 * 4
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_ProjectCard, { project: p }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_ProjectCard, { project: p }, null, 8, ["project"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><aside class="lg:order-2" data-v-744824b6>`);
      _push(ssrRenderComponent(_component_Reveal, {
        direction: "right",
        parallax: 16
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2;
          if (_push2) {
            _push2(`<section class="card p-6 md:p-7" data-v-744824b6${_scopeId}><div class="flex items-center gap-4" data-v-744824b6${_scopeId}><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true" data-v-744824b6${_scopeId}>`);
            _push2(ssrRenderComponent(unref(BarChart3), {
              size: 20,
              "stroke-width": 1.5
            }, null, _parent2, _scopeId));
            _push2(`</span><div data-v-744824b6${_scopeId}><h2 class="text-lg font-extrabold text-text" data-v-744824b6${_scopeId}>${ssrInterpolate((_a2 = unref(headings).langTechTitle) != null ? _a2 : "Bahasa & Teknologi")}</h2><p class="text-xs text-text-muted" data-v-744824b6${_scopeId}>${ssrInterpolate((_b2 = unref(headings).langTechSub) != null ? _b2 : "Frekuensi pemakaian di seluruh project")}</p></div></div><div class="mt-7 space-y-5" data-v-744824b6${_scopeId}><!--[-->`);
            ssrRenderList(unref(techStats), (t) => {
              _push2(`<div class="min-w-0" data-v-744824b6${_scopeId}><div class="mb-1.5 flex items-center justify-between gap-3" data-v-744824b6${_scopeId}><span class="flex min-w-0 items-center gap-2 text-sm font-medium text-text" data-v-744824b6${_scopeId}><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-[10px] font-bold tech-glyph" style="${ssrRenderStyle({ "--glyph-color": t.color })}" aria-hidden="true" data-v-744824b6${_scopeId}>${ssrInterpolate(t.glyph)}</span><span class="truncate" data-v-744824b6${_scopeId}>${ssrInterpolate(t.name)}</span></span><span class="shrink-0 font-mono text-xs text-text-muted" data-v-744824b6${_scopeId}>${ssrInterpolate(t.count)}\xD7 \xB7 ${ssrInterpolate(t.pct)}%</span></div><div class="h-2 overflow-hidden rounded-full bg-bg-alt" role="img"${ssrRenderAttr("aria-label", `${t.name} ${t.pct}%`)} data-v-744824b6${_scopeId}><div class="h-full rounded-full transition-all duration-700" style="${ssrRenderStyle({ width: t.pct + "%", background: `linear-gradient(90deg, ${t.color}, ${t.color}99)` })}" data-v-744824b6${_scopeId}></div></div></div>`);
            });
            _push2(`<!--]--></div></section>`);
          } else {
            return [
              createVNode("section", { class: "card p-6 md:p-7" }, [
                createVNode("div", { class: "flex items-center gap-4" }, [
                  createVNode("span", {
                    class: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
                    "aria-hidden": "true"
                  }, [
                    createVNode(unref(BarChart3), {
                      size: 20,
                      "stroke-width": 1.5
                    })
                  ]),
                  createVNode("div", null, [
                    createVNode("h2", { class: "text-lg font-extrabold text-text" }, toDisplayString((_c2 = unref(headings).langTechTitle) != null ? _c2 : "Bahasa & Teknologi"), 1),
                    createVNode("p", { class: "text-xs text-text-muted" }, toDisplayString((_d2 = unref(headings).langTechSub) != null ? _d2 : "Frekuensi pemakaian di seluruh project"), 1)
                  ])
                ]),
                createVNode("div", { class: "mt-7 space-y-5" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(techStats), (t) => {
                    return openBlock(), createBlock("div", {
                      key: t.key,
                      class: "min-w-0"
                    }, [
                      createVNode("div", { class: "mb-1.5 flex items-center justify-between gap-3" }, [
                        createVNode("span", { class: "flex min-w-0 items-center gap-2 text-sm font-medium text-text" }, [
                          createVNode("span", {
                            class: "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-[10px] font-bold tech-glyph",
                            style: { "--glyph-color": t.color },
                            "aria-hidden": "true"
                          }, toDisplayString(t.glyph), 5),
                          createVNode("span", { class: "truncate" }, toDisplayString(t.name), 1)
                        ]),
                        createVNode("span", { class: "shrink-0 font-mono text-xs text-text-muted" }, toDisplayString(t.count) + "\xD7 \xB7 " + toDisplayString(t.pct) + "%", 1)
                      ]),
                      createVNode("div", {
                        class: "h-2 overflow-hidden rounded-full bg-bg-alt",
                        role: "img",
                        "aria-label": `${t.name} ${t.pct}%`
                      }, [
                        createVNode("div", {
                          class: "h-full rounded-full transition-all duration-700",
                          style: { width: t.pct + "%", background: `linear-gradient(90deg, ${t.color}, ${t.color}99)` }
                        }, null, 4)
                      ], 8, ["aria-label"])
                    ]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</aside></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-744824b6"]]);

export { index as default };
//# sourceMappingURL=index-ameQWlDH.mjs.map
