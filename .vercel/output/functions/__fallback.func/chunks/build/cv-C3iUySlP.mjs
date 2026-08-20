import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$2 } from './LocaleInput--oTP_896.mjs';
import { _ as _sfc_main$3 } from './LocaleTextarea-B9r3XgP5.mjs';
import { defineComponent, withAsyncContext, mergeProps, withCtx, unref, createVNode, createTextVNode, reactive, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { ArrowLeft, FileText, ExternalLink, User, ChevronDown, Sparkles, LoaderCircle, Upload, X, Briefcase, Trash2, Plus, GraduationCap, Award, Languages, Save } from 'lucide-vue-next';
import { _ as _export_sfc, n as navigateTo } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AdminCvForm",
  __ssrInlineRender: true,
  props: {
    initial: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
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
    const form = reactive({
      fullName: str((_a = props.initial) == null ? void 0 : _a.fullName),
      title: ls((_b = props.initial) == null ? void 0 : _b.title),
      photo: str((_c = props.initial) == null ? void 0 : _c.photo),
      email: str((_d = props.initial) == null ? void 0 : _d.email),
      phone: str((_e = props.initial) == null ? void 0 : _e.phone),
      location: ls((_f = props.initial) == null ? void 0 : _f.location),
      website: str((_g = props.initial) == null ? void 0 : _g.website),
      linkedin: str((_h = props.initial) == null ? void 0 : _h.linkedin),
      github: str((_i = props.initial) == null ? void 0 : _i.github),
      summary: ls((_j = props.initial) == null ? void 0 : _j.summary),
      experiences: ((_l = (_k = props.initial) == null ? void 0 : _k.experiences) != null ? _l : []).map((e) => ({
        role: ls(e == null ? void 0 : e.role),
        company: ls(e == null ? void 0 : e.company),
        period: ls(e == null ? void 0 : e.period),
        description: ls(e == null ? void 0 : e.description)
      })),
      education: ((_n = (_m = props.initial) == null ? void 0 : _m.education) != null ? _n : []).map((e) => ({
        degree: ls(e == null ? void 0 : e.degree),
        school: ls(e == null ? void 0 : e.school),
        period: ls(e == null ? void 0 : e.period),
        description: ls(e == null ? void 0 : e.description)
      })),
      skills: ((_p = (_o = props.initial) == null ? void 0 : _o.skills) != null ? _p : []).map(ls),
      languages: ((_r = (_q = props.initial) == null ? void 0 : _q.languages) != null ? _r : []).map((l) => ({ name: ls(l == null ? void 0 : l.name), level: ls(l == null ? void 0 : l.level) })),
      certifications: ((_t = (_s = props.initial) == null ? void 0 : _s.certifications) != null ? _t : []).map((c) => ({ name: ls(c == null ? void 0 : c.name), issuer: ls(c == null ? void 0 : c.issuer), year: ls(c == null ? void 0 : c.year) }))
    });
    const error = ref("");
    const saving = ref(false);
    const uploadingPhoto = ref(false);
    ref(null);
    const sections = reactive({
      personal: true,
      experience: true,
      education: true,
      skills: true
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LocaleInput = _sfc_main$2;
      const _component_LocaleTextarea = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<form${ssrRenderAttrs(mergeProps({
        class: "space-y-6",
        novalidate: ""
      }, _attrs))} data-v-0d2e73b3><div class="cv-section card overflow-hidden" data-v-0d2e73b3><button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" data-v-0d2e73b3><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-primary" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(User), {
        size: 20,
        "stroke-width": 2
      }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1" data-v-0d2e73b3><h3 class="text-base font-bold text-text sm:text-lg" data-v-0d2e73b3>Data Pribadi</h3><p class="mt-0.5 text-xs text-text-muted" data-v-0d2e73b3>Informasi dasar dan kontak Anda</p></div>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        size: 18,
        "stroke-width": 2,
        class: ["shrink-0 text-text-muted transition-transform duration-300", sections.personal ? "rotate-180" : ""]
      }, null, _parent));
      _push(`</button><div class="section-content" style="${ssrRenderStyle(sections.personal ? null : { display: "none" })}" data-v-0d2e73b3><div class="border-t border-border px-6 pb-6 pt-5 sm:px-7" data-v-0d2e73b3><p class="mb-5 rounded-lg bg-primary/5 px-4 py-2.5 text-xs text-primary/80" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Sparkles), {
        size: 14,
        "stroke-width": 2,
        class: "mr-1.5 inline-block align-[-2px]"
      }, null, _parent));
      _push(` Semua kolom teks mendukung dua bahasa. Kosongkan kolom EN agar otomatis memakai teks Indonesia. </p><div class="mb-6 flex flex-wrap items-center gap-5 rounded-xl border border-border/60 bg-gradient-to-r from-bg-alt/80 to-bg/50 p-5 backdrop-blur-sm" data-v-0d2e73b3><div class="group relative h-28 w-28 shrink-0" data-v-0d2e73b3><div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-primary-blue/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" data-v-0d2e73b3></div><div class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card transition-all group-hover:border-primary/40" data-v-0d2e73b3>`);
      if (form.photo) {
        _push(`<img${ssrRenderAttr("src", form.photo)} alt="Foto profil CV" class="h-full w-full object-cover" data-v-0d2e73b3>`);
      } else {
        _push(`<span class="text-4xl font-bold text-text-muted" data-v-0d2e73b3>${ssrInterpolate((form.fullName || "?").charAt(0))}</span>`);
      }
      _push(`</div></div><div class="min-w-0 flex-1" data-v-0d2e73b3><p class="text-sm font-semibold text-text" data-v-0d2e73b3>Foto Profil CV</p><p class="mt-0.5 text-xs text-text-muted" data-v-0d2e73b3>JPG, PNG, WEBP, atau AVIF \u2014 maks 5 MB</p><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="hidden" data-v-0d2e73b3><div class="mt-3 flex flex-wrap gap-2" data-v-0d2e73b3><button type="button" class="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-btn-glow hover:-translate-y-0.5"${ssrIncludeBooleanAttr(uploadingPhoto.value) ? " disabled" : ""} data-v-0d2e73b3>`);
      if (uploadingPhoto.value) {
        _push(ssrRenderComponent(unref(LoaderCircle), {
          size: 14,
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Upload), {
          size: 14,
          "stroke-width": 2
        }, null, _parent));
      }
      _push(` ${ssrInterpolate(uploadingPhoto.value ? "Mengunggah..." : "Ubah Foto")}</button>`);
      if (form.photo && form.photo !== "/ch.png") {
        _push(`<button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-red-400/50 hover:text-red-400" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(X), {
          size: 12,
          "stroke-width": 2
        }, null, _parent));
        _push(` Reset </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-0d2e73b3><div class="sm:col-span-2 lg:col-span-1" data-v-0d2e73b3><label for="cv-name" class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>Nama Lengkap <span class="text-red-400" data-v-0d2e73b3>*</span></label><input id="cv-name"${ssrRenderAttr("value", form.fullName)} type="text" class="input-field" placeholder="CehaDev" data-v-0d2e73b3></div><div data-v-0d2e73b3><label class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>Judul / Profesi</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.title,
        "onUpdate:modelValue": ($event) => form.title = $event,
        placeholder: "Web Developer & Tech Enthusiast"
      }, null, _parent));
      _push(`</div><div data-v-0d2e73b3><label for="cv-email" class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>Email</label><input id="cv-email"${ssrRenderAttr("value", form.email)} type="email" class="input-field" placeholder="hello@cehadev.id" data-v-0d2e73b3></div><div data-v-0d2e73b3><label for="cv-phone" class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>Telepon</label><input id="cv-phone"${ssrRenderAttr("value", form.phone)} type="text" class="input-field" placeholder="+62 812-3456-7890" data-v-0d2e73b3></div><div data-v-0d2e73b3><label class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>Lokasi</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.location,
        "onUpdate:modelValue": ($event) => form.location = $event,
        placeholder: "Wirosari, Grobogan, Jawa Tengah"
      }, null, _parent));
      _push(`</div><div data-v-0d2e73b3><label for="cv-website" class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>Website</label><input id="cv-website"${ssrRenderAttr("value", form.website)} type="text" class="input-field" placeholder="cehadev.id" data-v-0d2e73b3></div><div data-v-0d2e73b3><label for="cv-linkedin" class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>LinkedIn</label><input id="cv-linkedin"${ssrRenderAttr("value", form.linkedin)} type="url" class="input-field" placeholder="https://linkedin.com/in/..." data-v-0d2e73b3></div><div data-v-0d2e73b3><label for="cv-github" class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>GitHub</label><input id="cv-github"${ssrRenderAttr("value", form.github)} type="url" class="input-field" placeholder="https://github.com/..." data-v-0d2e73b3></div><div class="sm:col-span-2" data-v-0d2e73b3><label class="mb-1.5 block text-sm font-medium text-text" data-v-0d2e73b3>Ringkasan Profil</label>`);
      _push(ssrRenderComponent(_component_LocaleTextarea, {
        modelValue: form.summary,
        "onUpdate:modelValue": ($event) => form.summary = $event,
        rows: 3,
        placeholder: "Ringkasan singkat tentang Anda..."
      }, null, _parent));
      _push(`</div></div></div></div></div><div class="cv-section card overflow-hidden" data-v-0d2e73b3><button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" data-v-0d2e73b3><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-primary-blue" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Briefcase), {
        size: 20,
        "stroke-width": 2
      }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1" data-v-0d2e73b3><h3 class="text-base font-bold text-text sm:text-lg" data-v-0d2e73b3>Pengalaman Kerja</h3><p class="mt-0.5 text-xs text-text-muted" data-v-0d2e73b3>${ssrInterpolate(form.experiences.length)} pengalaman tercatat</p></div>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        size: 18,
        "stroke-width": 2,
        class: ["shrink-0 text-text-muted transition-transform duration-300", sections.experience ? "rotate-180" : ""]
      }, null, _parent));
      _push(`</button><div class="section-content" style="${ssrRenderStyle(sections.experience ? null : { display: "none" })}" data-v-0d2e73b3><div class="border-t border-border px-6 pb-6 pt-5 sm:px-7" data-v-0d2e73b3><div class="space-y-4" data-v-0d2e73b3><!--[-->`);
      ssrRenderList(form.experiences, (e, i) => {
        _push(`<div class="cv-item group relative rounded-xl border border-border/60 bg-gradient-to-r from-bg-alt/60 to-bg/40 p-5 transition-all hover:border-primary/30 hover:shadow-sm" data-v-0d2e73b3><div class="mb-4 flex items-center justify-between" data-v-0d2e73b3><div class="flex items-center gap-2.5" data-v-0d2e73b3><span class="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary" data-v-0d2e73b3>${ssrInterpolate(i + 1)}</span><span class="text-xs font-semibold uppercase tracking-wider text-text-muted" data-v-0d2e73b3>Pengalaman ${ssrInterpolate(i + 1)}</span></div><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3.5 sm:grid-cols-2" data-v-0d2e73b3><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Posisi</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-exp-role-${i}`,
          modelValue: e.role,
          "onUpdate:modelValue": ($event) => e.role = $event,
          placeholder: "Web Developer"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Perusahaan</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-exp-company-${i}`,
          modelValue: e.company,
          "onUpdate:modelValue": ($event) => e.company = $event,
          placeholder: "Nama perusahaan"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Periode</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-exp-period-${i}`,
          modelValue: e.period,
          "onUpdate:modelValue": ($event) => e.period = $event,
          placeholder: "2024 \u2014 Sekarang"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Deskripsi</label>`);
        _push(ssrRenderComponent(_component_LocaleTextarea, {
          id: `cv-exp-desc-${i}`,
          modelValue: e.description,
          "onUpdate:modelValue": ($event) => e.description = $event,
          rows: 2,
          placeholder: "Deskripsi tanggung jawab..."
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (form.experiences.length) {
        _push(`<button type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-primary/30 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/5" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Plus), {
          size: 14,
          "stroke-width": 2
        }, null, _parent));
        _push(` Tambah Pengalaman </button>`);
      } else {
        _push(`<!---->`);
      }
      if (!form.experiences.length) {
        _push(`<p class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Briefcase), {
          size: 28,
          "stroke-width": 1.5,
          class: "text-text-muted/40"
        }, null, _parent));
        _push(`<span class="text-sm text-text-muted" data-v-0d2e73b3>Belum ada pengalaman kerja</span><button type="button" class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Plus), {
          size: 12,
          "stroke-width": 2
        }, null, _parent));
        _push(` Tambah Sekarang </button></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="cv-section card overflow-hidden" data-v-0d2e73b3><button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" data-v-0d2e73b3><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(GraduationCap), {
        size: 20,
        "stroke-width": 2
      }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1" data-v-0d2e73b3><h3 class="text-base font-bold text-text sm:text-lg" data-v-0d2e73b3>Pendidikan</h3><p class="mt-0.5 text-xs text-text-muted" data-v-0d2e73b3>${ssrInterpolate(form.education.length)} pendidikan tercatat</p></div>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        size: 18,
        "stroke-width": 2,
        class: ["shrink-0 text-text-muted transition-transform duration-300", sections.education ? "rotate-180" : ""]
      }, null, _parent));
      _push(`</button><div class="section-content" style="${ssrRenderStyle(sections.education ? null : { display: "none" })}" data-v-0d2e73b3><div class="border-t border-border px-6 pb-6 pt-5 sm:px-7" data-v-0d2e73b3><div class="space-y-4" data-v-0d2e73b3><!--[-->`);
      ssrRenderList(form.education, (e, i) => {
        _push(`<div class="cv-item group relative rounded-xl border border-border/60 bg-gradient-to-r from-bg-alt/60 to-bg/40 p-5 transition-all hover:border-emerald-400/30 hover:shadow-sm" data-v-0d2e73b3><div class="mb-4 flex items-center justify-between" data-v-0d2e73b3><div class="flex items-center gap-2.5" data-v-0d2e73b3><span class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-500" data-v-0d2e73b3>${ssrInterpolate(i + 1)}</span><span class="text-xs font-semibold uppercase tracking-wider text-text-muted" data-v-0d2e73b3>Pendidikan ${ssrInterpolate(i + 1)}</span></div><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3.5 sm:grid-cols-2" data-v-0d2e73b3><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Gelar / Jurusan</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-edu-degree-${i}`,
          modelValue: e.degree,
          "onUpdate:modelValue": ($event) => e.degree = $event,
          placeholder: "Ilmu Komputer"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Institusi</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-edu-school-${i}`,
          modelValue: e.school,
          "onUpdate:modelValue": ($event) => e.school = $event,
          placeholder: "Nama universitas"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Periode</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-edu-period-${i}`,
          modelValue: e.period,
          "onUpdate:modelValue": ($event) => e.period = $event,
          placeholder: "2022 \u2014 Sekarang"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Deskripsi</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-edu-desc-${i}`,
          modelValue: e.description,
          "onUpdate:modelValue": ($event) => e.description = $event,
          placeholder: "Opsional"
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (form.education.length) {
        _push(`<button type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-emerald-500 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Plus), {
          size: 14,
          "stroke-width": 2
        }, null, _parent));
        _push(` Tambah Pendidikan </button>`);
      } else {
        _push(`<!---->`);
      }
      if (!form.education.length) {
        _push(`<p class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(GraduationCap), {
          size: 28,
          "stroke-width": 1.5,
          class: "text-text-muted/40"
        }, null, _parent));
        _push(`<span class="text-sm text-text-muted" data-v-0d2e73b3>Belum ada data pendidikan</span><button type="button" class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500 transition-colors hover:bg-emerald-500/20" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Plus), {
          size: 12,
          "stroke-width": 2
        }, null, _parent));
        _push(` Tambah Sekarang </button></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="cv-section card overflow-hidden" data-v-0d2e73b3><button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" data-v-0d2e73b3><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Award), {
        size: 20,
        "stroke-width": 2
      }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1" data-v-0d2e73b3><h3 class="text-base font-bold text-text sm:text-lg" data-v-0d2e73b3>Keahlian &amp; Sertifikasi</h3><p class="mt-0.5 text-xs text-text-muted" data-v-0d2e73b3>${ssrInterpolate(form.skills.length)} skill \xB7 ${ssrInterpolate(form.languages.length)} bahasa \xB7 ${ssrInterpolate(form.certifications.length)} sertifikasi</p></div>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        size: 18,
        "stroke-width": 2,
        class: ["shrink-0 text-text-muted transition-transform duration-300", sections.skills ? "rotate-180" : ""]
      }, null, _parent));
      _push(`</button><div class="section-content" style="${ssrRenderStyle(sections.skills ? null : { display: "none" })}" data-v-0d2e73b3><div class="border-t border-border px-6 pb-6 pt-5 sm:px-7" data-v-0d2e73b3><div class="grid gap-6 lg:grid-cols-2" data-v-0d2e73b3><div data-v-0d2e73b3><div class="mb-3 flex items-center justify-between" data-v-0d2e73b3><p class="text-sm font-semibold text-text" data-v-0d2e73b3>Skills</p><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/5" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 12,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div><ul class="space-y-2" data-v-0d2e73b3><!--[-->`);
      ssrRenderList(form.skills, (s, i) => {
        _push(`<li class="flex items-center gap-3 rounded-xl border border-border/60 bg-bg-alt/50 px-3 py-2 transition-all hover:border-primary/30" data-v-0d2e73b3><div class="min-w-0 flex-1" data-v-0d2e73b3>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          modelValue: form.skills[i],
          "onUpdate:modelValue": ($event) => form.skills[i] = $event,
          placeholder: "Nama skill..."
        }, null, _parent));
        _push(`</div><button type="button" class="shrink-0 rounded-lg border border-transparent p-1.5 text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"${ssrRenderAttr("aria-label", `Hapus skill ${i + 1}`)} data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 14,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</button></li>`);
      });
      _push(`<!--]--></ul>`);
      if (!form.skills.length) {
        _push(`<p class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center" data-v-0d2e73b3><span class="text-sm text-text-muted" data-v-0d2e73b3>Belum ada skill</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-0d2e73b3><div class="mb-3 flex items-center justify-between" data-v-0d2e73b3><p class="flex items-center gap-2 text-sm font-semibold text-text" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Languages), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary-blue"
      }, null, _parent));
      _push(` Bahasa </p><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-primary-blue/30 px-3 py-1.5 text-xs font-semibold text-primary-blue transition-all hover:border-primary-blue/50 hover:bg-primary-blue/5" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 12,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div><div class="space-y-2" data-v-0d2e73b3><!--[-->`);
      ssrRenderList(form.languages, (l, i) => {
        _push(`<div class="rounded-xl border border-border/60 bg-bg-alt/50 p-3 transition-all hover:border-primary-blue/30" data-v-0d2e73b3><div class="grid gap-2.5 sm:grid-cols-2" data-v-0d2e73b3><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Nama</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-lang-name-${i}`,
          modelValue: l.name,
          "onUpdate:modelValue": ($event) => l.name = $event,
          placeholder: "Indonesia"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Tingkat</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-lang-level-${i}`,
          modelValue: l.level,
          "onUpdate:modelValue": ($event) => l.level = $event,
          placeholder: "Native"
        }, null, _parent));
        _push(`</div></div><button type="button" class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"${ssrRenderAttr("aria-label", `Hapus bahasa ${i + 1}`)} data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div>`);
      });
      _push(`<!--]--></div>`);
      if (!form.languages.length) {
        _push(`<p class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center" data-v-0d2e73b3><span class="text-sm text-text-muted" data-v-0d2e73b3>Belum ada bahasa</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mt-6" data-v-0d2e73b3><div class="mb-3 flex items-center justify-between" data-v-0d2e73b3><p class="flex items-center gap-2 text-sm font-semibold text-text" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Award), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-amber-500"
      }, null, _parent));
      _push(` Sertifikasi </p><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-500 transition-all hover:border-amber-500/50 hover:bg-amber-500/5" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 12,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button></div><div class="space-y-2" data-v-0d2e73b3><!--[-->`);
      ssrRenderList(form.certifications, (c, i) => {
        _push(`<div class="rounded-xl border border-border/60 bg-bg-alt/50 p-4 transition-all hover:border-amber-400/30" data-v-0d2e73b3><div class="grid gap-2.5 sm:grid-cols-3" data-v-0d2e73b3><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Nama</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-cert-name-${i}`,
          modelValue: c.name,
          "onUpdate:modelValue": ($event) => c.name = $event,
          placeholder: "Nama sertifikasi"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Penerbit</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-cert-issuer-${i}`,
          modelValue: c.issuer,
          "onUpdate:modelValue": ($event) => c.issuer = $event,
          placeholder: "Penerbit"
        }, null, _parent));
        _push(`</div><div data-v-0d2e73b3><label class="mb-1 block text-xs font-medium text-text-secondary" data-v-0d2e73b3>Tahun</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `cv-cert-year-${i}`,
          modelValue: c.year,
          "onUpdate:modelValue": ($event) => c.year = $event,
          placeholder: "2023"
        }, null, _parent));
        _push(`</div></div><button type="button" class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"${ssrRenderAttr("aria-label", `Hapus sertifikasi ${i + 1}`)} data-v-0d2e73b3>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div>`);
      });
      _push(`<!--]--></div>`);
      if (!form.certifications.length) {
        _push(`<p class="mt-2 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center" data-v-0d2e73b3><span class="text-sm text-text-muted" data-v-0d2e73b3>Belum ada sertifikasi</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
      if (error.value) {
        _push(`<div class="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3.5 text-sm text-red-400" role="alert" data-v-0d2e73b3><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs" data-v-0d2e73b3>!</span> ${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center justify-between rounded-xl border border-border bg-card p-4 sm:p-5" data-v-0d2e73b3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "btn-outline !px-4 !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Batal `);
          } else {
            return [
              createTextVNode(" Batal ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit" class="btn-primary !px-6 !py-2.5"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} data-v-0d2e73b3>`);
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
      _push(` ${ssrInterpolate(saving.value ? "Menyimpan..." : "Simpan CV")}</button></div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminCvForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0d2e73b3"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cv",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: cv, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-cv", () => useRequestFetch()("/api/admin/cv"))), __temp = await __temp, __restore(), __temp);
    async function onSaved() {
      await refresh();
      await navigateTo("/admin/cv");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AdminCvForm = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"><div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-primary-blue/10 blur-3xl" aria-hidden="true"></div><div class="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-gradient-to-tr from-primary-blue/15 to-primary/10 blur-2xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-4"><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-text-secondary transition-all hover:border-primary/50 hover:text-text hover:shadow-btn-glow",
        "aria-label": "Kembali"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), {
              size: 18,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ArrowLeft), {
                size: 18,
                "stroke-width": 2
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3"><div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow">`);
      _push(ssrRenderComponent(unref(FileText), {
        size: 20,
        "stroke-width": 2
      }, null, _parent));
      _push(`</div><div><h2 class="text-xl font-bold text-text sm:text-2xl">Kelola CV</h2><p class="mt-0.5 text-sm text-text-secondary">Perbarui data CV Anda secara lengkap</p></div></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cv",
        target: "_blank",
        class: "group btn-outline !px-5 !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ExternalLink), {
              size: 16,
              "stroke-width": 2,
              class: "transition-transform group-hover:rotate-12"
            }, null, _parent2, _scopeId));
            _push2(` Lihat CV `);
          } else {
            return [
              createVNode(unref(ExternalLink), {
                size: 16,
                "stroke-width": 2,
                class: "transition-transform group-hover:rotate-12"
              }),
              createTextVNode(" Lihat CV ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(cv)) {
        _push(ssrRenderComponent(_component_AdminCvForm, {
          initial: unref(cv),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/cv.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cv-C3iUySlP.mjs.map
