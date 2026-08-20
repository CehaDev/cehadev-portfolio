import { _ as _sfc_main$1 } from './Reveal-B94-pL53.mjs';
import { _ as _sfc_main$2 } from './AvatarIllustration-CKtNMuk4.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$3 } from './CountUp-2uvjSD__.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { MapPin, Mail, Globe, Phone, Code2, Database, Monitor, Wrench, Palette, Terminal, Boxes, Braces, Download, CheckCircle2, Quote, Target, FolderGit2, Clock } from 'lucide-vue-next';
import { f as findTechByName } from './useSkills-YG6FZoMb.mjs';
import { a as useSiteSettings, b as useSkillsContent } from './useContentData-B9bxi5bI.mjs';
import { u as useI18n } from './useI18n-Djb0t6ty.mjs';
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
  __name: "about",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    const { t } = useI18n();
    useSeoMeta({
      title: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.about) == null ? void 0 : _c.title) != null ? _d : "About | CehaDev";
      },
      description: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.about) == null ? void 0 : _c.description) != null ? _d : "Kenali lebih dekat CehaDev \u2014 Web Developer yang berfokus pada Nuxt.js, Vue.js, dan Node.js.";
      }
    });
    const headings = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.about) != null ? _c : {};
    });
    const { data: skills } = ([__temp, __restore] = withAsyncContext(() => useSkillsContent()), __temp = await __temp, __restore(), __temp);
    const statIcons = {
      Clock,
      FolderGit2,
      Code2,
      Target
    };
    const facts = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return [
        { icon: MapPin, label: (_a = headings.value.factLocation) != null ? _a : "Lokasi", value: (_b = site.value) == null ? void 0 : _b.location },
        { icon: Mail, label: (_c = headings.value.factEmail) != null ? _c : "Email", value: (_d = site.value) == null ? void 0 : _d.email },
        { icon: Globe, label: (_e = headings.value.factWebsite) != null ? _e : "Website", value: (_f = site.value) == null ? void 0 : _f.website },
        { icon: Phone, label: (_g = headings.value.factPhone) != null ? _g : "Telepon", value: (_h = site.value) == null ? void 0 : _h.phone }
      ];
    });
    const categoryIcons = {
      Bahasa: Braces,
      Language: Braces,
      Framework: Boxes,
      Runtime: Terminal,
      Styling: Palette,
      Tooling: Wrench,
      OS: Monitor,
      Database,
      Lainnya: Code2,
      Others: Code2
    };
    const legacyCategory = {
      javascript: "Bahasa",
      typescript: "Bahasa",
      php: "Bahasa",
      html5: "Bahasa",
      vue: "Framework",
      nuxt: "Framework",
      node: "Runtime",
      tailwind: "Styling",
      css3: "Styling",
      mysql: "Database",
      git: "Tooling",
      linux: "OS"
    };
    const techSkills = computed(() => {
      var _a, _b, _c, _d, _e, _f;
      const fallback = (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.about) == null ? void 0 : _c.otherCategory) != null ? _d : "Lainnya";
      return ((_f = (_e = skills.value) == null ? void 0 : _e.technicalSkills) != null ? _f : []).map((s) => ({
        ...s,
        category: s.category || legacyCategory[s.tech] || fallback
      }));
    });
    const stackGroups = computed(() => {
      var _a, _b, _c, _d;
      const fallback = (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.about) == null ? void 0 : _c.otherCategory) != null ? _d : "Lainnya";
      const groups = [];
      for (const item of techSkills.value) {
        const category = item.category || fallback;
        let group = groups.find((g) => g.category === category);
        if (!group) {
          group = { category, items: [] };
          groups.push(group);
        }
        group.items.push(item);
      }
      return groups.map((g) => {
        var _a2;
        return { ...g, icon: (_a2 = categoryIcons[g.category]) != null ? _a2 : Code2 };
      });
    });
    const stats = computed(() => {
      var _a, _b;
      const list = (_b = (_a = site.value) == null ? void 0 : _a.stats) != null ? _b : [];
      if (!list.length) return [];
      const hours = list.find((s) => s.icon === "Clock");
      const rest = list.filter((s) => s.icon !== "Clock");
      return [hours, ...rest].filter(Boolean);
    });
    function techColor(name) {
      var _a, _b;
      return (_b = (_a = findTechByName(name)) == null ? void 0 : _a.color) != null ? _b : "#8B5CF6";
    }
    function statIcon(icon) {
      return statIcons[icon];
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_Reveal = _sfc_main$1;
      const _component_AvatarIllustration = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CountUp = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden" }, _attrs))} data-v-6282a407><section class="relative overflow-hidden" data-v-6282a407><div class="pointer-events-none absolute inset-0 -z-10" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.12), transparent 50%),\n            radial-gradient(circle at 85% 60%, rgba(59, 130, 246, 0.1), transparent 42%)" })}" aria-hidden="true" data-v-6282a407></div><div class="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern" style="${ssrRenderStyle({ "mask-image": "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)" })}" aria-hidden="true" data-v-6282a407></div><div class="container-site py-16 text-center md:py-24" data-v-6282a407>`);
      _push(ssrRenderComponent(_component_Reveal, { parallax: 20 }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
          if (_push2) {
            _push2(`<div class="relative mx-auto flex justify-center" data-v-6282a407${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AvatarIllustration, {
              size: 180,
              variant: "code"
            }, null, _parent2, _scopeId));
            _push2(`<div class="animate-float absolute bottom-4 -left-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:left-10" data-v-6282a407${_scopeId}><p class="font-mono text-base font-bold text-text" data-v-6282a407${_scopeId}>2<span class="text-primary" data-v-6282a407${_scopeId}>+</span> <span class="text-xs font-medium text-text-muted" data-v-6282a407${_scopeId}>${ssrInterpolate((_a2 = unref(headings).yearsShort) != null ? _a2 : "yrs")}</span></p></div><div class="animate-float absolute right-0 top-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:right-10" style="${ssrRenderStyle({ "animation-delay": "0.8s" })}" data-v-6282a407${_scopeId}><p class="font-mono text-base font-bold text-text" data-v-6282a407${_scopeId}>10<span class="text-primary" data-v-6282a407${_scopeId}>+</span> <span class="text-xs font-medium text-text-muted" data-v-6282a407${_scopeId}>${ssrInterpolate((_b2 = unref(headings).projectsShort) != null ? _b2 : "projects")}</span></p></div></div><span class="mt-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card" data-v-6282a407${_scopeId}><span class="relative flex h-2 w-2" aria-hidden="true" data-v-6282a407${_scopeId}><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" data-v-6282a407${_scopeId}></span><span class="relative inline-flex h-2 w-2 rounded-full bg-success" data-v-6282a407${_scopeId}></span></span> ${ssrInterpolate((_c = unref(site)) == null ? void 0 : _c.heroBadge)} \xB7 ${ssrInterpolate((_d = unref(site)) == null ? void 0 : _d.location)}</span><h1 class="mt-6 text-5xl font-extrabold leading-none tracking-tight md:text-7xl" data-v-6282a407${_scopeId}><span class="text-text" data-v-6282a407${_scopeId}>Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent" data-v-6282a407${_scopeId}>Dev</span></h1><p class="mt-4 text-lg font-semibold text-text-secondary md:text-xl" data-v-6282a407${_scopeId}>${ssrInterpolate((_e = unref(site)) == null ? void 0 : _e.role)}</p><div class="mt-8 flex flex-wrap items-center justify-center gap-4" data-v-6282a407${_scopeId}><a${ssrRenderAttr("href", ((_f = unref(site)) == null ? void 0 : _f.cvUrl) ? `${unref(site).cvUrl}?download=1` : "/cv?download=1")} class="btn-primary" data-v-6282a407${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Download), {
              size: 16,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate((_g = unref(headings).downloadCv) != null ? _g : unref(t)("nav.downloadCv"))}</a>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/contact",
              class: "btn-outline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b3;
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Mail), {
                    size: 16,
                    "stroke-width": 1.75
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate((_a3 = unref(headings).letsTalk) != null ? _a3 : "Let's Talk")}`);
                } else {
                  return [
                    createVNode(unref(Mail), {
                      size: 16,
                      "stroke-width": 1.75
                    }),
                    createTextVNode(" " + toDisplayString((_b3 = unref(headings).letsTalk) != null ? _b3 : "Let's Talk"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "relative mx-auto flex justify-center" }, [
                createVNode(_component_AvatarIllustration, {
                  size: 180,
                  variant: "code"
                }),
                createVNode("div", { class: "animate-float absolute bottom-4 -left-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:left-10" }, [
                  createVNode("p", { class: "font-mono text-base font-bold text-text" }, [
                    createTextVNode("2"),
                    createVNode("span", { class: "text-primary" }, "+"),
                    createTextVNode(),
                    createVNode("span", { class: "text-xs font-medium text-text-muted" }, toDisplayString((_h = unref(headings).yearsShort) != null ? _h : "yrs"), 1)
                  ])
                ]),
                createVNode("div", {
                  class: "animate-float absolute right-0 top-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:right-10",
                  style: { "animation-delay": "0.8s" }
                }, [
                  createVNode("p", { class: "font-mono text-base font-bold text-text" }, [
                    createTextVNode("10"),
                    createVNode("span", { class: "text-primary" }, "+"),
                    createTextVNode(),
                    createVNode("span", { class: "text-xs font-medium text-text-muted" }, toDisplayString((_i = unref(headings).projectsShort) != null ? _i : "projects"), 1)
                  ])
                ])
              ]),
              createVNode("span", { class: "mt-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card" }, [
                createVNode("span", {
                  class: "relative flex h-2 w-2",
                  "aria-hidden": "true"
                }, [
                  createVNode("span", { class: "absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" }),
                  createVNode("span", { class: "relative inline-flex h-2 w-2 rounded-full bg-success" })
                ]),
                createTextVNode(" " + toDisplayString((_j = unref(site)) == null ? void 0 : _j.heroBadge) + " \xB7 " + toDisplayString((_k = unref(site)) == null ? void 0 : _k.location), 1)
              ]),
              createVNode("h1", { class: "mt-6 text-5xl font-extrabold leading-none tracking-tight md:text-7xl" }, [
                createVNode("span", { class: "text-text" }, "Ceha"),
                createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, "Dev")
              ]),
              createVNode("p", { class: "mt-4 text-lg font-semibold text-text-secondary md:text-xl" }, toDisplayString((_l = unref(site)) == null ? void 0 : _l.role), 1),
              createVNode("div", { class: "mt-8 flex flex-wrap items-center justify-center gap-4" }, [
                createVNode("a", {
                  href: ((_m = unref(site)) == null ? void 0 : _m.cvUrl) ? `${unref(site).cvUrl}?download=1` : "/cv?download=1",
                  class: "btn-primary"
                }, [
                  createVNode(unref(Download), {
                    size: 16,
                    "stroke-width": 2
                  }),
                  createTextVNode(" " + toDisplayString((_n = unref(headings).downloadCv) != null ? _n : unref(t)("nav.downloadCv")), 1)
                ], 8, ["href"]),
                createVNode(_component_NuxtLink, {
                  to: "/contact",
                  class: "btn-outline"
                }, {
                  default: withCtx(() => {
                    var _a3;
                    return [
                      createVNode(unref(Mail), {
                        size: 16,
                        "stroke-width": 1.75
                      }),
                      createTextVNode(" " + toDisplayString((_a3 = unref(headings).letsTalk) != null ? _a3 : "Let's Talk"), 1)
                    ];
                  }),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="container-site pb-16" data-v-6282a407>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border/60 lg:grid-cols-4",
        direction: "up",
        parallax: 10
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(stats), (s) => {
              var _a2;
              _push2(`<div class="flex flex-col items-center justify-center gap-1.5 bg-card p-6 text-center" data-v-6282a407${_scopeId}><span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true" data-v-6282a407${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(statIcon(s.icon)), {
                size: 20,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</span><dd class="font-mono text-2xl font-extrabold tracking-tight text-text" data-v-6282a407${_scopeId}>`);
              _push2(ssrRenderComponent(_component_CountUp, {
                end: s.end,
                suffix: (_a2 = s.suffix) != null ? _a2 : ""
              }, null, _parent2, _scopeId));
              _push2(`</dd><dt class="text-xs font-medium text-text-secondary" data-v-6282a407${_scopeId}>${ssrInterpolate(s.label)} <span class="text-text-muted" data-v-6282a407${_scopeId}>\xB7 ${ssrInterpolate(s.sub)}</span></dt></div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(stats), (s) => {
                var _a2;
                return openBlock(), createBlock("div", {
                  key: s.label,
                  class: "flex flex-col items-center justify-center gap-1.5 bg-card p-6 text-center"
                }, [
                  createVNode("span", {
                    class: "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary",
                    "aria-hidden": "true"
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(statIcon(s.icon)), {
                      size: 20,
                      "stroke-width": 1.5
                    }))
                  ]),
                  createVNode("dd", { class: "font-mono text-2xl font-extrabold tracking-tight text-text" }, [
                    createVNode(_component_CountUp, {
                      end: s.end,
                      suffix: (_a2 = s.suffix) != null ? _a2 : ""
                    }, null, 8, ["end", "suffix"])
                  ]),
                  createVNode("dt", { class: "text-xs font-medium text-text-secondary" }, [
                    createTextVNode(toDisplayString(s.label) + " ", 1),
                    createVNode("span", { class: "text-text-muted" }, "\xB7 " + toDisplayString(s.sub), 1)
                  ])
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="container-site pb-20" data-v-6282a407><div class="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16" data-v-6282a407><div data-v-6282a407>`);
      _push(ssrRenderComponent(_component_Reveal, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<p class="font-mono text-xs uppercase tracking-[0.2em] text-primary" data-v-6282a407${_scopeId}>${ssrInterpolate((_a2 = unref(headings).aboutLabel) != null ? _a2 : "01 \xB7 Tentang Saya")}</p><h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text md:text-4xl" data-v-6282a407${_scopeId}>${ssrInterpolate((_b2 = unref(headings).whyHead1) != null ? _b2 : "Why I love")} <span class="bg-gradient-brand bg-clip-text text-transparent" data-v-6282a407${_scopeId}>${ssrInterpolate((_c = unref(headings).whyHead2) != null ? _c : "building for the web")}</span></h2>`);
          } else {
            return [
              createVNode("p", { class: "font-mono text-xs uppercase tracking-[0.2em] text-primary" }, toDisplayString((_d = unref(headings).aboutLabel) != null ? _d : "01 \xB7 Tentang Saya"), 1),
              createVNode("h2", { class: "mt-3 text-2xl font-extrabold tracking-tight text-text md:text-4xl" }, [
                createTextVNode(toDisplayString((_e = unref(headings).whyHead1) != null ? _e : "Why I love") + " ", 1),
                createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_f = unref(headings).whyHead2) != null ? _f : "building for the web"), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Reveal, {
        class: "mt-6 space-y-4 text-[15px] leading-relaxed text-text-secondary",
        direction: "left",
        parallax: 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d;
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList((_b2 = (_a2 = unref(site)) == null ? void 0 : _a2.aboutIntro) != null ? _b2 : [], (para, i) => {
              _push2(`<p data-v-6282a407${_scopeId}>${ssrInterpolate(para)}</p>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList((_d = (_c = unref(site)) == null ? void 0 : _c.aboutIntro) != null ? _d : [], (para, i) => {
                return openBlock(), createBlock("p", { key: i }, toDisplayString(para), 1);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<ul class="mt-8 space-y-3" data-v-6282a407><!--[-->`);
      ssrRenderList((_b = (_a = unref(site)) == null ? void 0 : _a.aboutChecklist) != null ? _b : [], (item, idx) => {
        _push(ssrRenderComponent(_component_Reveal, {
          key: item,
          class: "group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40",
          delay: idx * 80,
          direction: "left",
          parallax: 6 + idx * 3
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/25" aria-hidden="true" data-v-6282a407${_scopeId}>`);
              _push2(ssrRenderComponent(unref(CheckCircle2), {
                size: 16,
                "stroke-width": 2
              }, null, _parent2, _scopeId));
              _push2(`</span><p class="text-sm leading-relaxed text-text-secondary" data-v-6282a407${_scopeId}>${ssrInterpolate(item)}</p>`);
            } else {
              return [
                createVNode("span", {
                  class: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/25",
                  "aria-hidden": "true"
                }, [
                  createVNode(unref(CheckCircle2), {
                    size: 16,
                    "stroke-width": 2
                  })
                ]),
                createVNode("p", { class: "text-sm leading-relaxed text-text-secondary" }, toDisplayString(item), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></ul></div>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "lg:sticky lg:top-24",
        direction: "right",
        parallax: 15
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<div class="card overflow-hidden" data-v-6282a407${_scopeId}><div class="relative flex flex-col items-center px-6 pb-6 pt-9 text-center" data-v-6282a407${_scopeId}><div class="pointer-events-none absolute -top-14 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" data-v-6282a407${_scopeId}></div>`);
            _push2(ssrRenderComponent(_component_AvatarIllustration, {
              size: 116,
              variant: "code",
              class: "relative"
            }, null, _parent2, _scopeId));
            _push2(`<h3 class="mt-4 text-xl font-extrabold text-text" data-v-6282a407${_scopeId}>${ssrInterpolate((_a2 = unref(site)) == null ? void 0 : _a2.name)}</h3><p class="mt-1 text-sm text-text-secondary" data-v-6282a407${_scopeId}>${ssrInterpolate((_b2 = unref(site)) == null ? void 0 : _b2.role)}</p><span class="mt-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-medium text-success" data-v-6282a407${_scopeId}><span class="relative flex h-1.5 w-1.5" aria-hidden="true" data-v-6282a407${_scopeId}><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" data-v-6282a407${_scopeId}></span><span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" data-v-6282a407${_scopeId}></span></span> ${ssrInterpolate((_c = unref(site)) == null ? void 0 : _c.heroBadge)}</span></div><div class="border-t border-border bg-bg/60 px-5 py-3" data-v-6282a407${_scopeId}><!--[-->`);
            ssrRenderList(unref(facts), (f) => {
              _push2(`<div class="flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-card" data-v-6282a407${_scopeId}><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true" data-v-6282a407${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(f.icon), {
                size: 18,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</span><div class="min-w-0" data-v-6282a407${_scopeId}><p class="text-xs text-text-muted" data-v-6282a407${_scopeId}>${ssrInterpolate(f.label)}</p><p class="truncate text-sm font-semibold text-text" data-v-6282a407${_scopeId}>${ssrInterpolate(f.value)}</p></div></div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "card overflow-hidden" }, [
                createVNode("div", { class: "relative flex flex-col items-center px-6 pb-6 pt-9 text-center" }, [
                  createVNode("div", {
                    class: "pointer-events-none absolute -top-14 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl",
                    "aria-hidden": "true"
                  }),
                  createVNode(_component_AvatarIllustration, {
                    size: 116,
                    variant: "code",
                    class: "relative"
                  }),
                  createVNode("h3", { class: "mt-4 text-xl font-extrabold text-text" }, toDisplayString((_d = unref(site)) == null ? void 0 : _d.name), 1),
                  createVNode("p", { class: "mt-1 text-sm text-text-secondary" }, toDisplayString((_e = unref(site)) == null ? void 0 : _e.role), 1),
                  createVNode("span", { class: "mt-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-medium text-success" }, [
                    createVNode("span", {
                      class: "relative flex h-1.5 w-1.5",
                      "aria-hidden": "true"
                    }, [
                      createVNode("span", { class: "absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" }),
                      createVNode("span", { class: "relative inline-flex h-1.5 w-1.5 rounded-full bg-success" })
                    ]),
                    createTextVNode(" " + toDisplayString((_f = unref(site)) == null ? void 0 : _f.heroBadge), 1)
                  ])
                ]),
                createVNode("div", { class: "border-t border-border bg-bg/60 px-5 py-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(facts), (f) => {
                    return openBlock(), createBlock("div", {
                      key: f.label,
                      class: "flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-card"
                    }, [
                      createVNode("span", {
                        class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
                        "aria-hidden": "true"
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(f.icon), {
                          size: 18,
                          "stroke-width": 1.5
                        }))
                      ]),
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "text-xs text-text-muted" }, toDisplayString(f.label), 1),
                        createVNode("p", { class: "truncate text-sm font-semibold text-text" }, toDisplayString(f.value), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="container-site pb-20" data-v-6282a407>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "mx-auto max-w-3xl text-center",
        direction: "blur",
        parallax: 18
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true" data-v-6282a407${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Quote), {
              size: 22,
              "stroke-width": 1.5
            }, null, _parent2, _scopeId));
            _push2(`</span><blockquote class="mt-6 text-2xl font-bold leading-snug tracking-tight text-text md:text-3xl" data-v-6282a407${_scopeId}>${ssrInterpolate((_a2 = unref(site)) == null ? void 0 : _a2.quote)} <span class="bg-gradient-brand bg-clip-text text-transparent" data-v-6282a407${_scopeId}>${ssrInterpolate((_b2 = unref(site)) == null ? void 0 : _b2.quoteHighlight)}</span></blockquote><p class="mt-4 font-mono text-sm text-text-muted" data-v-6282a407${_scopeId}>\u2014 ${ssrInterpolate((_c = unref(site)) == null ? void 0 : _c.heroTitleGradient)}</p>`);
          } else {
            return [
              createVNode("span", {
                class: "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary",
                "aria-hidden": "true"
              }, [
                createVNode(unref(Quote), {
                  size: 22,
                  "stroke-width": 1.5
                })
              ]),
              createVNode("blockquote", { class: "mt-6 text-2xl font-bold leading-snug tracking-tight text-text md:text-3xl" }, [
                createTextVNode(toDisplayString((_d = unref(site)) == null ? void 0 : _d.quote) + " ", 1),
                createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_e = unref(site)) == null ? void 0 : _e.quoteHighlight), 1)
              ]),
              createVNode("p", { class: "mt-4 font-mono text-sm text-text-muted" }, "\u2014 " + toDisplayString((_f = unref(site)) == null ? void 0 : _f.heroTitleGradient), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><section class="container-site pb-20 text-center" data-v-6282a407>`);
      _push(ssrRenderComponent(_component_Reveal, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<p class="font-mono text-xs uppercase tracking-[0.2em] text-primary" data-v-6282a407${_scopeId}>${ssrInterpolate((_a2 = unref(headings).techLabel) != null ? _a2 : "02 \xB7 Tech Stack")}</p><h2 class="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl" data-v-6282a407${_scopeId}>${ssrInterpolate((_b2 = unref(headings).toolsHead1) != null ? _b2 : "Tools I")} <span class="bg-gradient-brand bg-clip-text text-transparent" data-v-6282a407${_scopeId}>${ssrInterpolate((_c = unref(headings).toolsHead2) != null ? _c : "work with")}</span></h2>`);
          } else {
            return [
              createVNode("p", { class: "font-mono text-xs uppercase tracking-[0.2em] text-primary" }, toDisplayString((_d = unref(headings).techLabel) != null ? _d : "02 \xB7 Tech Stack"), 1),
              createVNode("h2", { class: "mt-2 text-2xl font-extrabold tracking-tight md:text-4xl" }, [
                createTextVNode(toDisplayString((_e = unref(headings).toolsHead1) != null ? _e : "Tools I") + " ", 1),
                createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_f = unref(headings).toolsHead2) != null ? _f : "work with"), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mx-auto mt-12 grid max-w-5xl gap-5 text-left sm:grid-cols-2 lg:grid-cols-3" data-v-6282a407><!--[-->`);
      ssrRenderList(unref(stackGroups), (group, gIdx) => {
        _push(ssrRenderComponent(_component_Reveal, {
          key: group.category,
          class: "card group/card relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover",
          delay: gIdx * 100,
          direction: gIdx % 2 === 0 ? "left" : "right",
          parallax: 10 + gIdx * 4
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 opacity-0 group-hover/card:opacity-100" aria-hidden="true" data-v-6282a407${_scopeId}></div><div class="relative flex items-center gap-3" data-v-6282a407${_scopeId}><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true" data-v-6282a407${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(group.icon), {
                size: 18,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</span><h3 class="text-base font-bold text-text" data-v-6282a407${_scopeId}>${ssrInterpolate(group.category)}</h3><span class="ml-auto rounded-full border border-border bg-bg px-2.5 py-0.5 font-mono text-[11px] text-text-muted" data-v-6282a407${_scopeId}>${ssrInterpolate(group.items.length)}</span></div><ul class="relative mt-6 flex-1 space-y-4" data-v-6282a407${_scopeId}><!--[-->`);
              ssrRenderList(group.items, (s) => {
                var _a2, _b2, _c;
                _push2(`<li data-v-6282a407${_scopeId}><div class="flex items-center gap-3" data-v-6282a407${_scopeId}><span class="stack-glyph flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-[10px] font-bold" style="${ssrRenderStyle({ "--glyph-color": techColor(s.name) })}"${ssrRenderAttr("aria-label", s.name)} data-v-6282a407${_scopeId}>${ssrInterpolate((_b2 = (_a2 = unref(findTechByName)(s.name)) == null ? void 0 : _a2.glyph) != null ? _b2 : s.name.slice(0, 2).toUpperCase())}</span><span class="min-w-0 flex-1 truncate text-sm font-semibold text-text" data-v-6282a407${_scopeId}>${ssrInterpolate(s.name)}</span><span class="font-mono text-xs font-bold text-text-secondary" data-v-6282a407${_scopeId}>${ssrInterpolate(s.level)}<span class="text-text-muted" data-v-6282a407${_scopeId}>%</span></span></div><div class="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-alt" role="progressbar"${ssrRenderAttr("aria-label", ((_c = unref(headings).levelAria) != null ? _c : "Tingkat {{name}}").replace("{{name}}", s.name))}${ssrRenderAttr("aria-valuenow", s.level)} aria-valuemin="0" aria-valuemax="100" data-v-6282a407${_scopeId}><div class="skill-bar h-full rounded-full bg-gradient-brand" style="${ssrRenderStyle({ width: `${s.level}%` })}" data-v-6282a407${_scopeId}></div></div></li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                createVNode("div", {
                  class: "pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 opacity-0 group-hover/card:opacity-100",
                  "aria-hidden": "true"
                }),
                createVNode("div", { class: "relative flex items-center gap-3" }, [
                  createVNode("span", {
                    class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
                    "aria-hidden": "true"
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(group.icon), {
                      size: 18,
                      "stroke-width": 1.5
                    }))
                  ]),
                  createVNode("h3", { class: "text-base font-bold text-text" }, toDisplayString(group.category), 1),
                  createVNode("span", { class: "ml-auto rounded-full border border-border bg-bg px-2.5 py-0.5 font-mono text-[11px] text-text-muted" }, toDisplayString(group.items.length), 1)
                ]),
                createVNode("ul", { class: "relative mt-6 flex-1 space-y-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(group.items, (s) => {
                    var _a2, _b2, _c;
                    return openBlock(), createBlock("li", {
                      key: s.name
                    }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("span", {
                          class: "stack-glyph flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-[10px] font-bold",
                          style: { "--glyph-color": techColor(s.name) },
                          "aria-label": s.name
                        }, toDisplayString((_b2 = (_a2 = unref(findTechByName)(s.name)) == null ? void 0 : _a2.glyph) != null ? _b2 : s.name.slice(0, 2).toUpperCase()), 13, ["aria-label"]),
                        createVNode("span", { class: "min-w-0 flex-1 truncate text-sm font-semibold text-text" }, toDisplayString(s.name), 1),
                        createVNode("span", { class: "font-mono text-xs font-bold text-text-secondary" }, [
                          createTextVNode(toDisplayString(s.level), 1),
                          createVNode("span", { class: "text-text-muted" }, "%")
                        ])
                      ]),
                      createVNode("div", {
                        class: "mt-2 h-1.5 overflow-hidden rounded-full bg-bg-alt",
                        role: "progressbar",
                        "aria-label": ((_c = unref(headings).levelAria) != null ? _c : "Tingkat {{name}}").replace("{{name}}", s.name),
                        "aria-valuenow": s.level,
                        "aria-valuemin": "0",
                        "aria-valuemax": "100"
                      }, [
                        createVNode("div", {
                          class: "skill-bar h-full rounded-full bg-gradient-brand",
                          style: { width: `${s.level}%` }
                        }, null, 4)
                      ], 8, ["aria-label", "aria-valuenow"])
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6282a407"]]);

export { about as default };
//# sourceMappingURL=about-Cn5dTfwd.mjs.map
