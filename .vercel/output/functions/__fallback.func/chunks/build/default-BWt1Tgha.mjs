import { defineComponent, mergeProps, ref, withAsyncContext, computed, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, resolveDynamicComponent, watch, nextTick, toRef, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderVNode, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _sfc_main$6 } from './ScrollProgress-BqucZOxM.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { Github, Languages, Sun, Moon, Download, X, Menu, Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle, ArrowRight, Eye, Users, Heart, ArrowUp, User, Sparkles, AtSign, Send } from 'lucide-vue-next';
import { u as useRoute, b as useNuxtApp } from './server.mjs';
import { c as useLang, a as useSiteSettings } from './useContentData-B9bxi5bI.mjs';
import { u as useI18n } from './useI18n-Djb0t6ty.mjs';
import { u as useStats } from './useStats-Dk9h29Wa.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import './localize-vezARIz8.mjs';
import './ssr-DMxvrB_f.mjs';
import './asyncData-I2BNYYXU.mjs';
import 'perfect-debounce';

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Spotlight",
  __ssrInlineRender: true,
  setup(__props) {
    const spot = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "spot",
        ref: spot,
        class: "pointer-events-none fixed left-0 top-0 -z-10 hidden h-[440px] w-[440px] rounded-full lg:block print:hidden",
        "aria-hidden": "true"
      }, _attrs))}><div class="h-full w-full rounded-full" style="${ssrRenderStyle({ "background": "radial-gradient(circle, rgba(124, 58, 237, 0.09), rgba(59, 130, 246, 0.06) 40%, transparent 65%)" })}"></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Spotlight.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
