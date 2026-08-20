import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$2 } from './LocaleInput--oTP_896.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createVNode, createTextVNode, reactive, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Sparkles, ExternalLink, Code2, Plus, Trash2, Wand2, Star, ListChecks, Wrench, LoaderCircle, Save } from 'lucide-vue-next';
import { t as techIcons } from './useSkills-YG6FZoMb.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AdminSkillsForm",
  __ssrInlineRender: true,
  props: {
    initial: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    var _a, _b, _c, _d, _e, _f;
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
    function toHomeSkills(v) {
      return Array.isArray(v) ? v.map((s) => {
        const o = s && typeof s === "object" ? s : {};
        return { name: ls(o.name), level: Number(o.level) || 0, tech: str(o.tech) };
      }) : [];
    }
    function toTechSkills(v) {
      return Array.isArray(v) ? v.map((s) => {
        const o = s && typeof s === "object" ? s : {};
        return { name: ls(o.name), level: Number(o.level) || 0, tech: str(o.tech), category: ls(o.category) };
      }) : [];
    }
    function toSummary(v) {
      return Array.isArray(v) ? v.map((s) => {
        const o = s && typeof s === "object" ? s : {};
        return { label: ls(o.label), value: ls(o.value), icon: str(o.icon) || "Code2" };
      }) : [];
    }
    const form = reactive({
      homeSkills: toHomeSkills((_a = props.initial) == null ? void 0 : _a.homeSkills),
      technicalSkills: toTechSkills((_b = props.initial) == null ? void 0 : _b.technicalSkills),
      marqueeTech: lsList((_c = props.initial) == null ? void 0 : _c.marqueeTech),
      skillsSummary: toSummary((_d = props.initial) == null ? void 0 : _d.skillsSummary),
      toolsList: lsList((_e = props.initial) == null ? void 0 : _e.toolsList),
      softSkills: lsList((_f = props.initial) == null ? void 0 : _f.softSkills)
    });
    const error = ref("");
    const saving = ref(false);
    const techKeys = Object.keys(techIcons);
    const summaryIcons = ["Code2", "Clock", "FolderGit2", "GraduationCap", "Target", "Activity", "Users", "Award", "Star"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LocaleInput = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<form${ssrRenderAttrs(mergeProps({
        class: "space-y-8",
        novalidate: ""
      }, _attrs))}><div class="card p-7"><div class="mb-6 flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Code2), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Home Skills <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 1</span></h3><p class="mt-0.5 text-xs text-text-muted">Daftar skill pada bagian skill beranda. Nama dan kategori dapat diisi dua bahasa.</p></div></div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Daftar Skill</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah skill baru</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(form.homeSkills, (s, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white" aria-hidden="true">${ssrInterpolate(i + 1)}</span> Skill ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3 sm:grid-cols-2"><div><label class="mb-1 block text-xs font-medium text-text">Nama</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `hs-name-${i}`,
          modelValue: s.name,
          "onUpdate:modelValue": ($event) => s.name = $event,
          placeholder: "JavaScript"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `hs-tech-${i}`)} class="mb-1 block text-xs font-medium text-text">Tech Key</label><select${ssrRenderAttr("id", `hs-tech-${i}`)} class="input-field !py-2"><!--[-->`);
        ssrRenderList(unref(techKeys), (key) => {
          _push(`<option${ssrRenderAttr("value", key)}${ssrIncludeBooleanAttr(Array.isArray(s.tech) ? ssrLooseContain(s.tech, key) : ssrLooseEqual(s.tech, key)) ? " selected" : ""}>${ssrInterpolate(unref(techIcons)[key].name)}</option>`);
        });
        _push(`<!--]--></select></div></div><div class="mt-3"><div class="mb-1.5 flex items-center justify-between"><label${ssrRenderAttr("for", `hs-level-${i}`)} class="text-xs font-medium text-text">Level</label><span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">${ssrInterpolate(s.level)}%</span></div><input${ssrRenderAttr("id", `hs-level-${i}`)}${ssrRenderAttr("value", s.level)} type="range" min="0" max="100" step="1" class="w-full cursor-pointer accent-primary"></div></div>`);
      });
      _push(`<!--]-->`);
      if (!form.homeSkills.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada skill. Klik &quot;Tambah&quot; untuk menambahkan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="card p-7"><div class="mb-6 flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Wand2), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Technical Skills <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 2</span></h3><p class="mt-0.5 text-xs text-text-muted">Skill teknis dengan kategori untuk halaman skill.</p></div></div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Daftar Skill Teknis</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah skill teknis</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(form.technicalSkills, (s, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white" aria-hidden="true">${ssrInterpolate(i + 1)}</span> Skill ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><div><label class="mb-1 block text-xs font-medium text-text">Nama</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `ts-name-${i}`,
          modelValue: s.name,
          "onUpdate:modelValue": ($event) => s.name = $event,
          placeholder: "Vue.js"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `ts-tech-${i}`)} class="mb-1 block text-xs font-medium text-text">Tech Key</label><select${ssrRenderAttr("id", `ts-tech-${i}`)} class="input-field !py-2"><!--[-->`);
        ssrRenderList(unref(techKeys), (key) => {
          _push(`<option${ssrRenderAttr("value", key)}${ssrIncludeBooleanAttr(Array.isArray(s.tech) ? ssrLooseContain(s.tech, key) : ssrLooseEqual(s.tech, key)) ? " selected" : ""}>${ssrInterpolate(unref(techIcons)[key].name)}</option>`);
        });
        _push(`<!--]--></select></div><div><label class="mb-1 block text-xs font-medium text-text">Kategori</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `ts-category-${i}`,
          modelValue: s.category,
          "onUpdate:modelValue": ($event) => s.category = $event,
          placeholder: "Framework"
        }, null, _parent));
        _push(`</div></div><div class="mt-3"><div class="mb-1.5 flex items-center justify-between"><label${ssrRenderAttr("for", `ts-level-${i}`)} class="text-xs font-medium text-text">Level</label><span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">${ssrInterpolate(s.level)}%</span></div><input${ssrRenderAttr("id", `ts-level-${i}`)}${ssrRenderAttr("value", s.level)} type="range" min="0" max="100" step="1" class="w-full cursor-pointer accent-primary"></div></div>`);
      });
      _push(`<!--]-->`);
      if (!form.technicalSkills.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada skill teknis. Klik &quot;Tambah&quot; untuk menambahkan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="card p-7"><div class="mb-6 flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Star), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Skills Summary &amp; Marquee <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 3</span></h3><p class="mt-0.5 text-xs text-text-muted">Kartu ringkasan angka dan teks berjalan di halaman skill.</p></div></div><div class="grid gap-6 lg:grid-cols-2"><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Kartu Ringkasan</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah kartu</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(form.skillsSummary, (s, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white" aria-hidden="true">${ssrInterpolate(i + 1)}</span> Kartu ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3 sm:grid-cols-3"><div><label class="mb-1 block text-xs font-medium text-text">Label</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `ss-label-${i}`,
          modelValue: s.label,
          "onUpdate:modelValue": ($event) => s.label = $event,
          placeholder: "Teknologi"
        }, null, _parent));
        _push(`</div><div><label class="mb-1 block text-xs font-medium text-text">Nilai</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `ss-value-${i}`,
          modelValue: s.value,
          "onUpdate:modelValue": ($event) => s.value = $event,
          placeholder: "10+"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `ss-icon-${i}`)} class="mb-1 block text-xs font-medium text-text">Ikon</label><select${ssrRenderAttr("id", `ss-icon-${i}`)} class="input-field !py-2"><!--[-->`);
        ssrRenderList(summaryIcons, (ic) => {
          _push(`<option${ssrRenderAttr("value", ic)}${ssrIncludeBooleanAttr(Array.isArray(s.icon) ? ssrLooseContain(s.icon, ic) : ssrLooseEqual(s.icon, ic)) ? " selected" : ""}>${ssrInterpolate(ic)}</option>`);
        });
        _push(`<!--]--></select></div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!form.skillsSummary.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada kartu ringkasan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Marquee Tech</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah tech</span></div></div><ul class="space-y-2"><!--[-->`);
      ssrRenderList(form.marqueeTech, (m, i) => {
        _push(`<li class="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-white" aria-hidden="true">${ssrInterpolate(i + 1)}</span><div class="min-w-0 flex-1">`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          modelValue: form.marqueeTech[i],
          "onUpdate:modelValue": ($event) => form.marqueeTech[i] = $event,
          placeholder: "Vue.js"
        }, null, _parent));
        _push(`</div><button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10"${ssrRenderAttr("aria-label", `Hapus marquee ${i + 1}`)}>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 14,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</button></li>`);
      });
      _push(`<!--]-->`);
      if (!form.marqueeTech.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada item marquee. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div></div></div><div class="card p-7"><div class="mb-6 flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(ListChecks), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Soft Skills &amp; Tools <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 4</span></h3><p class="mt-0.5 text-xs text-text-muted">Kemampuan non-teknis dan perangkat yang biasa dipakai.</p></div></div><div class="grid gap-6 lg:grid-cols-2"><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Soft Skills</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah soft skill</span></div></div><ul class="space-y-2"><!--[-->`);
      ssrRenderList(form.softSkills, (s, i) => {
        _push(`<li class="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-white" aria-hidden="true">${ssrInterpolate(i + 1)}</span><div class="min-w-0 flex-1">`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          modelValue: form.softSkills[i],
          "onUpdate:modelValue": ($event) => form.softSkills[i] = $event,
          placeholder: "Komunikasi"
        }, null, _parent));
        _push(`</div><button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10"${ssrRenderAttr("aria-label", `Hapus soft skill ${i + 1}`)}>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 14,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</button></li>`);
      });
      _push(`<!--]-->`);
      if (!form.softSkills.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada soft skill. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div><div><div class="mb-3 flex items-center justify-between"><p class="flex items-center gap-2 text-sm font-medium text-text">`);
      _push(ssrRenderComponent(unref(Wrench), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Tools </p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah tool</span></div></div><ul class="space-y-2"><!--[-->`);
      ssrRenderList(form.toolsList, (t, i) => {
        _push(`<li class="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-white" aria-hidden="true">${ssrInterpolate(i + 1)}</span><div class="min-w-0 flex-1">`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          modelValue: form.toolsList[i],
          "onUpdate:modelValue": ($event) => form.toolsList[i] = $event,
          placeholder: "VS Code"
        }, null, _parent));
        _push(`</div><button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10"${ssrRenderAttr("aria-label", `Hapus tool ${i + 1}`)}>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 14,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</button></li>`);
      });
      _push(`<!--]-->`);
      if (!form.toolsList.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada tool. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div></div></div>`);
      if (error.value) {
        _push(`<p class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="sticky bottom-4 z-20 rounded-card border border-border bg-card/95 p-4 shadow-card backdrop-blur lg:static lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none"><div class="flex flex-wrap items-center justify-end gap-6"><div class="flex flex-col items-center gap-1">`);
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
      _push(`<span class="text-[9px] text-text-muted">Batalkan &amp; kembali</span></div><div class="flex flex-col items-center gap-1"><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>`);
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
      _push(` ${ssrInterpolate(saving.value ? "Menyimpan..." : "Simpan Skill")}</button><span class="text-[9px] text-text-muted">Simpan perubahan ke content/skills.json</span></div></div></div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminSkillsForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "skills",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: skills, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-skills", () => useRequestFetch()("/api/admin/skills"))), __temp = await __temp, __restore(), __temp);
    async function onSaved() {
      await refresh();
      await navigateTo("/admin/skills");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AdminSkillsForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="card relative overflow-hidden p-7"><div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-5"><div class="flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Sparkles), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h2 class="text-lg font-extrabold tracking-tight text-text">Kelola Skill</h2><p class="mt-1 text-sm text-text-secondary">Data skill tersimpan di content/skills.json. Atur skill beranda, teknis, ringkasan, dan perangkat.</p><div class="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-text-muted"><span class="rounded-full border border-border bg-card px-2.5 py-1">Home: ${ssrInterpolate((_c = (_b = (_a = unref(skills)) == null ? void 0 : _a.homeSkills) == null ? void 0 : _b.length) != null ? _c : 0)}</span><span class="rounded-full border border-border bg-card px-2.5 py-1">Teknis: ${ssrInterpolate((_f = (_e = (_d = unref(skills)) == null ? void 0 : _d.technicalSkills) == null ? void 0 : _e.length) != null ? _f : 0)}</span><span class="rounded-full border border-border bg-card px-2.5 py-1">Tools: ${ssrInterpolate((_i = (_h = (_g = unref(skills)) == null ? void 0 : _g.toolsList) == null ? void 0 : _h.length) != null ? _i : 0)}</span></div></div></div><div class="flex flex-col items-center gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/skills",
        target: "_blank",
        class: "btn-outline !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ExternalLink), {
              size: 16,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` Lihat Skill `);
          } else {
            return [
              createVNode(unref(ExternalLink), {
                size: 16,
                "stroke-width": 2
              }),
              createTextVNode(" Lihat Skill ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Buka halaman skill publik</span></div></div></div>`);
      if (unref(skills)) {
        _push(ssrRenderComponent(_component_AdminSkillsForm, {
          initial: unref(skills),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/skills.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=skills-B1qp3R2s.mjs.map
