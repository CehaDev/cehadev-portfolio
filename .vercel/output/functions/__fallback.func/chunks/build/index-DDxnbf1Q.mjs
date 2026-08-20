import { _ as _sfc_main$2 } from './Reveal-B94-pL53.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$3 } from './AvatarIllustration-CKtNMuk4.mjs';
import { _ as _sfc_main$4 } from './CountUp-2uvjSD__.mjs';
import { _ as _sfc_main$5 } from './ProjectThumb-BmgOVLSh.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, createVNode, resolveDynamicComponent, withCtx, unref, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { Github, Linkedin, Instagram, Mail, Rocket, Braces, Code2, Zap, Asterisk, Plus, Terminal, Sparkles, GitBranch, ArrowRight, ArrowUpRight, Eye } from 'lucide-vue-next';
import { u as useTilt } from './useTilt-LzR139NB.mjs';
import { u as useStats } from './useStats-Dk9h29Wa.mjs';
import { u as useI18n } from './useI18n-Djb0t6ty.mjs';
import { f as findTechByName } from './useSkills-YG6FZoMb.mjs';
import { a as useSiteSettings, b as useSkillsContent, d as useProjectsContent } from './useContentData-B9bxi5bI.mjs';
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
  __name: "FeaturedProjectCard",
  __ssrInlineRender: true,
  props: {
    project: {},
    index: {},
    variant: { default: "small" }
  },
  setup(__props) {
    const { tiltRef, glareRef, onMove, onLeave } = useTilt(6);
    const { viewsOf, formatCount } = useStats();
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ProjectThumb = _sfc_main$5;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        ref_key: "tiltRef",
        ref: tiltRef,
        to: `/projects/${__props.project.slug}`,
        class: "group relative block h-full overflow-hidden rounded-card border border-border shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover",
        onMousemove: unref(onMove),
        onMouseleave: unref(onLeave)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_component_ProjectThumb, {
              seed: __props.project.title.length + __props.project.year.length,
              label: __props.project.category,
              height: __props.variant === "large" ? "h-80 md:h-full" : "h-52"
            }, null, _parent2, _scopeId));
            _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true"${_scopeId}></div><div class="absolute inset-0 flex flex-col justify-end p-6 md:p-7"${_scopeId}>`);
            if (__props.variant === "large") {
              _push2(`<div class="flex items-center gap-2 text-xs text-white/70"${_scopeId}><span class="font-mono"${_scopeId}>0${ssrInterpolate(__props.index + 1)}</span><span class="h-1 w-1 rounded-full bg-white/50" aria-hidden="true"${_scopeId}></span><span${_scopeId}>${ssrInterpolate(__props.project.year)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h3 class="mt-2 text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-white md:text-3xl"${_scopeId}>${ssrInterpolate(__props.project.title)}</h3><p class="mt-2 max-w-lg text-sm leading-relaxed text-white/75 line-clamp-2"${_scopeId}>${ssrInterpolate(__props.project.tagline)}</p><div class="mt-4 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.project.tags.slice(0, 3), (t2) => {
              _push2(`<span class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm"${_scopeId}>${ssrInterpolate(t2)}</span>`);
            });
            _push2(`<!--]--><span class="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Eye), {
              size: 12,
              "stroke-width": 1.75,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(formatCount)(unref(viewsOf)(__props.project.slug)))} ${ssrInterpolate(unref(t)("common.viewed"))}</span></div></div><span class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-gradient-brand group-hover:shadow-btn-glow" aria-hidden="true"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowUpRight), {
              size: 18,
              "stroke-width": 1.75
            }, null, _parent2, _scopeId));
            _push2(`</span>`);
            if (__props.variant === "large") {
              _push2(`<span class="absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"${_scopeId}>${ssrInterpolate(unref(t)("projectCard.featured"))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("span", {
                ref_key: "glareRef",
                ref: glareRef,
                class: "pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                "aria-hidden": "true"
              }, null, 512),
              createVNode(_component_ProjectThumb, {
                seed: __props.project.title.length + __props.project.year.length,
                label: __props.project.category,
                height: __props.variant === "large" ? "h-80 md:h-full" : "h-52"
              }, null, 8, ["seed", "label", "height"]),
              createVNode("div", {
                class: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent",
                "aria-hidden": "true"
              }),
              createVNode("div", { class: "absolute inset-0 flex flex-col justify-end p-6 md:p-7" }, [
                __props.variant === "large" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex items-center gap-2 text-xs text-white/70"
                }, [
                  createVNode("span", { class: "font-mono" }, "0" + toDisplayString(__props.index + 1), 1),
                  createVNode("span", {
                    class: "h-1 w-1 rounded-full bg-white/50",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, toDisplayString(__props.project.year), 1)
                ])) : createCommentVNode("", true),
                createVNode("h3", { class: "mt-2 text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-white md:text-3xl" }, toDisplayString(__props.project.title), 1),
                createVNode("p", { class: "mt-2 max-w-lg text-sm leading-relaxed text-white/75 line-clamp-2" }, toDisplayString(__props.project.tagline), 1),
                createVNode("div", { class: "mt-4 flex flex-wrap gap-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.project.tags.slice(0, 3), (t2) => {
                    return openBlock(), createBlock("span", {
                      key: t2,
                      class: "rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                    }, toDisplayString(t2), 1);
                  }), 128)),
                  createVNode("span", { class: "inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm" }, [
                    createVNode(unref(Eye), {
                      size: 12,
                      "stroke-width": 1.75,
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" " + toDisplayString(unref(formatCount)(unref(viewsOf)(__props.project.slug))) + " " + toDisplayString(unref(t)("common.viewed")), 1)
                  ])
                ])
              ]),
              createVNode("span", {
                class: "absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-gradient-brand group-hover:shadow-btn-glow",
                "aria-hidden": "true"
              }, [
                createVNode(unref(ArrowUpRight), {
                  size: 18,
                  "stroke-width": 1.75
                })
              ]),
              __props.variant === "large" ? (openBlock(), createBlock("span", {
                key: 0,
                class: "absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
              }, toDisplayString(unref(t)("projectCard.featured")), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FeaturedProjectCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    const { t } = useI18n();
    useSeoMeta({
      title: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.home) == null ? void 0 : _c.title) != null ? _d : "CehaDev \u2014 Web Developer Portfolio";
      },
      description: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.home) == null ? void 0 : _c.description) != null ? _d : "Portfolio CehaDev, Web Developer & Tech Enthusiast berbasis di Grobogan, Jawa Tengah. Membangun produk digital modern dengan Nuxt.js, Vue.js, dan Tailwind CSS.";
      }
    });
    const { data: skills } = ([__temp, __restore] = withAsyncContext(() => useSkillsContent()), __temp = await __temp, __restore(), __temp);
    const { data: projects } = ([__temp, __restore] = withAsyncContext(() => useProjectsContent()), __temp = await __temp, __restore(), __temp);
    const headings = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.home) != null ? _c : {};
    });
    const featuredProjects = computed(() => {
      var _a;
      const list = (_a = projects.value) != null ? _a : [];
      const featured = list.filter((p) => p.featured);
      return featured.length >= 3 ? featured : list.slice(0, 3);
    });
    const marqueeTech = computed(() => {
      var _a;
      const list = (_a = skills.value) == null ? void 0 : _a.marqueeTech;
      return (list == null ? void 0 : list.length) ? list : ["JavaScript", "Vue.js", "Nuxt.js", "Tailwind CSS", "Node.js", "Git & GitHub"];
    });
    const heroStats = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.stats) == null ? void 0 : _b.slice(0, 4)) != null ? _c : [];
    });
    function techFor(name) {
      return findTechByName(name);
    }
    const socials = computed(() => {
      var _a, _b, _c, _d;
      const s = (_b = (_a = site.value) == null ? void 0 : _a.socials) != null ? _b : { github: "", linkedin: "", instagram: "" };
      return [
        { label: "GitHub", icon: Github, href: s.github || "https://github.com" },
        { label: "LinkedIn", icon: Linkedin, href: s.linkedin || "https://linkedin.com" },
        { label: "Instagram", icon: Instagram, href: s.instagram || "https://instagram.com" },
        { label: "Mail", icon: Mail, href: `mailto:${(_d = (_c = site.value) == null ? void 0 : _c.email) != null ? _d : ""}` }
      ];
    });
    const heroOrnaments = [
      { icon: Braces, pos: "left-[5%] top-[20%]", size: 30, color: "#8B5CF6", delay: 300 },
      { icon: Code2, pos: "right-[7%] top-[16%]", size: 26, color: "#3B82F6", delay: 500 },
      { icon: Zap, pos: "left-[9%] bottom-[24%]", size: 24, color: "#F59E0B", delay: 700 },
      { icon: Asterisk, pos: "right-[13%] bottom-[30%]", size: 28, color: "#22C55E", delay: 900 },
      { icon: Plus, pos: "left-[42%] top-[12%]", size: 20, color: "#8B5CF6", delay: 1100 },
      { icon: Terminal, pos: "right-[2%] bottom-[40%]", size: 22, color: "#3B82F6", delay: 1300 },
      { icon: Sparkles, pos: "left-[32%] bottom-[14%]", size: 22, color: "#EC4899", delay: 1500 },
      { icon: GitBranch, pos: "left-[2%] top-[55%]", size: 22, color: "#14B8A6", delay: 1700 }
    ];
    const avatarButtons = computed(() => {
      var _a, _b, _c, _d, _e;
      return [
        { to: "/projects", href: null, icon: Rocket, style: "gradient", pos: "-left-3 top-8 md:-left-6", label: (_a = headings.value.viewProjectsBtn) != null ? _a : t("projectCard.viewProject"), delay: 400 },
        { to: "/contact", href: null, icon: Mail, style: "outline", pos: "-left-4 bottom-10 md:-left-7", label: (_b = headings.value.contactMeBtn) != null ? _b : t("footer.contactMe"), delay: 550 },
        { to: null, href: (_e = (_d = (_c = site.value) == null ? void 0 : _c.socials) == null ? void 0 : _d.github) != null ? _e : "https://github.com", icon: Github, style: "outline", pos: "-right-3 bottom-14 md:-right-6", label: "GitHub", delay: 700 }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Reveal = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AvatarIllustration = _sfc_main$3;
      const _component_CountUp = _sfc_main$4;
      const _component_FeaturedProjectCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden" }, _attrs))} data-v-55ec178e><section class="relative flex min-h-[calc(100vh-76px)] flex-col justify-center" data-v-55ec178e><div class="pointer-events-none absolute inset-0 -z-10" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 18% 28%, rgba(124, 58, 237, 0.14), transparent 48%),\n            radial-gradient(circle at 84% 62%, rgba(59, 130, 246, 0.12), transparent 44%)" })}" aria-hidden="true" data-v-55ec178e></div><div class="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern" style="${ssrRenderStyle({ "mask-image": "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)" })}" aria-hidden="true" data-v-55ec178e></div><div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true" data-v-55ec178e><!--[-->`);
      ssrRenderList(heroOrnaments, (o, i) => {
        _push(`<div class="${ssrRenderClass([o.pos, "entrance-ornament absolute opacity-20"])}" style="${ssrRenderStyle({ color: o.color, animationDelay: o.delay + "ms" })}" data-v-55ec178e>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(o.icon), {
          size: o.size,
          "stroke-width": 1.5,
          class: "animate-float"
        }, null), _parent);
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="container-site flex flex-col items-center gap-14 py-16 lg:flex-row lg:gap-20" data-v-55ec178e>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "max-w-2xl text-center lg:flex-1 lg:text-left",
        parallax: 15
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<span class="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-card" data-v-55ec178e${_scopeId}><span class="relative flex h-2 w-2" aria-hidden="true" data-v-55ec178e${_scopeId}><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" data-v-55ec178e${_scopeId}></span><span class="relative inline-flex h-2 w-2 rounded-full bg-success" data-v-55ec178e${_scopeId}></span></span> ${ssrInterpolate((_a2 = unref(site)) == null ? void 0 : _a2.heroBadge)}</span><h1 class="mt-7 text-[52px] font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-[84px]" data-v-55ec178e${_scopeId}>${ssrInterpolate((_b = unref(site)) == null ? void 0 : _b.heroTitle1)} <br data-v-55ec178e${_scopeId}><span class="bg-gradient-brand bg-clip-text text-transparent" data-v-55ec178e${_scopeId}>${ssrInterpolate((_c = unref(site)) == null ? void 0 : _c.heroTitleGradient)}</span></h1><div class="mt-5 flex items-center justify-center gap-4 lg:justify-start" data-v-55ec178e${_scopeId}><span class="h-px w-10 bg-gradient-brand" aria-hidden="true" data-v-55ec178e${_scopeId}></span><p class="text-xl font-semibold text-text-secondary md:text-2xl" data-v-55ec178e${_scopeId}>${ssrInterpolate((_d = unref(site)) == null ? void 0 : _d.heroSubtitle)}</p></div><p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary lg:mx-0" data-v-55ec178e${_scopeId}>${ssrInterpolate((_e = unref(site)) == null ? void 0 : _e.heroDescription)}</p><div class="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start" data-v-55ec178e${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/projects",
              class: "btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(`${ssrInterpolate((_a3 = unref(headings).viewWork) != null ? _a3 : unref(t)("projectCard.viewProject"))} `);
                  _push3(ssrRenderComponent(unref(ArrowRight), {
                    size: 17,
                    "stroke-width": 2
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(toDisplayString((_b2 = unref(headings).viewWork) != null ? _b2 : unref(t)("projectCard.viewProject")) + " ", 1),
                    createVNode(unref(ArrowRight), {
                      size: 17,
                      "stroke-width": 2
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/contact",
              class: "btn-outline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Mail), {
                    size: 17,
                    "stroke-width": 1.75
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate((_a3 = unref(headings).contactMe) != null ? _a3 : unref(t)("footer.contactMe"))}`);
                } else {
                  return [
                    createVNode(unref(Mail), {
                      size: 17,
                      "stroke-width": 1.75
                    }),
                    createTextVNode(" " + toDisplayString((_b2 = unref(headings).contactMe) != null ? _b2 : unref(t)("footer.contactMe")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-10 flex items-center justify-center gap-3 lg:justify-start" data-v-55ec178e${_scopeId}><span class="h-px w-10 bg-border" aria-hidden="true" data-v-55ec178e${_scopeId}></span><!--[-->`);
            ssrRenderList(unref(socials), (s) => {
              _push2(`<a${ssrRenderAttr("href", s.href)} target="_blank" rel="noopener noreferrer" class="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-btn-glow"${ssrRenderAttr("aria-label", s.label)} data-v-55ec178e${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(s.icon), {
                size: 17,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</a>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("span", { class: "inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-card" }, [
                createVNode("span", {
                  class: "relative flex h-2 w-2",
                  "aria-hidden": "true"
                }, [
                  createVNode("span", { class: "absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" }),
                  createVNode("span", { class: "relative inline-flex h-2 w-2 rounded-full bg-success" })
                ]),
                createTextVNode(" " + toDisplayString((_f = unref(site)) == null ? void 0 : _f.heroBadge), 1)
              ]),
              createVNode("h1", { class: "mt-7 text-[52px] font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-[84px]" }, [
                createTextVNode(toDisplayString((_g = unref(site)) == null ? void 0 : _g.heroTitle1) + " ", 1),
                createVNode("br"),
                createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_h = unref(site)) == null ? void 0 : _h.heroTitleGradient), 1)
              ]),
              createVNode("div", { class: "mt-5 flex items-center justify-center gap-4 lg:justify-start" }, [
                createVNode("span", {
                  class: "h-px w-10 bg-gradient-brand",
                  "aria-hidden": "true"
                }),
                createVNode("p", { class: "text-xl font-semibold text-text-secondary md:text-2xl" }, toDisplayString((_i = unref(site)) == null ? void 0 : _i.heroSubtitle), 1)
              ]),
              createVNode("p", { class: "mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary lg:mx-0" }, toDisplayString((_j = unref(site)) == null ? void 0 : _j.heroDescription), 1),
              createVNode("div", { class: "mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start" }, [
                createVNode(_component_NuxtLink, {
                  to: "/projects",
                  class: "btn-primary"
                }, {
                  default: withCtx(() => {
                    var _a3;
                    return [
                      createTextVNode(toDisplayString((_a3 = unref(headings).viewWork) != null ? _a3 : unref(t)("projectCard.viewProject")) + " ", 1),
                      createVNode(unref(ArrowRight), {
                        size: 17,
                        "stroke-width": 2
                      })
                    ];
                  }),
                  _: 1
                }),
                createVNode(_component_NuxtLink, {
                  to: "/contact",
                  class: "btn-outline"
                }, {
                  default: withCtx(() => {
                    var _a3;
                    return [
                      createVNode(unref(Mail), {
                        size: 17,
                        "stroke-width": 1.75
                      }),
                      createTextVNode(" " + toDisplayString((_a3 = unref(headings).contactMe) != null ? _a3 : unref(t)("footer.contactMe")), 1)
                    ];
                  }),
                  _: 1
                })
              ]),
              createVNode("div", { class: "mt-10 flex items-center justify-center gap-3 lg:justify-start" }, [
                createVNode("span", {
                  class: "h-px w-10 bg-border",
                  "aria-hidden": "true"
                }),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(socials), (s) => {
                  return openBlock(), createBlock("a", {
                    key: s.label,
                    href: s.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-btn-glow",
                    "aria-label": s.label
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(s.icon), {
                      size: 17,
                      "stroke-width": 1.5
                    }))
                  ], 8, ["href", "aria-label"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Reveal, {
        class: "relative mx-auto",
        delay: 120,
        direction: "scale"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="relative flex items-center justify-center" data-v-55ec178e${_scopeId}><span class="animate-spin-slow absolute h-[360px] w-[360px] rounded-full border border-dashed border-primary/25" aria-hidden="true" data-v-55ec178e${_scopeId}></span><span class="absolute h-[310px] w-[310px] rounded-full border border-primary/15" aria-hidden="true" data-v-55ec178e${_scopeId}></span><div class="absolute h-[380px] w-[380px] rounded-full bg-glow-circle blur-3xl" aria-hidden="true" data-v-55ec178e${_scopeId}></div><div class="relative rounded-full p-1.5" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #8B5CF6, #3B82F6)" })}" data-v-55ec178e${_scopeId}><div class="rounded-full bg-bg p-2" data-v-55ec178e${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AvatarIllustration, {
              size: 280,
              variant: "laptop"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="absolute -right-2 top-6 flex items-center gap-2.5 rounded-card border border-border bg-card/90 px-4 py-3 shadow-card backdrop-blur md:-right-10" data-v-55ec178e${_scopeId}><span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white" aria-hidden="true" data-v-55ec178e${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Sparkles), {
              size: 16,
              "stroke-width": 1.75
            }, null, _parent2, _scopeId));
            _push2(`</span><div class="leading-tight" data-v-55ec178e${_scopeId}><p class="text-xs font-semibold text-text" data-v-55ec178e${_scopeId}>${ssrInterpolate((_a2 = unref(headings).openToWork) != null ? _a2 : "Open to work")}</p><p class="text-[11px] text-text-muted" data-v-55ec178e${_scopeId}>${ssrInterpolate((_b = unref(headings).buildGreat) != null ? _b : "Let's build something great")}</p></div></div><!--[-->`);
            ssrRenderList(unref(avatarButtons), (b) => {
              _push2(`<div class="${ssrRenderClass([b.pos, "entrance-pop absolute z-10"])}" style="${ssrRenderStyle({ animationDelay: b.delay + "ms" })}" data-v-55ec178e${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(b.href ? "a" : "NuxtLink"), mergeProps({ ref_for: true }, b.href ? { href: b.href, target: "_blank", rel: "noopener noreferrer" } : { to: b.to }, {
                class: ["animate-float flex h-12 w-12 items-center justify-center rounded-full shadow-card transition-all duration-300", b.style === "gradient" ? "bg-gradient-brand text-white hover:shadow-btn-glow" : "border border-border bg-card text-text-secondary hover:border-primary/60 hover:text-primary hover:shadow-btn-glow"],
                "aria-label": b.label
              }), {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(b.icon), {
                      size: 20,
                      "stroke-width": 1.75
                    }, null), _parent3, _scopeId2);
                  } else {
                    return [
                      (openBlock(), createBlock(resolveDynamicComponent(b.icon), {
                        size: 20,
                        "stroke-width": 1.75
                      }))
                    ];
                  }
                }),
                _: 2
              }), _parent2, _scopeId);
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "relative flex items-center justify-center" }, [
                createVNode("span", {
                  class: "animate-spin-slow absolute h-[360px] w-[360px] rounded-full border border-dashed border-primary/25",
                  "aria-hidden": "true"
                }),
                createVNode("span", {
                  class: "absolute h-[310px] w-[310px] rounded-full border border-primary/15",
                  "aria-hidden": "true"
                }),
                createVNode("div", {
                  class: "absolute h-[380px] w-[380px] rounded-full bg-glow-circle blur-3xl",
                  "aria-hidden": "true"
                }),
                createVNode("div", {
                  class: "relative rounded-full p-1.5",
                  style: { "background": "linear-gradient(135deg, #8B5CF6, #3B82F6)" }
                }, [
                  createVNode("div", { class: "rounded-full bg-bg p-2" }, [
                    createVNode(_component_AvatarIllustration, {
                      size: 280,
                      variant: "laptop"
                    })
                  ])
                ]),
                createVNode("div", { class: "absolute -right-2 top-6 flex items-center gap-2.5 rounded-card border border-border bg-card/90 px-4 py-3 shadow-card backdrop-blur md:-right-10" }, [
                  createVNode("span", {
                    class: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white",
                    "aria-hidden": "true"
                  }, [
                    createVNode(unref(Sparkles), {
                      size: 16,
                      "stroke-width": 1.75
                    })
                  ]),
                  createVNode("div", { class: "leading-tight" }, [
                    createVNode("p", { class: "text-xs font-semibold text-text" }, toDisplayString((_c = unref(headings).openToWork) != null ? _c : "Open to work"), 1),
                    createVNode("p", { class: "text-[11px] text-text-muted" }, toDisplayString((_d = unref(headings).buildGreat) != null ? _d : "Let's build something great"), 1)
                  ])
                ]),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(avatarButtons), (b) => {
                  return openBlock(), createBlock("div", {
                    key: b.label,
                    class: ["entrance-pop absolute z-10", b.pos],
                    style: { animationDelay: b.delay + "ms" }
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(b.href ? "a" : "NuxtLink"), mergeProps({ ref_for: true }, b.href ? { href: b.href, target: "_blank", rel: "noopener noreferrer" } : { to: b.to }, {
                      class: ["animate-float flex h-12 w-12 items-center justify-center rounded-full shadow-card transition-all duration-300", b.style === "gradient" ? "bg-gradient-brand text-white hover:shadow-btn-glow" : "border border-border bg-card text-text-secondary hover:border-primary/60 hover:text-primary hover:shadow-btn-glow"],
                      "aria-label": b.label
                    }), {
                      default: withCtx(() => [
                        (openBlock(), createBlock(resolveDynamicComponent(b.icon), {
                          size: 20,
                          "stroke-width": 1.75
                        }))
                      ]),
                      _: 2
                    }, 1040, ["class", "aria-label"]))
                  ], 6);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="container-site pb-8" data-v-55ec178e>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "card border-border/60 bg-card/70 px-8 py-6 backdrop-blur",
        delay: 200,
        direction: "up",
        parallax: 8
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<dl class="grid grid-cols-2 gap-6 sm:grid-cols-4" data-v-55ec178e${_scopeId}><!--[-->`);
            ssrRenderList(unref(heroStats), (s) => {
              var _a2;
              _push2(`<div class="text-center sm:text-left" data-v-55ec178e${_scopeId}><dd class="text-2xl font-extrabold text-text md:text-3xl" data-v-55ec178e${_scopeId}>`);
              _push2(ssrRenderComponent(_component_CountUp, {
                end: s.end,
                suffix: (_a2 = s.suffix) != null ? _a2 : ""
              }, null, _parent2, _scopeId));
              _push2(`</dd><dt class="mt-1 text-xs font-semibold uppercase tracking-wider text-text-muted" data-v-55ec178e${_scopeId}>${ssrInterpolate(s.label)}</dt></div>`);
            });
            _push2(`<!--]--></dl>`);
          } else {
            return [
              createVNode("dl", { class: "grid grid-cols-2 gap-6 sm:grid-cols-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(heroStats), (s) => {
                  var _a2;
                  return openBlock(), createBlock("div", {
                    key: s.label,
                    class: "text-center sm:text-left"
                  }, [
                    createVNode("dd", { class: "text-2xl font-extrabold text-text md:text-3xl" }, [
                      createVNode(_component_CountUp, {
                        end: s.end,
                        suffix: (_a2 = s.suffix) != null ? _a2 : ""
                      }, null, 8, ["end", "suffix"])
                    ]),
                    createVNode("dt", { class: "mt-1 text-xs font-semibold uppercase tracking-wider text-text-muted" }, toDisplayString(s.label), 1)
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="border-y border-border/60 bg-bg-alt/60 py-6"${ssrRenderAttr("aria-label", (_a = unref(headings).techMarqueeAria) != null ? _a : "Teknologi yang dikuasai")} data-v-55ec178e><div class="marquee-container" data-v-55ec178e><div class="marquee-track" data-v-55ec178e><!--[-->`);
      ssrRenderList(2, (n) => {
        _push(`<div class="marquee-group" data-v-55ec178e><!--[-->`);
        ssrRenderList(unref(marqueeTech), (name) => {
          var _a2, _b, _c, _d, _e, _f;
          _push(`<span class="marquee-item" data-v-55ec178e><span class="marquee-glyph" style="${ssrRenderStyle({ "--glyph-color": (_b = (_a2 = techFor(name)) == null ? void 0 : _a2.color) != null ? _b : "#8B5CF6" })}" aria-hidden="true" data-v-55ec178e>${ssrInterpolate((_d = (_c = techFor(name)) == null ? void 0 : _c.glyph) != null ? _d : name.slice(0, 2).toUpperCase())}</span><span class="marquee-name" data-v-55ec178e>${ssrInterpolate((_f = (_e = techFor(name)) == null ? void 0 : _e.name) != null ? _f : name)}</span><span class="h-1 w-1 rounded-full bg-border" aria-hidden="true" data-v-55ec178e></span></span>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div></div></section><section class="container-site py-20 md:py-24" data-v-55ec178e>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        parallax: 10
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h;
          if (_push2) {
            _push2(`<div data-v-55ec178e${_scopeId}><span class="section-label" data-v-55ec178e${_scopeId}><span class="dot" aria-hidden="true" data-v-55ec178e${_scopeId}></span> ${ssrInterpolate((_a2 = unref(headings).featuredWork) != null ? _a2 : "Featured Work")}</span><h2 class="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl" data-v-55ec178e${_scopeId}>${ssrInterpolate((_b = unref(headings).selectedHead1) != null ? _b : "Selected")} <span class="bg-gradient-brand bg-clip-text text-transparent" data-v-55ec178e${_scopeId}>${ssrInterpolate((_c = unref(headings).selectedHead2) != null ? _c : "Projects")}</span></h2><p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary" data-v-55ec178e${_scopeId}>${ssrInterpolate((_d = unref(headings).featuredDesc) != null ? _d : "Beberapa project yang saya bangun dengan fokus pada kualitas, performa, dan pengalaman pengguna.")}</p></div>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/projects",
              class: "group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(`${ssrInterpolate((_a3 = unref(headings).viewAllProjects) != null ? _a3 : "View All Projects")} `);
                  _push3(ssrRenderComponent(unref(ArrowUpRight), {
                    size: 17,
                    "stroke-width": 2,
                    class: "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(toDisplayString((_b2 = unref(headings).viewAllProjects) != null ? _b2 : "View All Projects") + " ", 1),
                    createVNode(unref(ArrowUpRight), {
                      size: 17,
                      "stroke-width": 2,
                      class: "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", null, [
                createVNode("span", { class: "section-label" }, [
                  createVNode("span", {
                    class: "dot",
                    "aria-hidden": "true"
                  }),
                  createTextVNode(" " + toDisplayString((_e = unref(headings).featuredWork) != null ? _e : "Featured Work"), 1)
                ]),
                createVNode("h2", { class: "mt-4 text-3xl font-extrabold tracking-tight md:text-4xl" }, [
                  createTextVNode(toDisplayString((_f = unref(headings).selectedHead1) != null ? _f : "Selected") + " ", 1),
                  createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_g = unref(headings).selectedHead2) != null ? _g : "Projects"), 1)
                ]),
                createVNode("p", { class: "mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary" }, toDisplayString((_h = unref(headings).featuredDesc) != null ? _h : "Beberapa project yang saya bangun dengan fokus pada kualitas, performa, dan pengalaman pengguna."), 1)
              ]),
              createVNode(_component_NuxtLink, {
                to: "/projects",
                class: "group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
              }, {
                default: withCtx(() => {
                  var _a3;
                  return [
                    createTextVNode(toDisplayString((_a3 = unref(headings).viewAllProjects) != null ? _a3 : "View All Projects") + " ", 1),
                    createVNode(unref(ArrowUpRight), {
                      size: 17,
                      "stroke-width": 2,
                      class: "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    })
                  ];
                }),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mt-12 grid gap-6 lg:grid-cols-2 lg:grid-rows-2 lg:auto-rows-fr" data-v-55ec178e>`);
      if (unref(featuredProjects)[0]) {
        _push(ssrRenderComponent(_component_Reveal, {
          class: "lg:row-span-2",
          direction: "left",
          parallax: 20
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_FeaturedProjectCard, {
                project: unref(featuredProjects)[0],
                index: 0,
                variant: "large"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_FeaturedProjectCard, {
                  project: unref(featuredProjects)[0],
                  index: 0,
                  variant: "large"
                }, null, 8, ["project"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(featuredProjects).slice(1), (p, i) => {
        _push(ssrRenderComponent(_component_Reveal, {
          key: p.slug,
          delay: i * 120,
          direction: i % 2 === 0 ? "right" : "up",
          parallax: 12 + i * 5
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_FeaturedProjectCard, {
                project: p,
                index: i + 1
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_FeaturedProjectCard, {
                  project: p,
                  index: i + 1
                }, null, 8, ["project", "index"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="container-site pb-24" data-v-55ec178e>`);
      _push(ssrRenderComponent(_component_Reveal, {
        class: "relative overflow-hidden rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 via-primary/5 to-blue/10 px-8 py-16 text-center md:px-16 md:py-20",
        direction: "scale",
        parallax: 12
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<div class="absolute inset-0 bg-glow-circle opacity-40" style="${ssrRenderStyle({ "mask-image": "linear-gradient(to bottom, black, transparent)" })}" aria-hidden="true" data-v-55ec178e${_scopeId}></div><div class="relative" data-v-55ec178e${_scopeId}><h2 class="text-3xl font-extrabold tracking-tight text-text md:text-4xl" data-v-55ec178e${_scopeId}>${ssrInterpolate((_a2 = unref(headings).ctaHead1) != null ? _a2 : "Have an idea?")} <span class="bg-gradient-brand bg-clip-text text-transparent" data-v-55ec178e${_scopeId}>${ssrInterpolate((_b = unref(headings).ctaHead2) != null ? _b : "Let's build it together.")}</span></h2><p class="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary" data-v-55ec178e${_scopeId}>${ssrInterpolate((_c = unref(headings).ctaDesc) != null ? _c : "Saya selalu terbuka untuk kolaborasi, project freelance, atau sekadar diskusi seputar teknologi.")}</p><div class="mt-8 flex flex-wrap justify-center gap-4" data-v-55ec178e${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/contact",
              class: "btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(`${ssrInterpolate((_a3 = unref(headings).startProject) != null ? _a3 : "Start a Project")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString((_b2 = unref(headings).startProject) != null ? _b2 : "Start a Project"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/cv",
              class: "btn-outline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(`${ssrInterpolate((_a3 = unref(headings).downloadCv) != null ? _a3 : unref(t)("nav.downloadCv"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString((_b2 = unref(headings).downloadCv) != null ? _b2 : unref(t)("nav.downloadCv")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", {
                class: "absolute inset-0 bg-glow-circle opacity-40",
                style: { "mask-image": "linear-gradient(to bottom, black, transparent)" },
                "aria-hidden": "true"
              }),
              createVNode("div", { class: "relative" }, [
                createVNode("h2", { class: "text-3xl font-extrabold tracking-tight text-text md:text-4xl" }, [
                  createTextVNode(toDisplayString((_d = unref(headings).ctaHead1) != null ? _d : "Have an idea?") + " ", 1),
                  createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_e = unref(headings).ctaHead2) != null ? _e : "Let's build it together."), 1)
                ]),
                createVNode("p", { class: "mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary" }, toDisplayString((_f = unref(headings).ctaDesc) != null ? _f : "Saya selalu terbuka untuk kolaborasi, project freelance, atau sekadar diskusi seputar teknologi."), 1),
                createVNode("div", { class: "mt-8 flex flex-wrap justify-center gap-4" }, [
                  createVNode(_component_NuxtLink, {
                    to: "/contact",
                    class: "btn-primary"
                  }, {
                    default: withCtx(() => {
                      var _a3;
                      return [
                        createTextVNode(toDisplayString((_a3 = unref(headings).startProject) != null ? _a3 : "Start a Project"), 1)
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(_component_NuxtLink, {
                    to: "/cv",
                    class: "btn-outline"
                  }, {
                    default: withCtx(() => {
                      var _a3;
                      return [
                        createTextVNode(toDisplayString((_a3 = unref(headings).downloadCv) != null ? _a3 : unref(t)("nav.downloadCv")), 1)
                      ];
                    }),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-55ec178e"]]);

export { index as default };
//# sourceMappingURL=index-DDxnbf1Q.mjs.map
