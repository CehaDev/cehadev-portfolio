import { _ as _sfc_main$1 } from './Reveal-B94-pL53.mjs';
import { _ as _sfc_main$2 } from './AvatarIllustration-CKtNMuk4.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrRenderVNode } from 'vue/server-renderer';
import { Code2, TerminalSquare, Globe2, GraduationCap, FolderGit2, Clock } from 'lucide-vue-next';
import { f as findTechByName } from './useSkills-YG6FZoMb.mjs';
import { a as useSiteSettings, b as useSkillsContent } from './useContentData-B9bxi5bI.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "skills",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    useSeoMeta({
      title: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.skills) == null ? void 0 : _c.title) != null ? _d : "Skills | CehaDev";
      },
      description: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.skills) == null ? void 0 : _c.description) != null ? _d : "Keahlian dan teknologi yang dikuasai CehaDev \u2014 JavaScript, Vue.js, Nuxt.js, Node.js, dan berbagai tools pengembangan lainnya.";
      }
    });
    const headings = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.skills) != null ? _c : {};
    });
    const { data: skills2 } = ([__temp, __restore] = withAsyncContext(() => useSkillsContent()), __temp = await __temp, __restore(), __temp);
    const activeCat = ref("all");
    const techSkills = computed(() => {
      var _a, _b;
      return (_b = (_a = skills2.value) == null ? void 0 : _a.technicalSkills) != null ? _b : [];
    });
    const categories = computed(() => {
      const set = new Set(techSkills.value.map((s) => s.category).filter(Boolean));
      return ["all", ...set];
    });
    const filteredSkills = computed(() => {
      if (activeCat.value === "all") return techSkills.value;
      return techSkills.value.filter((s) => s.category === activeCat.value);
    });
    const groups = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const s of filteredSkills.value) {
        const cat = s.category || "Lainnya";
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat).push(s);
      }
      return [...map.entries()];
    });
    function techFor(name) {
      return findTechByName(name);
    }
    function techColor(name) {
      var _a, _b;
      return (_b = (_a = findTechByName(name)) == null ? void 0 : _a.color) != null ? _b : "#8B5CF6";
    }
    const summaryIcons = {
      "Code2": Code2,
      "Clock": Clock,
      "FolderGit2": FolderGit2,
      "GraduationCap": GraduationCap
    };
    const floatingBoxes = [
      { icon: Code2, label: "Code", pos: "left-0 top-8", delay: "0s", color: "#8B5CF6" },
      { icon: TerminalSquare, label: "Terminal", pos: "right-0 top-20", delay: "0.8s", color: "#22C55E" },
      { icon: Globe2, label: "Web", pos: "left-4 bottom-4", delay: "1.6s", color: "#3B82F6" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Reveal = _sfc_main$1;
      const _component_AvatarIllustration = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-site py-16 md:py-20" }, _attrs))} data-v-db37dfdc><section class="grid min-h-[calc(100vh-76px)] items-center gap-12 lg:grid-cols-[55fr_45fr]" data-v-db37dfdc>`);
      _push(ssrRenderComponent(_component_Reveal, { parallax: 18 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<h1 class="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl" data-v-db37dfdc${_scopeId}>${ssrInterpolate((_a2 = unref(headings).myHead1) != null ? _a2 : "My")} <span class="bg-gradient-brand bg-clip-text text-transparent" data-v-db37dfdc${_scopeId}>${ssrInterpolate((_b = unref(headings).myHead2) != null ? _b : "Skills")}</span></h1><p class="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary" data-v-db37dfdc${_scopeId}>${ssrInterpolate((_c = unref(headings).heroDesc) != null ? _c : "Berikut adalah teknologi dan tools yang saya kuasai untuk membangun aplikasi web modern \u2014 dari frontend yang interaktif hingga backend yang handal, serta tools yang mendukung alur kerja yang efisien.")}</p>`);
          } else {
            return [
              createVNode("h1", { class: "mt-3 text-3xl font-extrabold tracking-tight md:text-5xl" }, [
                createTextVNode(toDisplayString((_d = unref(headings).myHead1) != null ? _d : "My") + " ", 1),
                createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_e = unref(headings).myHead2) != null ? _e : "Skills"), 1)
              ]),
              createVNode("p", { class: "mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary" }, toDisplayString((_f = unref(headings).heroDesc) != null ? _f : "Berikut adalah teknologi dan tools yang saya kuasai untuk membangun aplikasi web modern \u2014 dari frontend yang interaktif hingga backend yang handal, serta tools yang mendukung alur kerja yang efisien."), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Reveal, {
        class: "relative mx-auto",
        delay: 100,
        direction: "right",
        parallax: 14
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AvatarIllustration, {
              size: 250,
              variant: "laptop"
            }, null, _parent2, _scopeId));
            _push2(`<!--[-->`);
            ssrRenderList(floatingBoxes, (b) => {
              _push2(`<div class="${ssrRenderClass([b.pos, "absolute flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-card animate-float"])}" style="${ssrRenderStyle({ color: b.color, animationDelay: b.delay })}" role="img"${ssrRenderAttr("aria-label", `Ikon ${b.label}`)} data-v-db37dfdc${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(b.icon), {
                size: 22,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              createVNode(_component_AvatarIllustration, {
                size: 250,
                variant: "laptop"
              }),
              (openBlock(), createBlock(Fragment, null, renderList(floatingBoxes, (b) => {
                return createVNode("div", {
                  key: b.label,
                  class: ["absolute flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-card animate-float", b.pos],
                  style: { color: b.color, animationDelay: b.delay },
                  role: "img",
                  "aria-label": `Ikon ${b.label}`
                }, [
                  (openBlock(), createBlock(resolveDynamicComponent(b.icon), {
                    size: 22,
                    "stroke-width": 1.5
                  }))
                ], 14, ["aria-label"]);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><div class="mt-14 flex flex-wrap gap-2.5" role="tablist"${ssrRenderAttr("aria-label", (_a = unref(headings).filterAria) != null ? _a : "Filter kategori skill")} data-v-db37dfdc><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        var _a2;
        _push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeCat) === cat)} class="${ssrRenderClass([unref(activeCat) === cat ? "border-transparent bg-gradient-brand text-white shadow-btn-glow" : "border-border bg-card text-text-secondary hover:border-primary/50 hover:text-text", "rounded-full border px-4 py-2 text-sm font-medium transition-colors"])}" data-v-db37dfdc>${ssrInterpolate(cat === "all" ? (_a2 = unref(headings).allSkills) != null ? _a2 : "All Skills" : cat)}</button>`);
      });
      _push(`<!--]--></div><section class="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]" data-v-db37dfdc><div class="space-y-6" data-v-db37dfdc>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "card p-7",
        parallax: 8
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d;
          if (_push2) {
            _push2(`<h2 class="section-label" data-v-db37dfdc${_scopeId}><span class="dot" aria-hidden="true" data-v-db37dfdc${_scopeId}></span> ${ssrInterpolate((_a2 = unref(headings).technicalSkills) != null ? _a2 : "Technical Skills")}</h2>`);
            if (unref(activeCat) === "all") {
              _push2(`<div class="mt-6 space-y-8" data-v-db37dfdc${_scopeId}><!--[-->`);
              ssrRenderList(unref(groups), ([cat, items]) => {
                _push2(`<div data-v-db37dfdc${_scopeId}><div class="mb-3 flex items-center gap-2" data-v-db37dfdc${_scopeId}><h3 class="text-sm font-bold text-text" data-v-db37dfdc${_scopeId}>${ssrInterpolate(cat)}</h3><span class="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-text-muted" data-v-db37dfdc${_scopeId}>${ssrInterpolate(items.length)}</span></div><div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" data-v-db37dfdc${_scopeId}><!--[-->`);
                ssrRenderList(items, (s) => {
                  var _a3, _b2;
                  _push2(`<div class="skill-tile group" style="${ssrRenderStyle({ "--tile-color": techColor(s.name) })}" data-v-db37dfdc${_scopeId}><span class="skill-tile-glyph" style="${ssrRenderStyle({ color: techColor(s.name), backgroundColor: `${techColor(s.name)}1f` })}" aria-hidden="true" data-v-db37dfdc${_scopeId}>${ssrInterpolate((_b2 = (_a3 = techFor(s.name)) == null ? void 0 : _a3.glyph) != null ? _b2 : s.name.slice(0, 2).toUpperCase())}</span><div class="min-w-0" data-v-db37dfdc${_scopeId}><p class="truncate text-sm font-semibold text-text" data-v-db37dfdc${_scopeId}>${ssrInterpolate(s.name)}</p><p class="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-text-muted" data-v-db37dfdc${_scopeId}><span class="h-1 w-1 rounded-full" style="${ssrRenderStyle({ backgroundColor: techColor(s.name) })}" aria-hidden="true" data-v-db37dfdc${_scopeId}></span> ${ssrInterpolate(s.level)}% </p></div><span class="ml-auto h-1.5 w-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary" aria-hidden="true" data-v-db37dfdc${_scopeId}></span></div>`);
                });
                _push2(`<!--]--></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" data-v-db37dfdc${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredSkills), (s) => {
                var _a3, _b2;
                _push2(`<div class="skill-tile group" style="${ssrRenderStyle({ "--tile-color": techColor(s.name) })}" data-v-db37dfdc${_scopeId}><span class="skill-tile-glyph" style="${ssrRenderStyle({ color: techColor(s.name), backgroundColor: `${techColor(s.name)}1f` })}" aria-hidden="true" data-v-db37dfdc${_scopeId}>${ssrInterpolate((_b2 = (_a3 = techFor(s.name)) == null ? void 0 : _a3.glyph) != null ? _b2 : s.name.slice(0, 2).toUpperCase())}</span><div class="min-w-0" data-v-db37dfdc${_scopeId}><p class="truncate text-sm font-semibold text-text" data-v-db37dfdc${_scopeId}>${ssrInterpolate(s.name)}</p><p class="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-text-muted" data-v-db37dfdc${_scopeId}><span class="h-1 w-1 rounded-full" style="${ssrRenderStyle({ backgroundColor: techColor(s.name) })}" aria-hidden="true" data-v-db37dfdc${_scopeId}></span> ${ssrInterpolate(s.level)}% </p></div><span class="ml-auto h-1.5 w-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary" aria-hidden="true" data-v-db37dfdc${_scopeId}></span></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            if (!unref(filteredSkills).length) {
              _push2(`<p class="mt-6 rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted" data-v-db37dfdc${_scopeId}>${ssrInterpolate((_b = unref(headings).emptyCategory) != null ? _b : "Belum ada skill pada kategori ini.")}</p>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("h2", { class: "section-label" }, [
                createVNode("span", {
                  class: "dot",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString((_c = unref(headings).technicalSkills) != null ? _c : "Technical Skills"), 1)
              ]),
              unref(activeCat) === "all" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-6 space-y-8"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(groups), ([cat, items]) => {
                  return openBlock(), createBlock("div", { key: cat }, [
                    createVNode("div", { class: "mb-3 flex items-center gap-2" }, [
                      createVNode("h3", { class: "text-sm font-bold text-text" }, toDisplayString(cat), 1),
                      createVNode("span", { class: "rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-text-muted" }, toDisplayString(items.length), 1)
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(items, (s) => {
                        var _a3, _b2;
                        return openBlock(), createBlock("div", {
                          key: s.name,
                          class: "skill-tile group",
                          style: { "--tile-color": techColor(s.name) }
                        }, [
                          createVNode("span", {
                            class: "skill-tile-glyph",
                            style: { color: techColor(s.name), backgroundColor: `${techColor(s.name)}1f` },
                            "aria-hidden": "true"
                          }, toDisplayString((_b2 = (_a3 = techFor(s.name)) == null ? void 0 : _a3.glyph) != null ? _b2 : s.name.slice(0, 2).toUpperCase()), 5),
                          createVNode("div", { class: "min-w-0" }, [
                            createVNode("p", { class: "truncate text-sm font-semibold text-text" }, toDisplayString(s.name), 1),
                            createVNode("p", { class: "mt-0.5 flex items-center gap-1 text-[11px] font-medium text-text-muted" }, [
                              createVNode("span", {
                                class: "h-1 w-1 rounded-full",
                                style: { backgroundColor: techColor(s.name) },
                                "aria-hidden": "true"
                              }, null, 4),
                              createTextVNode(" " + toDisplayString(s.level) + "% ", 1)
                            ])
                          ]),
                          createVNode("span", {
                            class: "ml-auto h-1.5 w-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary",
                            "aria-hidden": "true"
                          })
                        ], 4);
                      }), 128))
                    ])
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredSkills), (s) => {
                  var _a3, _b2;
                  return openBlock(), createBlock("div", {
                    key: s.name,
                    class: "skill-tile group",
                    style: { "--tile-color": techColor(s.name) }
                  }, [
                    createVNode("span", {
                      class: "skill-tile-glyph",
                      style: { color: techColor(s.name), backgroundColor: `${techColor(s.name)}1f` },
                      "aria-hidden": "true"
                    }, toDisplayString((_b2 = (_a3 = techFor(s.name)) == null ? void 0 : _a3.glyph) != null ? _b2 : s.name.slice(0, 2).toUpperCase()), 5),
                    createVNode("div", { class: "min-w-0" }, [
                      createVNode("p", { class: "truncate text-sm font-semibold text-text" }, toDisplayString(s.name), 1),
                      createVNode("p", { class: "mt-0.5 flex items-center gap-1 text-[11px] font-medium text-text-muted" }, [
                        createVNode("span", {
                          class: "h-1 w-1 rounded-full",
                          style: { backgroundColor: techColor(s.name) },
                          "aria-hidden": "true"
                        }, null, 4),
                        createTextVNode(" " + toDisplayString(s.level) + "% ", 1)
                      ])
                    ]),
                    createVNode("span", {
                      class: "ml-auto h-1.5 w-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary",
                      "aria-hidden": "true"
                    })
                  ], 4);
                }), 128))
              ])),
              !unref(filteredSkills).length ? (openBlock(), createBlock("p", {
                key: 2,
                class: "mt-6 rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted"
              }, toDisplayString((_d = unref(headings).emptyCategory) != null ? _d : "Belum ada skill pada kategori ini."), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Reveal, {
        class: "flex flex-col items-center justify-between gap-4 rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 to-blue/10 p-6 sm:flex-row",
        delay: 100
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b;
          if (_push2) {
            _push2(`<p class="text-center font-semibold text-text sm:text-left" data-v-db37dfdc${_scopeId}>${ssrInterpolate((_a2 = unref(headings).wantWork) != null ? _a2 : "Want to work together?")}</p>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/contact",
              class: "btn-primary shrink-0 !py-2.5"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(`${ssrInterpolate((_a3 = unref(headings).contactMe) != null ? _a3 : "Contact Me")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString((_b2 = unref(headings).contactMe) != null ? _b2 : "Contact Me"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("p", { class: "text-center font-semibold text-text sm:text-left" }, toDisplayString((_b = unref(headings).wantWork) != null ? _b : "Want to work together?"), 1),
              createVNode(_component_NuxtLink, {
                to: "/contact",
                class: "btn-primary shrink-0 !py-2.5"
              }, {
                default: withCtx(() => {
                  var _a3;
                  return [
                    createTextVNode(toDisplayString((_a3 = unref(headings).contactMe) != null ? _a3 : "Contact Me"), 1)
                  ];
                }),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-6" data-v-db37dfdc>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "card p-6",
        parallax: 10
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<h2 class="section-label" data-v-db37dfdc${_scopeId}><span class="dot" aria-hidden="true" data-v-db37dfdc${_scopeId}></span> ${ssrInterpolate((_a2 = unref(headings).skillsSummary) != null ? _a2 : "Skills Summary")}</h2><div class="mt-5 grid grid-cols-2 gap-4" data-v-db37dfdc${_scopeId}><!--[-->`);
            ssrRenderList((_c = (_b = unref(skills2)) == null ? void 0 : _b.skillsSummary) != null ? _c : [], (s) => {
              _push2(`<div class="rounded-card border border-border bg-bg p-4" data-v-db37dfdc${_scopeId}><span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary" aria-hidden="true" data-v-db37dfdc${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(summaryIcons[s.icon]), {
                size: 17,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</span><p class="mt-3 text-xl font-extrabold text-text" data-v-db37dfdc${_scopeId}>${ssrInterpolate(s.value)}</p><p class="mt-0.5 text-xs font-medium text-text-muted" data-v-db37dfdc${_scopeId}>${ssrInterpolate(s.label)}</p></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("h2", { class: "section-label" }, [
                createVNode("span", {
                  class: "dot",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString((_d = unref(headings).skillsSummary) != null ? _d : "Skills Summary"), 1)
              ]),
              createVNode("div", { class: "mt-5 grid grid-cols-2 gap-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList((_f = (_e = unref(skills2)) == null ? void 0 : _e.skillsSummary) != null ? _f : [], (s) => {
                  return openBlock(), createBlock("div", {
                    key: s.label,
                    class: "rounded-card border border-border bg-bg p-4"
                  }, [
                    createVNode("span", {
                      class: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary",
                      "aria-hidden": "true"
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(summaryIcons[s.icon]), {
                        size: 17,
                        "stroke-width": 1.5
                      }))
                    ]),
                    createVNode("p", { class: "mt-3 text-xl font-extrabold text-text" }, toDisplayString(s.value), 1),
                    createVNode("p", { class: "mt-0.5 text-xs font-medium text-text-muted" }, toDisplayString(s.label), 1)
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Reveal, {
        class: "card p-6",
        delay: 80,
        direction: "left",
        parallax: 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<h2 class="section-label" data-v-db37dfdc${_scopeId}><span class="dot" aria-hidden="true" data-v-db37dfdc${_scopeId}></span> ${ssrInterpolate((_a2 = unref(headings).toolsOthers) != null ? _a2 : "Tools & Others")}</h2><div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" data-v-db37dfdc${_scopeId}><!--[-->`);
            ssrRenderList((_c = (_b = unref(skills2)) == null ? void 0 : _b.toolsList) != null ? _c : [], (tool) => {
              _push2(`<div class="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2.5 transition-colors hover:border-primary/40" data-v-db37dfdc${_scopeId}><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gradient-brand text-[9px] font-bold text-white" aria-hidden="true" data-v-db37dfdc${_scopeId}>${ssrInterpolate(tool.slice(0, 2).toUpperCase())}</span><span class="truncate text-xs font-medium text-text-secondary" data-v-db37dfdc${_scopeId}>${ssrInterpolate(tool)}</span></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("h2", { class: "section-label" }, [
                createVNode("span", {
                  class: "dot",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString((_d = unref(headings).toolsOthers) != null ? _d : "Tools & Others"), 1)
              ]),
              createVNode("div", { class: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList((_f = (_e = unref(skills2)) == null ? void 0 : _e.toolsList) != null ? _f : [], (tool) => {
                  return openBlock(), createBlock("div", {
                    key: tool,
                    class: "flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2.5 transition-colors hover:border-primary/40"
                  }, [
                    createVNode("span", {
                      class: "flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gradient-brand text-[9px] font-bold text-white",
                      "aria-hidden": "true"
                    }, toDisplayString(tool.slice(0, 2).toUpperCase()), 1),
                    createVNode("span", { class: "truncate text-xs font-medium text-text-secondary" }, toDisplayString(tool), 1)
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Reveal, {
        class: "card p-6",
        delay: 160,
        direction: "right",
        parallax: 14
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<h2 class="section-label" data-v-db37dfdc${_scopeId}><span class="dot" aria-hidden="true" data-v-db37dfdc${_scopeId}></span> ${ssrInterpolate((_a2 = unref(headings).softSkills) != null ? _a2 : "Soft Skills")}</h2><div class="mt-5 flex flex-wrap gap-2" data-v-db37dfdc${_scopeId}><!--[-->`);
            ssrRenderList((_c = (_b = unref(skills2)) == null ? void 0 : _b.softSkills) != null ? _c : [], (soft) => {
              _push2(`<span class="rounded-full border border-border bg-bg px-3.5 py-1.5 text-xs font-medium text-text-secondary" data-v-db37dfdc${_scopeId}>${ssrInterpolate(soft)}</span>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("h2", { class: "section-label" }, [
                createVNode("span", {
                  class: "dot",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString((_d = unref(headings).softSkills) != null ? _d : "Soft Skills"), 1)
              ]),
              createVNode("div", { class: "mt-5 flex flex-wrap gap-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList((_f = (_e = unref(skills2)) == null ? void 0 : _e.softSkills) != null ? _f : [], (soft) => {
                  return openBlock(), createBlock("span", {
                    key: soft,
                    class: "rounded-full border border-border bg-bg px-3.5 py-1.5 text-xs font-medium text-text-secondary"
                  }, toDisplayString(soft), 1);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/skills.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const skills = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db37dfdc"]]);

export { skills as default };
//# sourceMappingURL=skills-Dk9K0jfF.mjs.map
