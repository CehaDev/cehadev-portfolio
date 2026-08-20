import { _ as _sfc_main$1 } from './LocaleInput--oTP_896.mjs';
import { _ as _sfc_main$2 } from './LocaleTextarea-B9r3XgP5.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, reactive, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle } from 'vue/server-renderer';
import { Check, LoaderCircle, Save, FileText, Settings2, MonitorPlay, FileCode2, ChevronUp, ChevronDown, Trash2, Plus, Tags, ListChecks, GitBranch, Bug, BarChart3, Images, ImagePlus, X } from 'lucide-vue-next';
import { t as techIcons } from './useSkills-YG6FZoMb.mjs';
import { C as CODE_LANGS } from './demoCode-DHLAJk19.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminProjectForm",
  __ssrInlineRender: true,
  props: {
    initial: { default: void 0 },
    endpoint: {},
    method: { default: "POST" }
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
    const initialDetail = (_b = (_a = props.initial) == null ? void 0 : _a.detail) != null ? _b : {};
    const form = reactive({
      title: ls((_c = props.initial) == null ? void 0 : _c.title),
      slug: str((_d = props.initial) == null ? void 0 : _d.slug),
      tagline: ls((_e = props.initial) == null ? void 0 : _e.tagline),
      description: ls((_f = props.initial) == null ? void 0 : _f.description),
      category: ls((_g = props.initial) == null ? void 0 : _g.category),
      year: str((_h = props.initial) == null ? void 0 : _h.year) || String((/* @__PURE__ */ new Date()).getFullYear()),
      role: ls((_i = props.initial) == null ? void 0 : _i.role),
      duration: ls((_j = props.initial) == null ? void 0 : _j.duration),
      liveUrl: str((_k = props.initial) == null ? void 0 : _k.liveUrl),
      githubUrl: str((_l = props.initial) == null ? void 0 : _l.githubUrl),
      featured: Boolean((_m = props.initial) == null ? void 0 : _m.featured),
      archived: Boolean((_n = props.initial) == null ? void 0 : _n.archived),
      tags: ((_p = (_o = props.initial) == null ? void 0 : _o.tags) != null ? _p : []).map(ls),
      tech: [...(_r = (_q = props.initial) == null ? void 0 : _q.tech) != null ? _r : []]
    });
    const detail = reactive({
      overview: ls(initialDetail.overview),
      featureHighlights: ((_s = initialDetail.featureHighlights) != null ? _s : []).map((f) => ({ icon: str(f == null ? void 0 : f.icon) || "Star", color: str(f == null ? void 0 : f.color) || "#8B5CF6", title: ls(f == null ? void 0 : f.title), desc: ls(f == null ? void 0 : f.desc) })),
      mainFeatures: ((_t = initialDetail.mainFeatures) != null ? _t : []).map((f) => ({ icon: str(f == null ? void 0 : f.icon) || "Star", color: str(f == null ? void 0 : f.color) || "#8B5CF6", title: ls(f == null ? void 0 : f.title), desc: ls(f == null ? void 0 : f.desc) })),
      techStack: [...(_u = initialDetail.techStack) != null ? _u : []],
      process: ((_v = initialDetail.process) != null ? _v : []).map((p) => ({ num: str(p == null ? void 0 : p.num), icon: str(p == null ? void 0 : p.icon) || "Code2", title: ls(p == null ? void 0 : p.title), desc: ls(p == null ? void 0 : p.desc) })),
      challenges: ((_w = initialDetail.challenges) != null ? _w : []).map((c) => ({ title: ls(c == null ? void 0 : c.title), desc: ls(c == null ? void 0 : c.desc) })),
      results: ((_x = initialDetail.results) != null ? _x : []).map((r) => ({ icon: str(r == null ? void 0 : r.icon) || "Activity", value: ls(r == null ? void 0 : r.value), label: ls(r == null ? void 0 : r.label) })),
      gallery: ((_y = initialDetail.gallery) != null ? _y : []).map((g) => ({ label: ls(g == null ? void 0 : g.label), seed: Number(g == null ? void 0 : g.seed) || 1, image: str(g == null ? void 0 : g.image) || void 0 }))
    });
    const initialDemo = (_A = (_z = props.initial) == null ? void 0 : _z.demo) != null ? _A : {};
    const demo = reactive({
      enabled: Boolean(initialDemo.enabled),
      type: str(initialDemo.type) || "studio",
      title: ls(initialDemo.title),
      note: ls(initialDemo.note),
      files: ((_C = (_B = initialDemo.code) == null ? void 0 : _B.files) != null ? _C : []).map((f) => {
        const o = f && typeof f === "object" ? f : {};
        return { name: str(o.name), language: str(o.language) || "javascript", content: str(o.content) };
      })
    });
    const demoTypeOptions = [
      { value: "store", label: "Toko Online (Cehava Store)", desc: "Katalog, keranjang, & checkout" },
      { value: "kanban", label: "Kanban Board (Magerans)", desc: "Manajemen tugas tim" },
      { value: "dashboard", label: "Dashboard Analitik (DevBoard)", desc: "Metrik & grafik real-time" },
      { value: "api", label: "API Playground (NuTech API)", desc: "Konsol REST API interaktif" },
      { value: "todo", label: "Task Manager (TaskFlow)", desc: "Tugas harian gaya mobile" },
      { value: "code", label: "Code Viewer", desc: "File kode berbagai bahasa pemrograman" },
      { value: "studio", label: "Studio Live Preview", desc: "File tree + editor + hasil project berjalan (HTML/CSS/JS)" }
    ];
    const activeFileIndex = ref(0);
    const activeFile = computed(() => demo.files[activeFileIndex.value]);
    const techKeys = Object.keys(techIcons);
    const categoryOptions = ["Web App", "E-Commerce", "Dashboard", "Mobile App", "Backend API", "Landing Page"];
    const iconOptions = ["Search", "LayoutDashboard", "MessageSquare", "ShieldCheck", "FolderKanban", "Star", "Bell", "Users", "FolderCheck", "Activity", "Code2", "ClipboardList", "PenTool", "Rocket", "Bug"];
    const error = ref("");
    const saving = ref(false);
    const uploadingGallery = ref(null);
    ref({});
    const sectionNav = [
      { id: "pf-sec-basic", num: 1, label: "Informasi Dasar" },
      { id: "pf-sec-meta", num: 2, label: "Metadata & Status" },
      { id: "pf-sec-demo", num: 3, label: "Demo Interaktif" },
      { id: "pf-sec-content", num: 4, label: "Konten & Tech" },
      { id: "pf-sec-detail", num: 5, label: "Detail Halaman" }
    ];
    const activeSection = ref("pf-sec-basic");
    const sectionsFilled = computed(() => ({
      "pf-sec-basic": Boolean(form.title.id.trim() || form.slug.trim()),
      "pf-sec-meta": Boolean(form.category.id.trim() || form.liveUrl.trim() || form.featured),
      "pf-sec-demo": demo.enabled,
      "pf-sec-content": form.tags.some(hasText) || form.tech.length > 0,
      "pf-sec-detail": Boolean(detail.overview.id.trim()) || detail.featureHighlights.length > 0 || detail.mainFeatures.length > 0 || detail.techStack.length > 0 || detail.process.length > 0 || detail.challenges.length > 0 || detail.results.length > 0 || detail.gallery.length > 0
    }));
    function autoSlug() {
      if (!form.slug && form.title.id) {
        form.slug = form.title.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      }
    }
    watch(() => form.title.id, () => autoSlug());
    function hasText(v) {
      return Boolean(v.id.trim() || v.en.trim());
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LocaleInput = _sfc_main$1;
      const _component_LocaleTextarea = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<form${ssrRenderAttrs(mergeProps({ novalidate: "" }, _attrs))}><div class="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8"><aside class="sticky top-24 mb-8 hidden lg:block" aria-label="Navigasi bagian form"><nav class="card space-y-1.5 p-4"><p class="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Isi Project</p><!--[-->`);
      ssrRenderList(sectionNav, (s) => {
        _push(`<button type="button" class="${ssrRenderClass([activeSection.value === s.id ? "bg-gradient-brand text-white shadow-btn-glow" : "text-text-secondary hover:bg-card hover:text-text", "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium transition-colors"])}"${ssrRenderAttr("aria-current", activeSection.value === s.id ? "step" : void 0)}><span class="${ssrRenderClass([activeSection.value === s.id ? "bg-white/20 text-white" : sectionsFilled.value[s.id] ? "bg-success/15 text-success" : "bg-bg-alt text-text-muted", "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"])}" aria-hidden="true">`);
        if (sectionsFilled.value[s.id] && activeSection.value !== s.id) {
          _push(ssrRenderComponent(unref(Check), {
            size: 12,
            "stroke-width": 2.5
          }, null, _parent));
        } else {
          _push(`<!--[-->${ssrInterpolate(s.num)}<!--]-->`);
        }
        _push(`</span> ${ssrInterpolate(s.label)}</button>`);
      });
      _push(`<!--]--><div class="flex flex-col items-stretch gap-1 pt-3"><button type="submit" class="btn-primary w-full !py-2.5"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>`);
      if (saving.value) {
        _push(ssrRenderComponent(unref(LoaderCircle), {
          size: 15,
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Save), {
          size: 15,
          "stroke-width": 2
        }, null, _parent));
      }
      _push(` ${ssrInterpolate(saving.value ? "Menyimpan..." : "Simpan Project")}</button><span class="text-center text-[9px] text-text-muted">Simpan perubahan ke file JSON</span></div></nav></aside><div class="space-y-8"><div id="pf-sec-basic" class="card scroll-mt-24 p-7"><div class="mb-6 flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(FileText), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Informasi Dasar <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 1</span></h3><p class="mt-0.5 text-xs text-text-muted">Semua kolom teks dapat diisi dua bahasa. Kosongkan kolom EN agar otomatis memakai teks Indonesia.</p></div></div><div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><div><label class="mb-1.5 block text-sm font-medium text-text">Judul Project</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.title,
        "onUpdate:modelValue": ($event) => form.title = $event,
        placeholder: "Nama project"
      }, null, _parent));
      _push(`</div><div><label for="pf-slug" class="mb-1.5 block text-sm font-medium text-text">Slug (URL)</label><input id="pf-slug"${ssrRenderAttr("value", form.slug)} type="text" class="input-field" placeholder="nama-project"></div><div class="sm:col-span-2 xl:col-span-1"><label class="mb-1.5 block text-sm font-medium text-text">Tagline</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.tagline,
        "onUpdate:modelValue": ($event) => form.tagline = $event,
        placeholder: "Satu kalimat deskripsi singkat"
      }, null, _parent));
      _push(`</div><div class="sm:col-span-2 xl:col-span-3"><label class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>`);
      _push(ssrRenderComponent(_component_LocaleTextarea, {
        modelValue: form.description,
        "onUpdate:modelValue": ($event) => form.description = $event,
        rows: 3,
        placeholder: "Deskripsi project untuk kartu & halaman detail"
      }, null, _parent));
      _push(`</div></div></div><div id="pf-sec-meta" class="card scroll-mt-24 p-7"><div class="mb-6 flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Settings2), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Metadata &amp; Status <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 2</span></h3><p class="mt-0.5 text-xs text-text-muted">Kategori, tautan, dan status tampilan project.</p></div></div><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><div><label for="pf-cat" class="mb-1.5 block text-sm font-medium text-text">Kategori</label><select id="pf-cat" class="input-field"><!--[-->`);
      ssrRenderList(categoryOptions, (c) => {
        _push(`<option${ssrRenderAttr("value", c)}${ssrIncludeBooleanAttr(Array.isArray(form.category.id) ? ssrLooseContain(form.category.id, c) : ssrLooseEqual(form.category.id, c)) ? " selected" : ""}>${ssrInterpolate(c)}</option>`);
      });
      _push(`<!--]--></select></div><div><label for="pf-year" class="mb-1.5 block text-sm font-medium text-text">Tahun</label><input id="pf-year"${ssrRenderAttr("value", form.year)} type="text" class="input-field" placeholder="2025"></div><div><label class="mb-1.5 block text-sm font-medium text-text">Durasi</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.duration,
        "onUpdate:modelValue": ($event) => form.duration = $event,
        placeholder: "3 Bulan"
      }, null, _parent));
      _push(`</div><div><label class="mb-1.5 block text-sm font-medium text-text">Peran</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: form.role,
        "onUpdate:modelValue": ($event) => form.role = $event,
        placeholder: "Full-Stack Developer"
      }, null, _parent));
      _push(`</div><div class="lg:col-span-2 xl:col-span-2"><label for="pf-live" class="mb-1.5 block text-sm font-medium text-text">URL Live Demo</label><input id="pf-live"${ssrRenderAttr("value", form.liveUrl)} type="url" class="input-field" placeholder="https://..."></div><div class="lg:col-span-2 xl:col-span-2"><label for="pf-gh" class="mb-1.5 block text-sm font-medium text-text">URL GitHub</label><input id="pf-gh"${ssrRenderAttr("value", form.githubUrl)} type="url" class="input-field" placeholder="https://github.com/..."></div><div class="xl:col-span-2"><label for="pf-featured" class="mb-1.5 block text-sm font-medium text-text">Featured</label><button id="pf-featured" type="button" role="switch"${ssrRenderAttr("aria-checked", form.featured)} class="${ssrRenderClass([form.featured ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-bg text-text-secondary", "flex h-11 w-full items-center justify-between rounded-btn border px-4 text-sm font-medium transition-colors"])}">${ssrInterpolate(form.featured ? "Ya, featured" : "Tidak")} <span class="${ssrRenderClass([form.featured ? "bg-primary" : "bg-border", "relative inline-flex h-5 w-9 items-center rounded-full transition-colors"])}"><span class="${ssrRenderClass([form.featured ? "left-[18px]" : "left-1", "absolute h-3.5 w-3.5 rounded-full bg-white transition-all"])}"></span></span></button></div><div class="xl:col-span-2"><label for="pf-archived" class="mb-1.5 block text-sm font-medium text-text">Arsip</label><button id="pf-archived" type="button" role="switch"${ssrRenderAttr("aria-checked", form.archived)} class="${ssrRenderClass([form.archived ? "border-amber-400/50 bg-amber-400/10 text-amber-400" : "border-border bg-bg text-text-secondary", "flex h-11 w-full items-center justify-between rounded-btn border px-4 text-sm font-medium transition-colors"])}">${ssrInterpolate(form.archived ? "Ya, diarsipkan" : "Tidak")} <span class="${ssrRenderClass([form.archived ? "bg-amber-400" : "bg-border", "relative inline-flex h-5 w-9 items-center rounded-full transition-colors"])}"><span class="${ssrRenderClass([form.archived ? "left-[18px]" : "left-1", "absolute h-3.5 w-3.5 rounded-full bg-white transition-all"])}"></span></span></button></div></div></div><div id="pf-sec-demo" class="card scroll-mt-24 p-7"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div class="flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(MonitorPlay), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Demo Interaktif <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 3</span></h3><p class="mt-0.5 text-xs text-text-muted">Demo berjalan penuh di browser pengunjung (tanpa server tambahan). Aktifkan agar pengunjung bisa mencoba versi mini aplikasi langsung di halaman project.</p></div></div><button id="pf-demo-enabled" type="button" role="switch"${ssrRenderAttr("aria-checked", demo.enabled)} class="${ssrRenderClass([demo.enabled ? "border-success/60 bg-success/10 text-success" : "border-border bg-bg text-text-secondary", "flex h-11 items-center gap-2 rounded-btn border px-4 text-sm font-medium transition-colors"])}">${ssrInterpolate(demo.enabled ? "Aktif" : "Nonaktif")} <span class="${ssrRenderClass([demo.enabled ? "bg-success" : "bg-border", "relative inline-flex h-5 w-9 items-center rounded-full transition-colors"])}"><span class="${ssrRenderClass([demo.enabled ? "left-[18px]" : "left-1", "absolute h-3.5 w-3.5 rounded-full bg-white transition-all"])}"></span></span></button></div><div class="${ssrRenderClass([!demo.enabled ? "pointer-events-none opacity-40" : "", "grid gap-5 sm:grid-cols-2"])}"><div class="sm:col-span-2"><label for="pf-demo-type" class="mb-1.5 block text-sm font-medium text-text">Tipe Demo</label><select id="pf-demo-type" class="input-field"><!--[-->`);
      ssrRenderList(demoTypeOptions, (d) => {
        _push(`<option${ssrRenderAttr("value", d.value)}${ssrIncludeBooleanAttr(Array.isArray(demo.type) ? ssrLooseContain(demo.type, d.value) : ssrLooseEqual(demo.type, d.value)) ? " selected" : ""}>${ssrInterpolate(d.label)} \u2014 ${ssrInterpolate(d.desc)}</option>`);
      });
      _push(`<!--]--></select></div><div class="sm:col-span-2"><label class="mb-1.5 block text-sm font-medium text-text">Judul Demo (opsional)</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: demo.title,
        "onUpdate:modelValue": ($event) => demo.title = $event,
        placeholder: "Coba demo aplikasi ini"
      }, null, _parent));
      _push(`</div><div class="sm:col-span-2"><label class="mb-1.5 block text-sm font-medium text-text">Catatan / Keterangan (opsional)</label>`);
      _push(ssrRenderComponent(_component_LocaleInput, {
        modelValue: demo.note,
        "onUpdate:modelValue": ($event) => demo.note = $event,
        placeholder: "Demo berjalan penuh di browser Anda."
      }, null, _parent));
      _push(`</div>`);
      if (demo.type === "code" || demo.type === "studio") {
        _push(`<div class="sm:col-span-2"><div class="mb-3"><p class="text-sm font-medium text-text">File Kode</p>`);
        if (demo.type === "studio") {
          _push(`<p class="mt-0.5 text-xs text-text-muted">Upload project web Anda (index.html + CSS + JS). Pengunjung bisa menjelajah file &amp; melihat hasilnya berjalan langsung di Live Preview. Bahasa terdeteksi otomatis dari ekstensi file.</p>`);
        } else {
          _push(`<p class="mt-0.5 text-xs text-text-muted">Tampilkan potongan kode project dalam berbagai bahasa pemrograman. Bahasa terdeteksi otomatis dari ekstensi file.</p>`);
        }
        _push(`</div>`);
        if (demo.files.length) {
          _push(`<div class="overflow-hidden rounded-lg border border-border bg-bg"><div class="md:grid md:grid-cols-[230px_minmax(0,1fr)]"><div class="border-b border-border bg-card/50 md:border-b-0 md:border-r"><div class="flex items-center justify-between border-b border-border px-3 py-2.5"><p class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">`);
          _push(ssrRenderComponent(unref(FileCode2), {
            size: 12,
            "stroke-width": 2,
            "aria-hidden": "true"
          }, null, _parent));
          _push(` Explorer </p><span class="rounded-full bg-bg-alt px-1.5 py-0.5 text-[10px] font-bold text-text-muted">${ssrInterpolate(demo.files.length)} file</span></div><ul class="max-h-80 divide-y divide-border/40 overflow-y-auto"><!--[-->`);
          ssrRenderList(demo.files, (f, i) => {
            _push(`<li><div class="${ssrRenderClass([activeFileIndex.value === i ? "bg-primary/15 text-primary" : "text-text-secondary hover:bg-card hover:text-text", "group flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs transition-colors"])}">`);
            _push(ssrRenderComponent(unref(FileCode2), {
              size: 13,
              "stroke-width": 1.75,
              class: ["shrink-0", activeFileIndex.value === i ? "text-primary" : "text-text-muted"],
              "aria-hidden": "true"
            }, null, _parent));
            _push(`<span class="min-w-0 flex-1 truncate font-mono">${ssrInterpolate(f.name || `file-${i + 1}`)}</span><span class="hidden shrink-0 items-center gap-0.5 sm:flex"><button type="button" class="rounded p-1 text-text-muted transition-colors hover:bg-bg-alt hover:text-text disabled:opacity-30"${ssrIncludeBooleanAttr(i === 0) ? " disabled" : ""}${ssrRenderAttr("aria-label", `Naikkan file ${f.name || i + 1}`)} title="Pindah ke atas">`);
            _push(ssrRenderComponent(unref(ChevronUp), {
              size: 12,
              "stroke-width": 2
            }, null, _parent));
            _push(`</button><button type="button" class="rounded p-1 text-text-muted transition-colors hover:bg-bg-alt hover:text-text disabled:opacity-30"${ssrIncludeBooleanAttr(i === demo.files.length - 1) ? " disabled" : ""}${ssrRenderAttr("aria-label", `Turunkan file ${f.name || i + 1}`)} title="Pindah ke bawah">`);
            _push(ssrRenderComponent(unref(ChevronDown), {
              size: 12,
              "stroke-width": 2
            }, null, _parent));
            _push(`</button><button type="button" class="rounded p-1 text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"${ssrRenderAttr("aria-label", `Hapus file ${f.name || i + 1}`)} title="Hapus file">`);
            _push(ssrRenderComponent(unref(Trash2), {
              size: 12,
              "stroke-width": 1.75
            }, null, _parent));
            _push(`</button></span></div></li>`);
          });
          _push(`<!--]--></ul><div class="flex flex-col items-center gap-1 border-t border-border p-2.5"><button type="button" class="btn-outline w-full !py-2 text-xs">`);
          _push(ssrRenderComponent(unref(Plus), {
            size: 14,
            "stroke-width": 2
          }, null, _parent));
          _push(` Tambah File </button><span class="text-[9px] text-text-muted">Tambah file kode baru</span></div></div><div class="min-w-0"><div class="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5"><div class="min-w-0 flex-1"><label${ssrRenderAttr("for", `pf-demo-file-name-${activeFileIndex.value}`)} class="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Nama File</label><input${ssrRenderAttr("id", `pf-demo-file-name-${activeFileIndex.value}`)}${ssrRenderAttr("value", activeFile.value.name)} type="text" class="input-field w-full font-mono !py-2 !text-xs" placeholder="src/middleware/auth.ts"></div><div class="w-40"><label${ssrRenderAttr("for", `pf-demo-file-lang-${activeFileIndex.value}`)} class="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Bahasa</label><select${ssrRenderAttr("id", `pf-demo-file-lang-${activeFileIndex.value}`)} class="input-field w-full !py-2 !text-xs"><!--[-->`);
          ssrRenderList(unref(CODE_LANGS), (l) => {
            _push(`<option${ssrRenderAttr("value", l.id)}${ssrIncludeBooleanAttr(Array.isArray(activeFile.value.language) ? ssrLooseContain(activeFile.value.language, l.id) : ssrLooseEqual(activeFile.value.language, l.id)) ? " selected" : ""}>${ssrInterpolate(l.label)}</option>`);
          });
          _push(`<!--]--></select></div></div><textarea rows="10" spellcheck="false" class="block w-full resize-y px-4 py-3 font-mono !text-xs text-text placeholder:text-text-muted focus:outline-none" placeholder="Tulis kode di sini...">${ssrInterpolate(activeFile.value.content)}</textarea></div></div></div>`);
        } else {
          _push(`<p class="rounded-lg border border-dashed border-border px-4 py-8 text-center text-xs text-text-muted"> Belum ada file kode. Klik &quot;Tambah File&quot; untuk menambahkan. </p>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div id="pf-sec-content" class="card scroll-mt-24 p-7"><div class="mb-6 flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Tags), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Konten &amp; Tech <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 4</span></h3><p class="mt-0.5 text-xs text-text-muted">Label project dan teknologi yang dipakai.</p></div></div><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Tags (kategori / label project)</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah tag baru</span></div></div><ul class="space-y-2"><!--[-->`);
      ssrRenderList(form.tags, (tag, i) => {
        _push(`<li class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-2.5"><div class="min-w-0 flex-1">`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          modelValue: form.tags[i],
          "onUpdate:modelValue": ($event) => form.tags[i] = $event,
          placeholder: "Nama tag..."
        }, null, _parent));
        _push(`</div><button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10"${ssrRenderAttr("aria-label", `Hapus tag ${Number(i) + 1}`)}>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 14,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</button></li>`);
      });
      _push(`<!--]-->`);
      if (!form.tags.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada tag. Klik &quot;Tambah&quot; untuk menambahkan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div><div class="mt-6"><p class="mb-3 text-sm font-medium text-text">Tech Stack</p><div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"><!--[-->`);
      ssrRenderList(unref(techKeys), (key) => {
        _push(`<button type="button" class="${ssrRenderClass([form.tech.includes(key) ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-bg text-text-secondary hover:border-primary/40", "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"])}"><span class="flex h-6 w-6 items-center justify-center rounded bg-bg-alt text-[9px] font-bold" style="${ssrRenderStyle(`color: ${unref(techIcons)[key].color}`)}" aria-hidden="true">${ssrInterpolate(unref(techIcons)[key].glyph)}</span> ${ssrInterpolate(unref(techIcons)[key].name)}</button>`);
      });
      _push(`<!--]--></div></div></div><div id="pf-sec-detail" class="card scroll-mt-24 p-7"><div class="mb-6 flex flex-wrap items-center justify-between gap-4"><div class="flex items-center gap-4"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(ListChecks), {
        size: 20,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text"> Konten Detail Halaman <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 5</span></h3><p class="mt-0.5 text-xs text-text-muted">Konten tab Overview, Fitur, Teknologi, Proses, Tantangan, Hasil, dan Galeri pada halaman detail project.</p></div></div></div><div class="grid gap-5"><div><label class="mb-1.5 block text-sm font-medium text-text">Overview (paragraf dipisah baris kosong)</label>`);
      _push(ssrRenderComponent(_component_LocaleTextarea, {
        modelValue: detail.overview,
        "onUpdate:modelValue": ($event) => detail.overview = $event,
        rows: 5,
        placeholder: "Deskripsi panjang untuk tab Overview. Gunakan baris kosong untuk membuat paragraf baru."
      }, null, _parent));
      _push(`</div><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Feature Highlights (tab Overview)</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah highlight</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(detail.featureHighlights, (f, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Highlight ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3 sm:grid-cols-3"><div><label${ssrRenderAttr("for", `pf-fh-icon-${i}`)} class="mb-1 block text-xs font-medium text-text">Ikon</label><select${ssrRenderAttr("id", `pf-fh-icon-${i}`)} class="input-field !py-2"><!--[-->`);
        ssrRenderList(iconOptions, (ic) => {
          _push(`<option${ssrRenderAttr("value", ic)}${ssrIncludeBooleanAttr(Array.isArray(f.icon) ? ssrLooseContain(f.icon, ic) : ssrLooseEqual(f.icon, ic)) ? " selected" : ""}>${ssrInterpolate(ic)}</option>`);
        });
        _push(`<!--]--></select></div><div><label${ssrRenderAttr("for", `pf-fh-color-${i}`)} class="mb-1 block text-xs font-medium text-text">Warna</label><input${ssrRenderAttr("id", `pf-fh-color-${i}`)}${ssrRenderAttr("value", f.color)} type="color" class="h-11 w-full cursor-pointer rounded-btn border border-border bg-bg p-1"></div><div><label class="mb-1 block text-xs font-medium text-text">Judul</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-fh-title-${i}`,
          modelValue: f.title,
          "onUpdate:modelValue": ($event) => f.title = $event,
          placeholder: "Pencarian Cepat"
        }, null, _parent));
        _push(`</div><div class="sm:col-span-3"><label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-fh-desc-${i}`,
          modelValue: f.desc,
          "onUpdate:modelValue": ($event) => f.desc = $event,
          placeholder: "Deskripsi singkat fitur"
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!detail.featureHighlights.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada feature highlight. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><div class="mb-3 flex items-center justify-between"><p class="text-sm font-medium text-text">Main Features (tab Fitur)</p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah fitur</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(detail.mainFeatures, (f, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Fitur ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3 sm:grid-cols-3"><div><label${ssrRenderAttr("for", `pf-mf-icon-${i}`)} class="mb-1 block text-xs font-medium text-text">Ikon</label><select${ssrRenderAttr("id", `pf-mf-icon-${i}`)} class="input-field !py-2"><!--[-->`);
        ssrRenderList(iconOptions, (ic) => {
          _push(`<option${ssrRenderAttr("value", ic)}${ssrIncludeBooleanAttr(Array.isArray(f.icon) ? ssrLooseContain(f.icon, ic) : ssrLooseEqual(f.icon, ic)) ? " selected" : ""}>${ssrInterpolate(ic)}</option>`);
        });
        _push(`<!--]--></select></div><div><label${ssrRenderAttr("for", `pf-mf-color-${i}`)} class="mb-1 block text-xs font-medium text-text">Warna</label><input${ssrRenderAttr("id", `pf-mf-color-${i}`)}${ssrRenderAttr("value", f.color)} type="color" class="h-11 w-full cursor-pointer rounded-btn border border-border bg-bg p-1"></div><div><label class="mb-1 block text-xs font-medium text-text">Judul</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-mf-title-${i}`,
          modelValue: f.title,
          "onUpdate:modelValue": ($event) => f.title = $event,
          placeholder: "Dashboard Intuitif"
        }, null, _parent));
        _push(`</div><div class="sm:col-span-3"><label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-mf-desc-${i}`,
          modelValue: f.desc,
          "onUpdate:modelValue": ($event) => f.desc = $event,
          placeholder: "Deskripsi singkat fitur"
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!detail.mainFeatures.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada fitur utama. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><p class="mb-3 text-sm font-medium text-text">Tech Stack Detail (tab Teknologi)</p><div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"><!--[-->`);
      ssrRenderList(unref(techKeys), (key) => {
        _push(`<button type="button" class="${ssrRenderClass([detail.techStack.includes(key) ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-bg text-text-secondary hover:border-primary/40", "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"])}"><span class="flex h-6 w-6 items-center justify-center rounded bg-bg-alt text-[9px] font-bold" style="${ssrRenderStyle(`color: ${unref(techIcons)[key].color}`)}" aria-hidden="true">${ssrInterpolate(unref(techIcons)[key].glyph)}</span> ${ssrInterpolate(unref(techIcons)[key].name)}</button>`);
      });
      _push(`<!--]--></div></div><div><div class="mb-3 flex items-center justify-between"><p class="flex items-center gap-2 text-sm font-medium text-text">`);
      _push(ssrRenderComponent(unref(GitBranch), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Proses (tab Proses) </p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah langkah</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(detail.process, (p, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Langkah ${ssrInterpolate(p.num || i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3 sm:grid-cols-4"><div><label${ssrRenderAttr("for", `pf-pr-num-${i}`)} class="mb-1 block text-xs font-medium text-text">Nomor</label><input${ssrRenderAttr("id", `pf-pr-num-${i}`)}${ssrRenderAttr("value", p.num)} type="text" class="input-field !py-2" placeholder="01"></div><div><label${ssrRenderAttr("for", `pf-pr-icon-${i}`)} class="mb-1 block text-xs font-medium text-text">Ikon</label><select${ssrRenderAttr("id", `pf-pr-icon-${i}`)} class="input-field !py-2"><!--[-->`);
        ssrRenderList(iconOptions, (ic) => {
          _push(`<option${ssrRenderAttr("value", ic)}${ssrIncludeBooleanAttr(Array.isArray(p.icon) ? ssrLooseContain(p.icon, ic) : ssrLooseEqual(p.icon, ic)) ? " selected" : ""}>${ssrInterpolate(ic)}</option>`);
        });
        _push(`<!--]--></select></div><div class="sm:col-span-2"><label class="mb-1 block text-xs font-medium text-text">Judul</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-pr-title-${i}`,
          modelValue: p.title,
          "onUpdate:modelValue": ($event) => p.title = $event,
          placeholder: "Perencanaan"
        }, null, _parent));
        _push(`</div><div class="sm:col-span-4"><label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-pr-desc-${i}`,
          modelValue: p.desc,
          "onUpdate:modelValue": ($event) => p.desc = $event,
          placeholder: "Deskripsi langkah"
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!detail.process.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada langkah proses. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><div class="mb-3 flex items-center justify-between"><p class="flex items-center gap-2 text-sm font-medium text-text">`);
      _push(ssrRenderComponent(unref(Bug), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Tantangan (tab Tantangan) </p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah tantangan</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(detail.challenges, (c, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Tantangan ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3"><div><label class="mb-1 block text-xs font-medium text-text">Judul</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-ch-title-${i}`,
          modelValue: c.title,
          "onUpdate:modelValue": ($event) => c.title = $event,
          placeholder: "Sinkronisasi data real-time"
        }, null, _parent));
        _push(`</div><div><label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>`);
        _push(ssrRenderComponent(_component_LocaleTextarea, {
          id: `pf-ch-desc-${i}`,
          modelValue: c.desc,
          "onUpdate:modelValue": ($event) => c.desc = $event,
          rows: 2,
          placeholder: "Deskripsi tantangan dan solusinya..."
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!detail.challenges.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada tantangan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><div class="mb-3 flex items-center justify-between"><p class="flex items-center gap-2 text-sm font-medium text-text">`);
      _push(ssrRenderComponent(unref(BarChart3), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Hasil (tab Hasil) </p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah hasil</span></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(detail.results, (r, i) => {
        _push(`<div class="rounded-lg border border-border bg-bg p-4"><div class="mb-3 flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Hasil ${ssrInterpolate(i + 1)}</span><button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 12,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` Hapus </button></div><div class="grid gap-3 sm:grid-cols-3"><div><label${ssrRenderAttr("for", `pf-rs-icon-${i}`)} class="mb-1 block text-xs font-medium text-text">Ikon</label><select${ssrRenderAttr("id", `pf-rs-icon-${i}`)} class="input-field !py-2"><!--[-->`);
        ssrRenderList(iconOptions, (ic) => {
          _push(`<option${ssrRenderAttr("value", ic)}${ssrIncludeBooleanAttr(Array.isArray(r.icon) ? ssrLooseContain(r.icon, ic) : ssrLooseEqual(r.icon, ic)) ? " selected" : ""}>${ssrInterpolate(ic)}</option>`);
        });
        _push(`<!--]--></select></div><div><label class="mb-1 block text-xs font-medium text-text">Nilai</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-rs-value-${i}`,
          modelValue: r.value,
          "onUpdate:modelValue": ($event) => r.value = $event,
          placeholder: "500+"
        }, null, _parent));
        _push(`</div><div><label class="mb-1 block text-xs font-medium text-text">Label</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-rs-label-${i}`,
          modelValue: r.label,
          "onUpdate:modelValue": ($event) => r.label = $event,
          placeholder: "Pengguna Aktif"
        }, null, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]-->`);
      if (!detail.results.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted"> Belum ada hasil. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div><div class="mb-3 flex items-center justify-between"><p class="flex items-center gap-2 text-sm font-medium text-text">`);
      _push(ssrRenderComponent(unref(Images), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Galeri (tab Galeri) </p><div class="flex flex-col items-end gap-1"><button type="button" class="btn-outline !px-3 !py-2 text-xs">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tambah </button><span class="text-[9px] text-text-muted">Tambah item</span></div></div><p class="mb-3 text-xs text-text-muted">Upload gambar untuk ditampilkan di galeri project. Format: JPG, PNG, WEBP, atau AVIF (maks 10 MB).</p><div class="space-y-3"><!--[-->`);
      ssrRenderList(detail.gallery, (g, i) => {
        _push(`<div class="rounded-xl border border-border/60 bg-bg-alt/50 p-4 transition-all hover:border-primary/20"><div class="mb-3 flex items-start gap-4"><div class="group relative shrink-0"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="hidden"><div class="${ssrRenderClass([g.image ? "border-border" : "border-border/60 hover:border-primary/40", "flex h-24 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all"])}" role="button" tabindex="0"${ssrRenderAttr("aria-label", `Upload gambar galeri ${i + 1}`)}>`);
        if (g.image) {
          _push(`<img${ssrRenderAttr("src", g.image)}${ssrRenderAttr("alt", g.label.id || `Galeri ${i + 1}`)} class="h-full w-full object-cover">`);
        } else {
          _push(`<div class="flex flex-col items-center gap-1 text-text-muted">`);
          if (uploadingGallery.value === i) {
            _push(ssrRenderComponent(unref(LoaderCircle), {
              size: 18,
              class: "animate-spin text-primary"
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(ImagePlus), {
              size: 18,
              "stroke-width": 1.5
            }, null, _parent));
          }
          _push(`<span class="text-[10px] font-medium">${ssrInterpolate(uploadingGallery.value === i ? "Mengunggah..." : "Upload")}</span></div>`);
        }
        _push(`</div>`);
        if (g.image) {
          _push(`<button type="button" class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-transform hover:scale-110"${ssrRenderAttr("aria-label", `Hapus gambar galeri ${i + 1}`)}>`);
          _push(ssrRenderComponent(unref(X), {
            size: 10,
            "stroke-width": 2.5
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="min-w-0 flex-1"><div class="grid gap-3 sm:grid-cols-2"><div><label class="mb-1 block text-xs font-medium text-text-secondary">Label</label>`);
        _push(ssrRenderComponent(_component_LocaleInput, {
          id: `pf-gl-label-${i}`,
          modelValue: g.label,
          "onUpdate:modelValue": ($event) => g.label = $event,
          placeholder: "Label galeri"
        }, null, _parent));
        _push(`</div><div><label${ssrRenderAttr("for", `pf-gl-seed-${i}`)} class="mb-1 block text-xs font-medium text-text-secondary">Seed (warna fallback)</label><input${ssrRenderAttr("id", `pf-gl-seed-${i}`)}${ssrRenderAttr("value", g.seed)} type="number" class="input-field !py-2" placeholder="Seed"></div></div>`);
        if (!g.image) {
          _push(`<p class="mt-2 text-[10px] text-text-muted">Klik area gambar untuk upload. Tanpa gambar, akan menampilkan thumbnail gradient dari seed.</p>`);
        } else {
          _push(`<p class="mt-2 text-[10px] text-success">Gambar uploaded. Thumbnail gradient menjadi fallback.</p>`);
        }
        _push(`</div><button type="button" class="shrink-0 rounded-lg border border-transparent p-2 text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"${ssrRenderAttr("aria-label", `Hapus galeri ${i + 1}`)}>`);
        _push(ssrRenderComponent(unref(Trash2), {
          size: 14,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</button></div></div>`);
      });
      _push(`<!--]-->`);
      if (!detail.gallery.length) {
        _push(`<p class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">`);
        _push(ssrRenderComponent(unref(Images), {
          size: 28,
          "stroke-width": 1.5,
          class: "text-text-muted/40"
        }, null, _parent));
        _push(`<span class="text-sm text-text-muted">Belum ada item galeri</span><button type="button" class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">`);
        _push(ssrRenderComponent(unref(Plus), {
          size: 12,
          "stroke-width": 2
        }, null, _parent));
        _push(` Tambah Sekarang </button></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
      if (error.value) {
        _push(`<p class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="sticky bottom-4 z-20 rounded-card border border-border bg-card/95 p-4 shadow-card backdrop-blur lg:static lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none"><div class="flex flex-wrap items-center justify-end gap-6"><div class="flex flex-col items-center gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/projects",
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
      _push(` ${ssrInterpolate(saving.value ? "Menyimpan..." : "Simpan Project")}</button><span class="text-[9px] text-text-muted">Simpan perubahan ke file JSON</span></div></div></div></div></div></form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminProjectForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminProjectForm-BvLI39v6.mjs.map