function useTheme() {
  const theme = ref("dark");
  function apply(next) {
    theme.value = next;
  }
  function toggle() {
    apply(theme.value === "dark" ? "light" : "dark");
  }
  return { theme, toggle, apply };
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AppNavbar",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const mobileOpen = ref(false);
    const scrolled = ref(false);
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    const { theme } = useTheme();
    const { t } = useI18n();
    const { isEn } = useLang();
    const navItems = computed(
      () => [
        { to: "/", key: "home" },
        { to: "/about", key: "about" },
        { to: "/projects", key: "projects" },
        { to: "/contact", key: "contact" }
      ].map(({ to, key }) => {
        var _a, _b, _c, _d;
        return {
          to,
          label: (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.nav) == null ? void 0 : _c[key]) != null ? _d : t(`nav.${key}`)
        };
      })
    );
    function isActive(link) {
      if (link.to === "/") return route.path === "/";
      return route.path.startsWith(link.to);
    }
    function closeMobile() {
      mobileOpen.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["sticky top-0 z-50 border-b transition-all duration-300 print:hidden", unref(scrolled) ? "border-border/70 bg-bg/90 shadow-lg shadow-black/5 backdrop-blur-xl" : "border-border/40 bg-bg/70 backdrop-blur-md"]
      }, _attrs))}><nav class="${ssrRenderClass([unref(scrolled) ? "h-16" : "h-[76px]", "container-site flex items-center justify-between gap-6 transition-all duration-300"])}"${ssrRenderAttr("aria-label", unref(t)("nav.mainAria"))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "shrink-0 text-xl font-extrabold tracking-tight",
        onClick: closeMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-text"${_scopeId}>Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent"${_scopeId}>Dev</span>`);
          } else {
            return [
              createVNode("span", { class: "text-text" }, "Ceha"),
              createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, "Dev")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<ul class="hidden items-center gap-8 lg:flex"><!--[-->`);
      ssrRenderList(unref(navItems), (link) => {
        _push(`<li class="group">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: ["relative pb-1 text-sm font-medium transition-colors", isActive(link) ? "text-text" : "text-text-secondary hover:text-text"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)} `);
              if (isActive(link)) {
                _push2(`<span class="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-brand" aria-hidden="true"${_scopeId}></span>`);
              } else {
                _push2(`<span class="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-brand transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true"${_scopeId}></span>`);
              }
            } else {
              return [
                createTextVNode(toDisplayString(link.label) + " ", 1),
                isActive(link) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-brand",
                  "aria-hidden": "true"
                })) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-brand transition-transform duration-300 group-hover:scale-x-100",
                  "aria-hidden": "true"
                }))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul><div class="flex items-center gap-3"><a${ssrRenderAttr("href", (_c = (_b = (_a = unref(site)) == null ? void 0 : _a.socials) == null ? void 0 : _b.github) != null ? _c : "https://github.com")} target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="hidden items-center justify-center rounded-full border border-border p-2.5 text-text-secondary transition-colors hover:border-primary/60 hover:text-text sm:flex">`);
      _push(ssrRenderComponent(unref(Github), {
        size: 18,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</a><button type="button"${ssrRenderAttr("aria-label", unref(t)("nav.switchLang"))} class="flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/60 hover:text-text">`);
      _push(ssrRenderComponent(unref(Languages), {
        size: 16,
        "stroke-width": 1.5
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(isEn) ? "ID" : "EN")}</button><button type="button"${ssrRenderAttr("aria-label", unref(theme) === "dark" ? unref(t)("nav.toggleThemeDark") : unref(t)("nav.toggleThemeLight"))} class="${ssrRenderClass([unref(theme) === "dark" ? "text-amber-300" : "text-text-secondary", "flex items-center justify-center rounded-full border border-border bg-bg-alt p-2.5 transition-colors hover:border-primary/60"])}">`);
      if (unref(theme) === "dark") {
        _push(ssrRenderComponent(unref(Sun), {
          size: 18,
          "stroke-width": 1.5
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), {
          size: 18,
          "stroke-width": 1.5
        }, null, _parent));
      }
      _push(`</button><a${ssrRenderAttr("href", ((_d = unref(site)) == null ? void 0 : _d.cvUrl) ? `${unref(site).cvUrl}?download=1` : "/cv?download=1")} class="btn-primary hidden !px-5 !py-2.5 md:inline-flex">`);
      _push(ssrRenderComponent(unref(Download), {
        size: 16,
        "stroke-width": 2
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("nav.downloadCv"))}</a><button type="button" class="flex items-center justify-center rounded-lg border border-border p-2.5 text-text lg:hidden"${ssrRenderAttr("aria-label", unref(mobileOpen) ? unref(t)("nav.closeMenu") : unref(t)("nav.openMenu"))}${ssrRenderAttr("aria-expanded", unref(mobileOpen))}>`);
      if (unref(mobileOpen)) {
        _push(ssrRenderComponent(unref(X), { size: 20 }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Menu), { size: 20 }, null, _parent));
      }
      _push(`</button></div></nav>`);
      if (unref(mobileOpen)) {
        _push(`<div class="border-t border-border/60 bg-bg lg:hidden"><ul class="container-site flex flex-col py-4"><!--[-->`);
        ssrRenderList(unref(navItems), (link) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.to,
            class: ["flex items-center justify-between border-b border-border/40 py-3 text-sm font-medium", isActive(link) ? "text-text" : "text-text-secondary"],
            onClick: closeMobile
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.label)} `);
                if (isActive(link)) {
                  _push2(`<span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createTextVNode(toDisplayString(link.label) + " ", 1),
                  isActive(link) ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "h-1.5 w-1.5 rounded-full bg-primary",
                    "aria-hidden": "true"
                  })) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--><li class="pt-4"><a${ssrRenderAttr("href", ((_e = unref(site)) == null ? void 0 : _e.cvUrl) ? `${unref(site).cvUrl}?download=1` : "/cv?download=1")} class="btn-primary w-full">`);
        _push(ssrRenderComponent(unref(Download), { size: 16 }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("nav.downloadCv"))}</a></li></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppNavbar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useChatWidget() {
  const trigger = useState("chat-widget-trigger", () => ({ nonce: 0, prefill: "" }));
  function openChat(prefill = "") {
    trigger.value = { nonce: trigger.value.nonce + 1, prefill };
  }
  return { trigger, openChat };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    useChatWidget();
    const { data: stats, sourceOf, formatCount } = useStats();
    const { t } = useI18n();
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const isContact = computed(() => route.path.startsWith("/contact"));
    const navItems = computed(
      () => [
        { to: "/", key: "home" },
        { to: "/about", key: "about" },
        { to: "/projects", key: "projects" },
        { to: "/contact", key: "contact" }
      ].map(({ to, key }) => {
        var _a, _b, _c, _d;
        return {
          to,
          label: (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.nav) == null ? void 0 : _c[key]) != null ? _d : t(`nav.${key}`)
        };
      })
    );
    const contactItems = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      return [
        { icon: Mail, label: t("footer.emailLabel"), value: (_b = (_a = site.value) == null ? void 0 : _a.email) != null ? _b : "", href: `mailto:${(_d = (_c = site.value) == null ? void 0 : _c.email) != null ? _d : ""}` },
        { icon: Phone, label: t("footer.phoneLabel"), value: (_f = (_e = site.value) == null ? void 0 : _e.phone) != null ? _f : "", href: `tel:${((_h = (_g = site.value) == null ? void 0 : _g.phone) != null ? _h : "").replace(/[^+\d]/g, "")}` },
        { icon: MapPin, label: t("footer.locationLabel"), value: (_j = (_i = site.value) == null ? void 0 : _i.location) != null ? _j : "", href: `https://maps.google.com/?q=${encodeURIComponent((_l = (_k = site.value) == null ? void 0 : _k.location) != null ? _l : "")}` }
      ];
    });
    const socials = computed(() => {
      var _a, _b;
      const s = (_b = (_a = site.value) == null ? void 0 : _a.socials) != null ? _b : { github: "", linkedin: "", instagram: "" };
      return [
        { label: "GitHub", icon: Github, href: s.github || "#" },
        { label: "LinkedIn", icon: Linkedin, href: s.linkedin || "#" },
        { label: "Instagram", icon: Instagram, href: s.instagram || "#" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "mt-24 print:hidden" }, _attrs))}><div class="container-site py-14 md:py-16">`);
      if (unref(isContact)) {
        _push(`<div class="grid items-start gap-10 lg:grid-cols-[1fr_1.25fr]"><div><span class="section-label"><span class="dot" aria-hidden="true"></span> ${ssrInterpolate(unref(t)("footer.faqTitle"))}</span><h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text md:text-3xl">${ssrInterpolate(unref(t)("footer.faqHead"))}<span class="bg-gradient-brand bg-clip-text text-transparent">?</span></h2><p class="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">${ssrInterpolate(unref(t)("footer.faqDesc"))}</p><button type="button" class="btn-primary mt-6 !py-2.5">${ssrInterpolate(unref(t)("footer.openChat"))} `);
        _push(ssrRenderComponent(unref(MessageCircle), {
          size: 15,
          "stroke-width": 2
        }, null, _parent));
        _push(`</button></div><ul class="space-y-2.5"><!--[-->`);
        ssrRenderList((_b = (_a = unref(site)) == null ? void 0 : _a.faqs) != null ? _b : [], (f, i) => {
          _push(`<li><button type="button" class="group flex w-full items-center gap-3 rounded-card border border-border bg-card px-4 py-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary" aria-hidden="true">`);
          _push(ssrRenderComponent(unref(MessageCircle), {
            size: 15,
            "stroke-width": 1.5
          }, null, _parent));
          _push(`</span><span class="text-sm text-text-secondary transition-colors group-hover:text-text">${ssrInterpolate(f.q)}</span>`);
          _push(ssrRenderComponent(unref(ArrowRight), {
            size: 15,
            "stroke-width": 2,
            class: "ml-auto shrink-0 text-text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
          }, null, _parent));
          _push(`</button></li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-xl font-extrabold tracking-tight"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-text"${_scopeId}>Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent"${_scopeId}>Dev</span>`);
          } else {
            return [
              createVNode("span", { class: "text-text" }, "Ceha"),
              createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, "Dev")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">${ssrInterpolate(unref(t)("footer.blurb", { role: (_d = (_c = unref(site)) == null ? void 0 : _c.role) != null ? _d : "Web Developer & Tech Enthusiast" }))}</p>`);
      if (unref(stats)) {
        _push(`<div class="mt-4 flex flex-wrap items-center gap-2"><span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">`);
        _push(ssrRenderComponent(unref(Eye), {
          size: 13,
          "stroke-width": 1.75,
          class: "text-primary",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(formatCount)(unref(stats).total.views))} ${ssrInterpolate(unref(t)("common.visits"))}</span><span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">`);
        _push(ssrRenderComponent(unref(Users), {
          size: 13,
          "stroke-width": 1.75,
          class: "text-primary",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(formatCount)(unref(stats).total.visitors))} ${ssrInterpolate(unref(t)("common.visitors"))}</span>`);
        if (unref(sourceOf)("Google") > 0) {
          _push(`<span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary">${ssrInterpolate(unref(formatCount)(unref(sourceOf)("Google")))} ${ssrInterpolate(unref(t)("common.fromGoogle"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-5 flex items-center gap-2.5"><!--[-->`);
      ssrRenderList(unref(socials), (s) => {
        _push(`<a${ssrRenderAttr("href", s.href)} target="_blank" rel="noopener noreferrer" class="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary hover:text-white"${ssrRenderAttr("aria-label", s.label)}>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(s.icon), {
          size: 15,
          "stroke-width": 1.5
        }, null), _parent);
        _push(`</a>`);
      });
      _push(`<!--]--></div></div><div><h3 class="text-sm font-bold uppercase tracking-wider text-text">${ssrInterpolate(unref(t)("footer.quickLinks"))}</h3><ul class="mt-4 space-y-2.5"><!--[-->`);
      ssrRenderList(unref(navItems), (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "text-sm text-text-secondary transition-colors hover:text-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li><a${ssrRenderAttr("href", ((_e = unref(site)) == null ? void 0 : _e.cvUrl) ? `${unref(site).cvUrl}?download=1` : "/cv?download=1")} class="text-sm text-text-secondary transition-colors hover:text-primary">${ssrInterpolate(unref(t)("nav.downloadCv"))}</a></li></ul></div><div><h3 class="text-sm font-bold uppercase tracking-wider text-text">${ssrInterpolate(unref(t)("footer.contact"))}</h3><ul class="mt-4 space-y-2.5"><!--[-->`);
      ssrRenderList(unref(contactItems), (c) => {
        _push(`<li><a${ssrRenderAttr("href", c.href)}${ssrRenderAttr("target", c.href.startsWith("http") ? "_blank" : void 0)}${ssrRenderAttr("rel", c.href.startsWith("http") ? "noopener noreferrer" : void 0)} class="group flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-primary">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(c.icon), {
          size: 14,
          "stroke-width": 1.5,
          class: "shrink-0 text-primary"
        }, null), _parent);
        _push(`<span class="truncate">${ssrInterpolate(c.value)}</span></a></li>`);
      });
      _push(`<!--]--></ul></div><div class="rounded-card border border-border bg-card p-6"><span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Mail), {
        size: 18,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><h3 class="mt-3 text-base font-bold text-text">${ssrInterpolate(unref(t)("footer.letsWorkTogether"))}</h3><p class="mt-1.5 text-sm leading-relaxed text-text-secondary">${ssrInterpolate(unref(t)("footer.ctaDesc"))}</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "btn-primary mt-4 w-full !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("footer.contactMe"))} `);
            _push2(ssrRenderComponent(unref(ArrowRight), {
              size: 15,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("footer.contactMe")) + " ", 1),
              createVNode(unref(ArrowRight), {
                size: 15,
                "stroke-width": 2
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div><div class="container-site flex flex-col items-center gap-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left"><p class="text-sm text-text-muted">${ssrInterpolate(unref(t)("common.rightsReserved", { year: unref(year) }))}</p><p class="flex items-center gap-2 text-sm font-medium text-text-secondary">`);
      _push(ssrRenderComponent(unref(Heart), {
        class: "h-4 w-4 fill-red-500 text-red-500",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("common.motto"))}</p><a href="#top" class="group flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text">${ssrInterpolate(unref(t)("common.backToTop"))} <span class="flex items-center justify-center rounded-full border border-border p-2 transition-colors group-hover:border-primary/60">`);
      _push(ssrRenderComponent(unref(ArrowUp), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(`</span></a></div></div></footer>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ChatWidget",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { trigger } = useChatWidget();
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    const { t } = useI18n();
    const { lang } = useLang();
    const pendingTrigger = ref(false);
    const open = ref(false);
    const enabled = ref(true);
    const ready = ref(false);
    const sending = ref(false);
    const unread = ref(0);
    const conversationId = ref(null);
    const messages = ref([]);
    const status = ref("open");
    const lastAt = ref(null);
    const input = ref("");
    const name = ref("");
    const email = ref("");
    const error = ref("");
    const threadEl = ref(null);
    const faqs = computed(() => {
      var _a, _b;
      return (_b = (_a = site.value) == null ? void 0 : _a.faqs) != null ? _b : [];
    });
    const isNew = computed(() => !conversationId.value);
    function scrollToBottom() {
      nextTick(() => {
        if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight;
      });
    }
    function formatTime(at) {
      return new Date(at).toLocaleTimeString(lang.value === "en" ? "en-US" : "id-ID", { hour: "2-digit", minute: "2-digit" });
    }
    async function fetchThread() {
      var _a, _b;
      if (!conversationId.value) return;
      try {
        const data = await $fetch(
          `/api/chat/conversations/${conversationId.value}`
        );
        messages.value = data.messages;
        status.value = data.status === "resolved" ? "resolved" : "open";
        if (lastAt.value) {
          unread.value = data.messages.filter((m) => m.role === "admin" && m.at > lastAt.value).length;
        } else {
          unread.value = data.messages.filter((m) => m.role === "admin").length;
        }
        if (open.value) {
          lastAt.value = (_b = (_a = data.messages[data.messages.length - 1]) == null ? void 0 : _a.at) != null ? _b : lastAt.value;
          unread.value = 0;
        }
        scrollToBottom();
      } catch {
      }
    }
    async function applyTrigger() {
      open.value = true;
      if (trigger.value.prefill) input.value = trigger.value.prefill;
      if (conversationId.value) await fetchThread();
      else scrollToBottom();
    }
    watch(
      () => trigger.value.nonce,
      async () => {
        if (!ready.value || !enabled.value) {
          pendingTrigger.value = true;
          return;
        }
        await applyTrigger();
      }
    );
    watch(messages, scrollToBottom);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(enabled) && unref(ready)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed bottom-5 right-5 z-[60] flex flex-col items-end print:hidden" }, _attrs))}>`);
        if (unref(open)) {
          _push(`<div class="mb-4 flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-card border border-border bg-card shadow-card" role="dialog"${ssrRenderAttr("aria-label", unref(t)("chat.aria"))}><div class="flex items-center justify-between gap-3 bg-gradient-brand px-4 py-3.5 text-white"><div class="flex items-center gap-3"><span class="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white" aria-hidden="true">`);
          _push(ssrRenderComponent(unref(User), {
            size: 17,
            "stroke-width": 1.75
          }, null, _parent));
          _push(`<span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary-violet bg-success"></span></span><div><p class="text-sm font-bold leading-tight">${ssrInterpolate(unref(t)("chat.title"))}</p><p class="text-[11px] opacity-90">${ssrInterpolate(unref(status) === "resolved" ? unref(t)("chat.resolved") : unref(t)("chat.online"))}</p></div></div><button type="button" class="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"${ssrRenderAttr("aria-label", unref(t)("chat.close"))}>`);
          _push(ssrRenderComponent(unref(X), { size: 18 }, null, _parent));
          _push(`</button></div><div class="flex-1 space-y-3 overflow-y-auto bg-bg p-4">`);
          if (unref(messages).length) {
            _push(`<!--[-->`);
            ssrRenderList(unref(messages), (m) => {
              _push(`<div class="${ssrRenderClass([m.role === "visitor" ? "justify-end" : "justify-start", "flex"])}"><div class="${ssrRenderClass([m.role === "visitor" ? "rounded-br-sm bg-gradient-brand text-white" : "rounded-bl-sm border border-border bg-card text-text", "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"])}"><p class="whitespace-pre-wrap break-words">${ssrInterpolate(m.text)}</p><p class="${ssrRenderClass([m.role === "visitor" ? "text-white/70" : "text-text-muted", "mt-1 text-right text-[10px]"])}">${ssrInterpolate(formatTime(m.at))}</p></div></div>`);
            });
            _push(`<!--]-->`);
          } else {
            _push(`<!--[--><div class="flex justify-center pt-4"><span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">`);
            _push(ssrRenderComponent(unref(Sparkles), {
              size: 22,
              "stroke-width": 1.5
            }, null, _parent));
            _push(`</span></div><p class="text-center text-sm font-semibold text-text">${ssrInterpolate(unref(t)("chat.greeting"))}</p><p class="text-center text-xs leading-relaxed text-text-muted">${ssrInterpolate(unref(t)("chat.hint"))}</p><div class="flex flex-wrap justify-center gap-2 pt-1"><!--[-->`);
            ssrRenderList(unref(faqs).slice(0, 4), (f, i) => {
              _push(`<button type="button" class="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary">${ssrInterpolate(f.q)}</button>`);
            });
            _push(`<!--]--></div><!--]-->`);
          }
          _push(`</div><div class="border-t border-border bg-card p-3">`);
          if (unref(isNew)) {
            _push(`<div class="mb-2 grid grid-cols-2 gap-2"><div class="relative"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">`);
            _push(ssrRenderComponent(unref(User), {
              size: 13,
              "stroke-width": 1.5
            }, null, _parent));
            _push(`</span><input${ssrRenderAttr("value", unref(name))} type="text" class="input-field !py-2 pl-9 text-xs" placeholder="{{ t(&#39;chat.namePlaceholder&#39;) }}" autocomplete="name"></div><div class="relative"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">`);
            _push(ssrRenderComponent(unref(AtSign), {
              size: 13,
              "stroke-width": 1.5
            }, null, _parent));
            _push(`</span><input${ssrRenderAttr("value", unref(email))} type="email" class="input-field !py-2 pl-9 text-xs" placeholder="{{ t(&#39;chat.emailPlaceholder&#39;) }}" autocomplete="email"></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-end gap-2"><textarea rows="1" class="input-field resize-none !py-2.5 text-sm"${ssrRenderAttr("placeholder", unref(isNew) ? unref(t)("chat.writeMessage") : unref(t)("chat.typeReply"))}>${ssrInterpolate(unref(input))}</textarea><button type="button" class="btn-primary flex h-10 w-10 shrink-0 items-center justify-center !rounded-xl !p-0"${ssrIncludeBooleanAttr(unref(sending) || !unref(input).trim()) ? " disabled" : ""}${ssrRenderAttr("aria-label", unref(t)("chat.send"))}>`);
          _push(ssrRenderComponent(unref(Send), {
            size: 16,
            "stroke-width": 2,
            class: unref(sending) ? "animate-pulse" : ""
          }, null, _parent));
          _push(`</button></div>`);
          if (unref(error)) {
            _push(`<p class="mt-2 text-xs text-red-400">${ssrInterpolate(unref(error))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-white shadow-btn-glow transition-transform duration-200 hover:scale-105"${ssrRenderAttr("aria-label", unref(open) ? unref(t)("chat.close") : unref(t)("chat.open"))}>`);
        if (unref(open)) {
          _push(ssrRenderComponent(unref(X), {
            size: 22,
            "stroke-width": 2
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(MessageCircle), {
            size: 24,
            "stroke-width": 1.75
          }, null, _parent));
        }
        if (!unref(open) && unref(unread) > 0) {
          _push(`<span class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white" aria-hidden="true">${ssrInterpolate(unref(unread) > 9 ? "9+" : unref(unread))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatWidget.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VisitTracker",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: { "display": "none" },
        "aria-hidden": "true"
      }, _attrs))}></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VisitTracker.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { lang } = useLang();
    useHead({ htmlAttrs: { lang: lang.value } });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Spotlight = _sfc_main$5;
      const _component_ScrollProgress = _sfc_main$6;
      const _component_AppNavbar = _sfc_main$4;
      const _component_AppFooter = _sfc_main$3;
      const _component_ChatWidget = _sfc_main$2;
      const _component_VisitTracker = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "top",
        class: "relative flex min-h-screen flex-col"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Spotlight, null, null, _parent));
      _push(ssrRenderComponent(_component_ScrollProgress, null, null, _parent));
      _push(ssrRenderComponent(_component_AppNavbar, null, null, _parent));
      _push(`<main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
      _push(ssrRenderComponent(_component_ChatWidget, null, null, _parent));
      _push(ssrRenderComponent(_component_VisitTracker, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BWt1Tgha.mjs.map
