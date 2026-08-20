import { _ as _sfc_main$3 } from './Reveal-B94-pL53.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, withCtx, unref, createVNode, resolveDynamicComponent, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, reactive, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderVNode, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Send, User, AtSign, Tag, MessageSquare, LoaderCircle, Lock, Navigation } from 'lucide-vue-next';
import { u as useI18n } from './useI18n-Djb0t6ty.mjs';
import { a as useSiteSettings } from './useContentData-B9bxi5bI.mjs';
import { u as useSeoMeta } from './v3-C1_XsqpX.mjs';
import './localize-vezARIz8.mjs';
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
import './ssr-DMxvrB_f.mjs';
import './asyncData-I2BNYYXU.mjs';
import 'perfect-debounce';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ContactForm",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const form = reactive({ name: "", email: "", subject: "", message: "" });
    const errors = reactive({});
    const status = ref("idle");
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card h-full p-6 md:p-8" }, _attrs))}><div class="flex items-start gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Send), {
        size: 18,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h2 class="text-lg font-bold text-text">${ssrInterpolate(unref(t)("contact.title"))}</h2><p class="mt-1 text-sm text-text-secondary">${ssrInterpolate(unref(t)("contact.desc"))}</p></div></div><form class="mt-7 space-y-5" novalidate><div class="grid gap-5 sm:grid-cols-2"><div><label for="cf-name" class="mb-1.5 block text-sm font-medium text-text">${ssrInterpolate(unref(t)("contact.name"))}</label><div class="relative"><span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(User), {
        size: 15,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</span><input id="cf-name"${ssrRenderAttr("value", unref(form).name)} type="text" class="${ssrRenderClass([unref(errors).name ? "!border-red-500/60" : "", "input-field pl-10"])}" placeholder="{{ t(&#39;contact.namePlaceholder&#39;) }}" autocomplete="name"></div>`);
      if (unref(errors).name) {
        _push(`<p class="mt-1 text-xs text-red-400">${ssrInterpolate(unref(errors).name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="cf-email" class="mb-1.5 block text-sm font-medium text-text">${ssrInterpolate(unref(t)("contact.email"))}</label><div class="relative"><span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(AtSign), {
        size: 15,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</span><input id="cf-email"${ssrRenderAttr("value", unref(form).email)} type="email" class="${ssrRenderClass([unref(errors).email ? "!border-red-500/60" : "", "input-field pl-10"])}" placeholder="{{ t(&#39;contact.emailPlaceholder&#39;) }}" autocomplete="email"></div>`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 text-xs text-red-400">${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><label for="cf-subject" class="mb-1.5 block text-sm font-medium text-text">${ssrInterpolate(unref(t)("contact.subject"))}</label><div class="relative"><span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Tag), {
        size: 15,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</span><input id="cf-subject"${ssrRenderAttr("value", unref(form).subject)} type="text" class="${ssrRenderClass([unref(errors).subject ? "!border-red-500/60" : "", "input-field pl-10"])}" placeholder="{{ t(&#39;contact.subjectPlaceholder&#39;) }}"></div>`);
      if (unref(errors).subject) {
        _push(`<p class="mt-1 text-xs text-red-400">${ssrInterpolate(unref(errors).subject)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="cf-message" class="mb-1.5 block text-sm font-medium text-text">${ssrInterpolate(unref(t)("contact.message"))}</label><div class="relative"><span class="pointer-events-none absolute left-3.5 top-4 text-text-muted" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(MessageSquare), {
        size: 15,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</span><textarea id="cf-message" rows="5" class="${ssrRenderClass([unref(errors).message ? "!border-red-500/60" : "", "input-field resize-none pl-10"])}" placeholder="{{ t(&#39;contact.messagePlaceholder&#39;) }}">${ssrInterpolate(unref(form).message)}</textarea></div>`);
      if (unref(errors).message) {
        _push(`<p class="mt-1 text-xs text-red-400">${ssrInterpolate(unref(errors).message)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit" class="btn-primary w-full sm:w-auto"${ssrIncludeBooleanAttr(unref(status) === "loading") ? " disabled" : ""}>`);
      if (unref(status) === "loading") {
        _push(ssrRenderComponent(unref(LoaderCircle), {
          size: 17,
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Send), {
          size: 16,
          "stroke-width": 2
        }, null, _parent));
      }
      _push(` ${ssrInterpolate(unref(status) === "loading" ? unref(t)("contact.sending") : unref(t)("contact.send"))}</button>`);
      if (unref(status) === "success") {
        _push(`<p class="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success" role="status">${ssrInterpolate(unref(t)("contact.success"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(status) === "error") {
        _push(`<p class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400" role="alert">${ssrInterpolate(unref(errorMsg))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="flex items-center gap-2 text-xs text-text-muted">`);
      _push(ssrRenderComponent(unref(Lock), {
        size: 13,
        "stroke-width": 1.5,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("contact.privacy"))}</p></form></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DarkMap",
  __ssrInlineRender: true,
  props: {
    location: { default: "Wirosari, Grobogan, Jawa Tengah" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-card-hover" }, _attrs))}><div class="relative h-44 shrink-0 overflow-hidden border-b border-border bg-bg-alt" role="img" aria-label="Peta Wirosari, Grobogan dengan penanda lokasi"><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "linear-gradient(rgb(var(--color-border) / 0.55) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-border) / 0.55) 1px, transparent 1px)", "background-size": "28px 28px" })}" aria-hidden="true"></div><svg class="absolute inset-0 h-full w-full" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="rgba(139,92,246,0.35)" stroke-width="2"><path d="M0 60 C60 20, 120 90, 180 50 S300 40, 300 70"></path><path d="M0 110 C80 70, 160 130, 240 100 S300 110, 300 120" opacity="0.7"></path><path d="M40 0 C60 50, 20 100, 60 150" opacity="0.6"></path><path d="M180 0 C200 40, 170 110, 200 150" opacity="0.8"></path><path d="M120 0 C110 60, 150 100, 140 150" opacity="0.5"></path></g><circle cx="150" cy="75" r="34" fill="rgba(124,58,237,0.18)"></circle><circle cx="150" cy="75" r="22" fill="rgba(124,58,237,0.28)"></circle></svg><span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><span class="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(MapPin), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`<span class="absolute inset-0 animate-ping rounded-full bg-primary/50"></span></span></span><span class="absolute right-3 top-3 inline-flex max-w-[60%] items-center gap-1.5 rounded-md border border-border bg-card/80 px-2.5 py-1 text-[10px] font-medium text-text-secondary backdrop-blur-sm">`);
      _push(ssrRenderComponent(unref(MapPin), {
        size: 10,
        "stroke-width": 2,
        class: "shrink-0 text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="truncate">${ssrInterpolate(__props.location)}</span></span></div><div class="mt-auto p-6"><div class="flex items-start justify-between gap-4"><div><p class="text-sm font-semibold text-text">${ssrInterpolate(__props.location)}</p><p class="mt-1 text-xs text-text-muted">Open to remote work worldwide</p></div><span class="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-medium text-success"><span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true"></span> Online </span></div><a href="https://maps.google.com/?q=Wirosari%2C+Grobogan%2C+Jawa+Tengah" target="_blank" rel="noopener noreferrer" class="btn-outline mt-5 w-full !py-2.5">`);
      _push(ssrRenderComponent(unref(Navigation), {
        size: 15,
        "stroke-width": 1.75
      }, null, _parent));
      _push(` View on Maps </a></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DarkMap.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    useSeoMeta({
      title: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.contact) == null ? void 0 : _c.title) != null ? _d : "Contact | CehaDev";
      },
      description: () => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = site.value) == null ? void 0 : _a.seo) == null ? void 0 : _b.contact) == null ? void 0 : _c.description) != null ? _d : "Hubungi CehaDev untuk kolaborasi, project freelance, atau sekadar menyapa. Respons cepat dan terbuka untuk peluang kerja sama.";
      }
    });
    const headings = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.contact) != null ? _c : {};
    });
    const contacts = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      return [
        { icon: Mail, label: (_a = headings.value.contactEmail) != null ? _a : "Email", value: (_c = (_b = site.value) == null ? void 0 : _b.email) != null ? _c : "", href: `mailto:${(_e = (_d = site.value) == null ? void 0 : _d.email) != null ? _e : ""}` },
        { icon: Phone, label: (_f = headings.value.contactPhone) != null ? _f : "Phone", value: (_h = (_g = site.value) == null ? void 0 : _g.phone) != null ? _h : "", href: `tel:${((_j = (_i = site.value) == null ? void 0 : _i.phone) != null ? _j : "").replace(/[^+\d]/g, "")}` },
        { icon: MapPin, label: (_k = headings.value.contactLocation) != null ? _k : "Location", value: (_m = (_l = site.value) == null ? void 0 : _l.location) != null ? _m : "", href: `https://maps.google.com/?q=${encodeURIComponent((_o = (_n = site.value) == null ? void 0 : _n.location) != null ? _o : "")}` }
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
      const _component_Reveal = _sfc_main$3;
      const _component_ContactForm = _sfc_main$2;
      const _component_DarkMap = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-site py-16 md:py-24" }, _attrs))}><section class="mx-auto max-w-2xl text-center">`);
      _push(ssrRenderComponent(_component_Reveal, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<span class="section-label"${_scopeId}><span class="dot" aria-hidden="true"${_scopeId}></span> ${ssrInterpolate((_a = unref(headings).letsWork) != null ? _a : "Let's work together")}</span><h1 class="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl"${_scopeId}>${ssrInterpolate((_b = unref(headings).getIn1) != null ? _b : "Get In")} <span class="bg-gradient-brand bg-clip-text text-transparent"${_scopeId}>${ssrInterpolate((_c = unref(headings).getIn2) != null ? _c : "Touch")}</span></h1><p class="mt-4 text-[15px] leading-relaxed text-text-secondary"${_scopeId}>${ssrInterpolate((_d = unref(headings).heroDesc) != null ? _d : "Ada pertanyaan, ide, atau project yang ingin dikerjakan? Saya selalu senang berdiskusi tentang teknologi dan peluang baru.")}</p><span class="mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1.5 text-xs font-medium text-success"${_scopeId}><span class="relative flex h-2 w-2" aria-hidden="true"${_scopeId}><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"${_scopeId}></span><span class="relative inline-flex h-2 w-2 rounded-full bg-success"${_scopeId}></span></span> ${ssrInterpolate((_e = unref(headings).available) != null ? _e : "Available for new projects")}</span><div class="mt-6 flex items-center justify-center gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(socials), (s) => {
              _push2(`<a${ssrRenderAttr("href", s.href)} target="_blank" rel="noopener noreferrer" class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-gradient-brand hover:text-white hover:shadow-btn-glow"${ssrRenderAttr("aria-label", s.label)}${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(s.icon), {
                size: 17,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</a>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("span", { class: "section-label" }, [
                createVNode("span", {
                  class: "dot",
                  "aria-hidden": "true"
                }),
                createTextVNode(" " + toDisplayString((_f = unref(headings).letsWork) != null ? _f : "Let's work together"), 1)
              ]),
              createVNode("h1", { class: "mt-3 text-3xl font-extrabold tracking-tight md:text-5xl" }, [
                createTextVNode(toDisplayString((_g = unref(headings).getIn1) != null ? _g : "Get In") + " ", 1),
                createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, toDisplayString((_h = unref(headings).getIn2) != null ? _h : "Touch"), 1)
              ]),
              createVNode("p", { class: "mt-4 text-[15px] leading-relaxed text-text-secondary" }, toDisplayString((_i = unref(headings).heroDesc) != null ? _i : "Ada pertanyaan, ide, atau project yang ingin dikerjakan? Saya selalu senang berdiskusi tentang teknologi dan peluang baru."), 1),
              createVNode("span", { class: "mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1.5 text-xs font-medium text-success" }, [
                createVNode("span", {
                  class: "relative flex h-2 w-2",
                  "aria-hidden": "true"
                }, [
                  createVNode("span", { class: "absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" }),
                  createVNode("span", { class: "relative inline-flex h-2 w-2 rounded-full bg-success" })
                ]),
                createTextVNode(" " + toDisplayString((_j = unref(headings).available) != null ? _j : "Available for new projects"), 1)
              ]),
              createVNode("div", { class: "mt-6 flex items-center justify-center gap-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(socials), (s) => {
                  return openBlock(), createBlock("a", {
                    key: s.label,
                    href: s.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-gradient-brand hover:text-white hover:shadow-btn-glow",
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
      _push(`</section><section class="mt-14"><div class="grid gap-6 sm:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(contacts), (c, i) => {
        _push(ssrRenderComponent(_component_Reveal, {
          key: c.label,
          delay: i * 90
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<a${ssrRenderAttr("href", c.href)}${ssrRenderAttr("target", c.href.startsWith("http") ? "_blank" : void 0)}${ssrRenderAttr("rel", c.href.startsWith("http") ? "noopener noreferrer" : void 0)} class="group card flex h-full flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"${_scopeId}><span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-brand group-hover:text-white group-hover:shadow-btn-glow" aria-hidden="true"${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(c.icon), {
                size: 20,
                "stroke-width": 1.5
              }, null), _parent2, _scopeId);
              _push2(`</span><p class="mt-4 text-[11px] font-medium uppercase tracking-wider text-text-muted"${_scopeId}>${ssrInterpolate(c.label)}</p><p class="mt-1 truncate text-sm font-semibold text-text transition-colors group-hover:text-primary"${_scopeId}>${ssrInterpolate(c.value)}</p></a>`);
            } else {
              return [
                createVNode("a", {
                  href: c.href,
                  target: c.href.startsWith("http") ? "_blank" : void 0,
                  rel: c.href.startsWith("http") ? "noopener noreferrer" : void 0,
                  class: "group card flex h-full flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                }, [
                  createVNode("span", {
                    class: "mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-brand group-hover:text-white group-hover:shadow-btn-glow",
                    "aria-hidden": "true"
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(c.icon), {
                      size: 20,
                      "stroke-width": 1.5
                    }))
                  ]),
                  createVNode("p", { class: "mt-4 text-[11px] font-medium uppercase tracking-wider text-text-muted" }, toDisplayString(c.label), 1),
                  createVNode("p", { class: "mt-1 truncate text-sm font-semibold text-text transition-colors group-hover:text-primary" }, toDisplayString(c.value), 1)
                ], 8, ["href", "target", "rel"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="mt-6 grid items-stretch gap-6 lg:grid-cols-2">`);
      _push(ssrRenderComponent(_component_Reveal, { class: "h-full" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ContactForm, { class: "h-full" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ContactForm, { class: "h-full" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Reveal, {
        class: "h-full",
        delay: 100
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(ssrRenderComponent(_component_DarkMap, {
              class: "h-full",
              location: (_b = (_a = unref(site)) == null ? void 0 : _a.location) != null ? _b : "Wirosari, Grobogan, Jawa Tengah"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DarkMap, {
                class: "h-full",
                location: (_d = (_c = unref(site)) == null ? void 0 : _c.location) != null ? _d : "Wirosari, Grobogan, Jawa Tengah"
              }, null, 8, ["location"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-C3XmW8Fq.mjs.map
