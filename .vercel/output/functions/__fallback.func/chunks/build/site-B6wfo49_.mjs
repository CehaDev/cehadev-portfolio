import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$3 } from './LocaleInput--oTP_896.mjs';
import { _ as _sfc_main$4 } from './LocaleTextarea-B9r3XgP5.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, reactive, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Sparkles, Languages, BarChart3, Mail, FolderKanban, HelpCircle, MessageSquareQuote, Search, Settings2, ExternalLink, User, Plus, Trash2, CheckSquare, Quote, LoaderCircle, Save } from 'lucide-vue-next';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
import { n as navigateTo } from './server.mjs';
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
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "LocaleTreeEditor",
  __ssrInlineRender: true,
  props: {
    data: {},
    depth: {}
  },
  setup(__props) {
    function isLS(v) {
      if (!v || typeof v !== "object" || Array.isArray(v)) return false;
      const keys = Object.keys(v);
      if (!keys.length) return false;
      return keys.every((k) => k === "id" || k === "en");
    }
    function setLS(v, next) {
      v.id = next.id;
      v.en = next.en;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LocaleInput = _sfc_main$3;
      const _component_LocaleTreeEditor = _sfc_main$2;
      if (isLS(__props.data)) {
        _push(ssrRenderComponent(_component_LocaleInput, mergeProps({
          "model-value": __props.data,
          placeholder: "...",
          "onUpdate:modelValue": ($event) => setLS(__props.data, $event)
        }, _attrs), null, _parent));
      } else if (__props.data && typeof __props.data === "object" && !Array.isArray(__props.data)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><!--[-->`);
        ssrRenderList(__props.data, (v, k) => {
          var _a;
          _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-2 flex items-center justify-between gap-2"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(k)}</span><button type="button" class="text-xs font-medium text-red-400 transition-colors hover:text-red-300"${ssrRenderAttr("aria-label", `Hapus ${String(k)}`)}> Hapus </button></div>`);
          _push(ssrRenderComponent(_component_LocaleTreeEditor, {
            data: v,
            depth: ((_a = __props.depth) != null ? _a : 0) + 1
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--><button type="button" class="btn-outline !px-3 !py-1.5 text-xs"> + Tambah Key </button></div>`);
      } else {
        _push(`<p${ssrRenderAttrs(mergeProps({ class: "text-xs text-text-muted" }, _attrs))}>(nilai: ${ssrInterpolate(String(__props.data))})</p>`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/LocaleTreeEditor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AdminSiteForm",
  __ssrInlineRender: true,
  props: {
    initial: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C;
    const props = __props;
    function str(v) {
      return typeof v === "string" ? v : "";
    }
    function ls(v) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const o = v;
        return { id: str(o.id), en: str(o.en) };
      }
      const s = str(v);
      return { id: s, en: s };
    }
    function lsList(v) {
      return Array.isArray(v) ? v.map((x) => ls(x)) : [];
    }
    function toStats(v) {
      return Array.isArray(v) ? v.map((s) => {
        const o = s && typeof s === "object" ? s : {};
        return { icon: str(o.icon), label: ls(o.label), sub: ls(o.sub), end: Number(o.end) || 0, suffix: ls(o.suffix) };
      }) : [];
    }
    function toProjectStats(v) {
      return Array.isArray(v) ? v.map((s) => {
        const o = s && typeof s === "object" ? s : {};
        return { icon: str(o.icon), label: ls(o.label), value: ls(o.value) };
      }) : [];
    }
    function toFaqs(v) {
      return Array.isArray(v) ? v.map((f) => {
        const o = f && typeof f === "object" ? f : {};
        return { q: ls(o.q), a: ls(o.a) };
      }) : [];
    }
    const form = reactive({
      name: str((_a = props.initial) == null ? void 0 : _a.name),
      role: ls((_b = props.initial) == null ? void 0 : _b.role),
      heroBadge: ls((_c = props.initial) == null ? void 0 : _c.heroBadge),
      heroTitle1: ls((_d = props.initial) == null ? void 0 : _d.heroTitle1),
      heroTitleGradient: ls((_e = props.initial) == null ? void 0 : _e.heroTitleGradient),
      heroSubtitle: ls((_f = props.initial) == null ? void 0 : _f.heroSubtitle),
      heroDescription: ls((_g = props.initial) == null ? void 0 : _g.heroDescription),
      aboutIntro: lsList((_h = props.initial) == null ? void 0 : _h.aboutIntro),
      aboutChecklist: lsList((_i = props.initial) == null ? void 0 : _i.aboutChecklist),
      quote: ls((_j = props.initial) == null ? void 0 : _j.quote),
      quoteHighlight: ls((_k = props.initial) == null ? void 0 : _k.quoteHighlight),
      stats: toStats((_l = props.initial) == null ? void 0 : _l.stats),
      email: str((_m = props.initial) == null ? void 0 : _m.email),
      phone: str((_n = props.initial) == null ? void 0 : _n.phone),
      location: ls((_o = props.initial) == null ? void 0 : _o.location),
      website: str((_p = props.initial) == null ? void 0 : _p.website),
      cvUrl: str((_q = props.initial) == null ? void 0 : _q.cvUrl),
      socials: {
        github: str((_s = (_r = props.initial) == null ? void 0 : _r.socials) == null ? void 0 : _s.github),
        linkedin: str((_u = (_t = props.initial) == null ? void 0 : _t.socials) == null ? void 0 : _u.linkedin),
        instagram: str((_w = (_v = props.initial) == null ? void 0 : _v.socials) == null ? void 0 : _w.instagram)
      },
      projectStats: toProjectStats((_x = props.initial) == null ? void 0 : _x.projectStats),
      faqs: toFaqs((_y = props.initial) == null ? void 0 : _y.faqs),
      headings: reactive((_A = (_z = props.initial) == null ? void 0 : _z.headings) != null ? _A : {}),
      seo: reactive((_C = (_B = props.initial) == null ? void 0 : _B.seo) != null ? _C : {})
    });
    const error = ref("");
    const saving = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LocaleInput = _sfc_main$3;
      const _component_LocaleTextarea = _sfc_main$4;
      const _component_LocaleTreeEditor = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<form${ssrRenderAttrs(mergeProps({
        class: "space-y-6",
        novalidate: ""
      }, _attrs))}><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Sparkles), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">Identitas &amp; Hero</h3><p class="mt-1 text-xs text-text-muted">Nama, badge, judul hero, dan deskripsi. Semua kolom mendukung dua bahasa (ID / EN).</p></div></div></div><div class="grid gap-6 p-7 lg:grid-cols-2"><div class="lg:col-span-2"><label for="site-name" class="mb-1.5 block text-sm font-medium text-text">Nama / Brand</label><input id="site-name"${ssrRenderAttr("value", form.name)} type="text" class="input-field" placeholder="CehaDev"></div><div><label class="mb-1.5 block text-sm font-medium text-text">Role / Profesi</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.role,
        "onUpdate:modelValue": ($event) => form.role = $event,
        placeholder: "Web Developer & Tech Enthusiast"
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-sm font-medium text-text">Badge Hero</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.heroBadge,
        "onUpdate:modelValue": ($event) => form.heroBadge = $event,
        placeholder: "Available for collaboration"
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-sm font-medium text-text">Teks Hero (sebelum gradient)</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.heroTitle1,
        "onUpdate:modelValue": ($event) => form.heroTitle1 = $event,
        placeholder: "Hi, I'm"
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-sm font-medium text-text">Teks Hero Gradient</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.heroTitleGradient,
        "onUpdate:modelValue": ($event) => form.heroTitleGradient = $event,
        placeholder: "CehaDev"
      }, null, _parent));
      _push(`</div><div class="lg:col-span-2"><label class="mb-1.5 block text-sm font-medium text-text">Subtitle Hero</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.heroSubtitle,
        "onUpdate:modelValue": ($event) => form.heroSubtitle = $event,
        placeholder: "Web Developer & Tech Enthusiast"
      }, null, _parent));
      _push(`</div><div class="lg:col-span-2"><label class="mb-1.5 block text-sm font-medium text-text">Deskripsi Hero</label>`);
      _push(ssrRenderComponent(_component_LocaleTextarea, {
        modelValue: form.heroDescription,
        "onUpdate:modelValue": ($event) => form.heroDescription = $event,
        rows: 3,
        placeholder: "Deskripsi singkat di bagian hero..."
      }, null, _parent));
      _push(`</div></div></div><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue/10 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(User), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">Tentang</h3><p class="mt-1 text-xs text-text-muted">Paragraf pengenalan, poin checklist, dan kutipan profil.</p></div></div></div><div class="space-y-6 p-7"><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(MessageSquareQuote), {
        size: 14,
        class: "text-primary"
      }, null, _parent));
      _push(` Paragraf Pengantar </p><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(form.aboutIntro, (p, i) => {
        _push(`<div class="rounded-xl border border-border bg-bg p-4"><div class="mb-2 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Paragraf ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div>`);
        _push(ssrRenderComponent(_component_LocaleTextarea, {
          modelValue: form.aboutIntro[i],
          "onUpdate:modelValue": ($event) => form.aboutIntro[i] = $event,
          rows: 3,
          placeholder: "Tulis paragraf..."
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (!form.aboutIntro.length) {
        _push(`<p class="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada paragraf. Klik &quot;Tambah&quot; untuk menambahkan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(CheckSquare), {
        size: 14,
        class: "text-primary"
      }, null, _parent));
      _push(` Checklist Tentang </p><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div><ul class="space-y-2"><!--[-->`);
      ssrRenderList(form.aboutChecklist, (item, i) => {
        _push(`<li class="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-2.5"><div class="min-w-0 flex-1">`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          modelValue: form.aboutChecklist[i],
          "onUpdate:modelValue": ($event) => form.aboutChecklist[i] = $event,
          placeholder: "Tulis poin checklist..."
        }, null, _parent));
        _push(`</div><button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10"${ssrRenderAttr("aria-label", `Hapus poin ${i + 1}`)}>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 14,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</button></li>`);
      });
      _push(`<!--]-->`);
      if (!form.aboutChecklist.length) {
        _push(`<p class="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada poin checklist. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div><div class="grid gap-5 sm:grid-cols-2"><div><label class="mb-1.5 block text-sm font-medium text-text flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Quote), {
        size: 14,
        class: "text-primary"
      }, null, _parent));
      _push(` Kutipan </label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.quote,
        "onUpdate:modelValue": ($event) => form.quote = $event,
        placeholder: "Code is not just about how it works..."
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-sm font-medium text-text flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Quote), {
        size: 14,
        class: "text-primary"
      }, null, _parent));
      _push(` Kutipan (highlight) </label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.quoteHighlight,
        "onUpdate:modelValue": ($event) => form.quoteHighlight = $event,
        placeholder: "how it's built."
      }, null, _parent));
      _push(`</div></div></div></div><div class="grid gap-6 lg:grid-cols-2"><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center justify-between"><div class="flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-lime-600 text-white" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(BarChart3), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">Statistik Beranda</h3><p class="mt-1 text-xs text-text-muted">Ikon: Clock, FolderGit2, Code2, Target</p></div></div><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div></div><div class="space-y-4 p-7"><!--[-->`);
      ssrRenderList(form.stats, (s, i) => {
        _push(`<div class="rounded-xl border border-border bg-bg p-5"><div class="mb-4 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Statistik ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-4"><div class="grid gap-4 sm:grid-cols-2"><div><label${ssrRenderAttr("for", `site-stat-icon-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Ikon</label><input${ssrRenderAttr("id", `site-stat-icon-${i}`)}${ssrRenderAttr("value", s.icon)} type="text" class="input-field" placeholder="Activity / Clock / Code2"></div><div><label${ssrRenderAttr("for", `site-stat-end-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Angka Akhir</label><input${ssrRenderAttr("id", `site-stat-end-${i}`)}${ssrRenderAttr("value", s.end)} type="number" class="input-field" placeholder="2"></div></div><div><label${ssrRenderAttr("for", `site-stat-label-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Label</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `site-stat-label-${i}`,
          modelValue: s.label,
          "onUpdate:modelValue": ($event) => s.label = $event,
          placeholder: "Years"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `site-stat-sub-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Sub</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `site-stat-sub-${i}`,
          modelValue: s.sub,
          "onUpdate:modelValue": ($event) => s.sub = $event,
          placeholder: "Learning & Building"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `site-stat-suffix-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Sufiks</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `site-stat-suffix-${i}`,
          modelValue: s.suffix,
          "onUpdate:modelValue": ($event) => s.suffix = $event,
          placeholder: "+"
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!form.stats.length) {
        _push(`<p class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted"> Belum ada statistik. Klik &quot;Tambah&quot; untuk menambahkan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Mail), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">Kontak &amp; Sosial</h3><p class="mt-1 text-xs text-text-muted">Email, telepon, lokasi, dan tautan media sosial.</p></div></div></div><div class="space-y-5 p-7"><div class="grid gap-5 sm:grid-cols-2"><div><label for="site-email" class="mb-1.5 block text-sm font-medium text-text">Email</label><input id="site-email"${ssrRenderAttr("value", form.email)} type="email" class="input-field" placeholder="hello@cehadev.id"></div><div><label for="site-phone" class="mb-1.5 block text-sm font-medium text-text">Telepon</label><input id="site-phone"${ssrRenderAttr("value", form.phone)} type="text" class="input-field" placeholder="+62 812-3456-7890"></div><div><label class="mb-1.5 block text-sm font-medium text-text">Lokasi</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.location,
        "onUpdate:modelValue": ($event) => form.location = $event,
        placeholder: "Wirosari, Grobogan, Jawa Tengah"
      }, null, _parent));
      _push(`</div><div><label for="site-website" class="mb-1.5 block text-sm font-medium text-text">Website</label><input id="site-website"${ssrRenderAttr("value", form.website)} type="text" class="input-field" placeholder="cehadev.id"></div><div><label for="site-cv-url" class="mb-1.5 block text-sm font-medium text-text">URL CV</label><input id="site-cv-url"${ssrRenderAttr("value", form.cvUrl)} type="text" class="input-field" placeholder="/cv"></div></div><div class="rounded-xl border border-border bg-bg p-4 space-y-4"><p class="text-xs font-semibold uppercase tracking-wider text-text-muted">Media Sosial</p><div><label for="site-social-github" class="mb-1.5 block text-sm font-medium text-text">GitHub</label><input id="site-social-github"${ssrRenderAttr("value", form.socials.github)} type="url" class="input-field" placeholder="https://github.com/..."></div><div><label for="site-social-linkedin" class="mb-1.5 block text-sm font-medium text-text">LinkedIn</label><input id="site-social-linkedin"${ssrRenderAttr("value", form.socials.linkedin)} type="url" class="input-field" placeholder="https://linkedin.com/in/..."></div><div><label for="site-social-instagram" class="mb-1.5 block text-sm font-medium text-text">Instagram</label><input id="site-social-instagram"${ssrRenderAttr("value", form.socials.instagram)} type="url" class="input-field" placeholder="https://instagram.com/..."></div></div></div></div></div><div class="grid gap-6 lg:grid-cols-2"><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue/10 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center justify-between"><div class="flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(FolderKanban), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">Statistik Project</h3><p class="mt-1 text-xs text-text-muted">4 kartu di halaman project</p></div></div><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div></div><div class="space-y-4 p-7"><!--[-->`);
      ssrRenderList(form.projectStats, (s, i) => {
        _push(`<div class="rounded-xl border border-border bg-bg p-5"><div class="mb-4 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Kartu ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-4"><div><label${ssrRenderAttr("for", `site-ps-icon-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Ikon</label><select${ssrRenderAttr("id", `site-ps-icon-${i}`)} class="input-field"><option value="FolderKanban"${ssrIncludeBooleanAttr(Array.isArray(s.icon) ? ssrLooseContain(s.icon, "FolderKanban") : ssrLooseEqual(s.icon, "FolderKanban")) ? " selected" : ""}>FolderKanban</option><option value="Tag"${ssrIncludeBooleanAttr(Array.isArray(s.icon) ? ssrLooseContain(s.icon, "Tag") : ssrLooseEqual(s.icon, "Tag")) ? " selected" : ""}>Tag</option><option value="CalendarRange"${ssrIncludeBooleanAttr(Array.isArray(s.icon) ? ssrLooseContain(s.icon, "CalendarRange") : ssrLooseEqual(s.icon, "CalendarRange")) ? " selected" : ""}>CalendarRange</option><option value="Code2"${ssrIncludeBooleanAttr(Array.isArray(s.icon) ? ssrLooseContain(s.icon, "Code2") : ssrLooseEqual(s.icon, "Code2")) ? " selected" : ""}>Code2</option></select></div><div><label${ssrRenderAttr("for", `site-ps-label-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Label</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `site-ps-label-${i}`,
          modelValue: s.label,
          "onUpdate:modelValue": ($event) => s.label = $event,
          placeholder: "Project"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `site-ps-value-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Nilai</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `site-ps-value-${i}`,
          modelValue: s.value,
          "onUpdate:modelValue": ($event) => s.value = $event,
          placeholder: "6"
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!form.projectStats.length) {
        _push(`<p class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted"> Belum ada kartu statistik. Jika kosong, nilai otomatis dihitung dari data project. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center justify-between"><div class="flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(HelpCircle), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">FAQ</h3><p class="mt-1 text-xs text-text-muted">Pertanyaan &amp; jawaban umum.</p></div></div><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div></div><div class="space-y-4 p-7"><!--[-->`);
      ssrRenderList(form.faqs, (f, i) => {
        _push(`<div class="rounded-xl border border-border bg-bg p-5"><div class="mb-4 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">FAQ ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-4"><div><label${ssrRenderAttr("for", `site-faq-q-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Pertanyaan</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `site-faq-q-${i}`,
          modelValue: f.q,
          "onUpdate:modelValue": ($event) => f.q = $event,
          placeholder: "Apakah Anda menerima project freelance?"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `site-faq-a-${i}`)} class="mb-1.5 block text-sm font-medium text-text">Jawaban</label>`);
        _push(ssrRenderComponent(_component_LocaleTextarea, {
          id: `site-faq-a-${i}`,
          modelValue: f.a,
          "onUpdate:modelValue": ($event) => f.a = $event,
          rows: 2,
          placeholder: "Jawaban..."
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!form.faqs.length) {
        _push(`<p class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted"> Belum ada FAQ. Klik &quot;Tambah&quot; untuk menambahkan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="grid gap-6 lg:grid-cols-2"><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center justify-between"><div class="flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(MessageSquareQuote), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">Heading &amp; Label</h3><p class="mt-1 text-xs text-text-muted">Teks antarmuka per halaman.</p></div></div><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah Halaman </button></div></div><div class="p-7">`);
      _push(ssrRenderComponent(_component_LocaleTreeEditor, {
        data: form.headings
      }, null, _parent));
      _push(`</div></div><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" aria-hidden="true"></div><div class="relative flex items-center justify-between"><div class="flex items-center gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Search), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="text-base font-bold text-text">SEO / Meta</h3><p class="mt-1 text-xs text-text-muted">Judul &amp; deskripsi SEO per halaman.</p></div></div><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah Halaman </button></div></div><div class="p-7">`);
      _push(ssrRenderComponent(_component_LocaleTreeEditor, {
        data: form.seo
      }, null, _parent));
      _push(`</div></div></div>`);
      if (error.value) {
        _push(`<div class="card flex items-start gap-3 border-red-500/30 bg-red-500/10 px-5 py-4" role="alert"><span class="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true"></span><p class="text-sm text-red-400">${ssrInterpolate(error.value)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card flex items-center justify-between p-5">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "btn-outline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Batal`);
          } else {
            return [
              createTextVNode("Batal")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>`);
      if (saving.value) {
        _push(ssrRenderComponent(unref(LoaderCircle), {
          size: 16,
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Save), {
          size: 16,
          "stroke-width": 2
        }, null, _parent));
      }
      _push(` ${ssrInterpolate(saving.value ? "Menyimpan..." : "Simpan Pengaturan")}</button></div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminSiteForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "site",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: site, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-site", () => useRequestFetch()("/api/admin/site"))), __temp = await __temp, __restore(), __temp);
    async function onSaved() {
      await refresh();
      await navigateTo("/admin/site");
    }
    const sections = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      return [
        { label: "Hero", icon: Sparkles, count: 6 },
        { label: "Tentang", icon: Languages, count: ((_c = (_b = (_a = site.value) == null ? void 0 : _a.aboutIntro) == null ? void 0 : _b.length) != null ? _c : 0) + ((_f = (_e = (_d = site.value) == null ? void 0 : _d.aboutChecklist) == null ? void 0 : _e.length) != null ? _f : 0) },
        { label: "Statistik", icon: BarChart3, count: (_i = (_h = (_g = site.value) == null ? void 0 : _g.stats) == null ? void 0 : _h.length) != null ? _i : 0 },
        { label: "Kontak", icon: Mail, count: 1 },
        { label: "Project Stats", icon: FolderKanban, count: (_l = (_k = (_j = site.value) == null ? void 0 : _j.projectStats) == null ? void 0 : _k.length) != null ? _l : 0 },
        { label: "FAQ", icon: HelpCircle, count: (_o = (_n = (_m = site.value) == null ? void 0 : _m.faqs) == null ? void 0 : _n.length) != null ? _o : 0 },
        { label: "Headings", icon: MessageSquareQuote, count: Object.keys((_q = (_p = site.value) == null ? void 0 : _p.headings) != null ? _q : {}).length },
        { label: "SEO", icon: Search, count: Object.keys((_s = (_r = site.value) == null ? void 0 : _r.seo) != null ? _s : {}).length }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AdminSiteForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="card relative overflow-hidden p-8"><div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-blue/10 blur-3xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-6"><div class="flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Settings2), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><span class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">`);
      _push(ssrRenderComponent(unref(Sparkles), {
        size: 12,
        "stroke-width": 2,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Site Settings </span><h2 class="mt-3 text-xl font-extrabold tracking-tight text-text">Pengaturan Website</h2><p class="mt-1.5 text-sm text-text-secondary">Kelola hero, tentang, statistik, kontak, sosial, dan FAQ website.</p><div class="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-text-muted"><!--[-->`);
      ssrRenderList(unref(sections), (s) => {
        _push(`<span class="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(s.icon), {
          size: 11,
          "stroke-width": 2,
          class: "text-primary"
        }, null), _parent);
        _push(` ${ssrInterpolate(s.label)}: ${ssrInterpolate(s.count)}</span>`);
      });
      _push(`<!--]--></div></div></div><div class="flex flex-col items-end gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        target: "_blank",
        class: "btn-outline !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ExternalLink), {
              size: 16,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` Lihat Website `);
          } else {
            return [
              createVNode(unref(ExternalLink), {
                size: 16,
                "stroke-width": 2
              }),
              createTextVNode(" Lihat Website ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Pratinjau halaman publik</span></div></div></div>`);
      if (unref(site)) {
        _push(ssrRenderComponent(_component_AdminSiteForm, {
          initial: unref(site),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/site.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=site-B6wfo49_.mjs.map
