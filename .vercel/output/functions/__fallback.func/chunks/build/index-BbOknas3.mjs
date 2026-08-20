import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { FolderKanban, Plus, ArchiveRestore, Archive, ExternalLink, Star, Pencil, LoaderCircle, Trash2 } from 'lucide-vue-next';
import { a as lsId } from './localize-vezARIz8.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: projects, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-projects-list",
      () => useRequestFetch()("/api/admin/projects")
    )), __temp = await __temp, __restore(), __temp);
    const tab = ref("active");
    const busy = ref(null);
    const confirmDelete = ref(null);
    const demoBadges = {
      store: "Store",
      kanban: "Kanban",
      dashboard: "Dashboard",
      api: "API",
      todo: "Task",
      code: "Code",
      studio: "Studio"
    };
    function demoTypeOf(p) {
      const d = p.demo;
      if (!(d == null ? void 0 : d.enabled)) return null;
      return d.type && demoBadges[d.type] || d.type || null;
    }
    const activeProjects = computed(() => {
      var _a;
      return ((_a = projects.value) != null ? _a : []).filter((p) => !p.archived);
    });
    const archivedProjects = computed(() => {
      var _a;
      return ((_a = projects.value) != null ? _a : []).filter((p) => p.archived);
    });
    const currentProjects = computed(() => tab.value === "active" ? activeProjects.value : archivedProjects.value);
    const avatarGradients = [
      "from-violet-500 to-indigo-600",
      "from-cyan-500 to-blue-600",
      "from-emerald-500 to-lime-600",
      "from-amber-500 to-rose-600",
      "from-fuchsia-500 to-violet-600",
      "from-teal-500 to-emerald-600"
    ];
    function initialOf(title) {
      return lsId(title).trim().charAt(0).toUpperCase() || "?";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="card relative overflow-hidden p-7"><div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-5"><div class="flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(FolderKanban), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h2 class="text-lg font-extrabold tracking-tight text-text">Kelola Projects</h2><p class="mt-1 text-sm text-text-secondary">${ssrInterpolate((_b = (_a = unref(projects)) == null ? void 0 : _a.length) != null ? _b : 0)} project tersimpan di content/projects/. Arsipkan yang lama agar daftar tetap rapi.</p><div class="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-text-muted"><span class="rounded-full border border-border bg-card px-2.5 py-1">Aktif: ${ssrInterpolate(unref(activeProjects).length)}</span><span class="rounded-full border border-border bg-card px-2.5 py-1">Arsip: ${ssrInterpolate(unref(archivedProjects).length)}</span></div></div></div><div class="flex flex-col items-center gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/projects/new",
        class: "btn-primary !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), {
              size: 16,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` Tambah Project `);
          } else {
            return [
              createVNode(unref(Plus), {
                size: 16,
                "stroke-width": 2
              }),
              createTextVNode(" Tambah Project ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Buat project baru</span></div></div></div><div class="flex flex-wrap items-center justify-between gap-3"><div class="inline-flex items-center gap-1 rounded-btn border border-border bg-card p-1" role="tablist" aria-label="Filter project"><button type="button" role="tab" class="${ssrRenderClass([unref(tab) === "active" ? "bg-gradient-brand text-white shadow-btn-glow" : "text-text-muted hover:text-text", "inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors"])}">`);
      _push(ssrRenderComponent(unref(ArchiveRestore), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Aktif <span class="${ssrRenderClass([unref(tab) === "active" ? "bg-white/20 text-white" : "bg-bg-alt text-text-muted", "rounded-full px-1.5 py-0.5 text-[10px] font-bold"])}">${ssrInterpolate(unref(activeProjects).length)}</span></button><button type="button" role="tab" class="${ssrRenderClass([unref(tab) === "archived" ? "bg-gradient-brand text-white shadow-btn-glow" : "text-text-muted hover:text-text", "inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors"])}">`);
      _push(ssrRenderComponent(unref(Archive), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Arsip <span class="${ssrRenderClass([unref(tab) === "archived" ? "bg-white/20 text-white" : "bg-bg-alt text-text-muted", "rounded-full px-1.5 py-0.5 text-[10px] font-bold"])}">${ssrInterpolate(unref(archivedProjects).length)}</span></button></div><p class="text-xs text-text-muted">`);
      if (unref(tab) === "active") {
        _push(`<!--[-->Menampilkan ${ssrInterpolate(unref(activeProjects).length)} project aktif.<!--]-->`);
      } else {
        _push(`<!--[-->Menampilkan ${ssrInterpolate(unref(archivedProjects).length)} project di arsip.<!--]-->`);
      }
      _push(`</p></div><div class="card overflow-hidden p-0"><div class="hidden md:block"><div class="grid border-b border-border bg-card-alt/50 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted md:grid-cols-[minmax(0,1fr)_minmax(0,130px)_minmax(0,70px)_minmax(0,120px)_minmax(0,110px)_minmax(0,250px)] md:gap-6"><span>Project</span><span>Kategori</span><span>Tahun</span><span>Demo</span><span>Featured</span><span class="text-right">Aksi</span></div><ul class="divide-y divide-border/60"><!--[-->`);
      ssrRenderList(unref(currentProjects), (p, i) => {
        _push(`<li class="px-7 py-5 transition-colors hover:bg-card/40"><div class="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,130px)_minmax(0,70px)_minmax(0,120px)_minmax(0,110px)_minmax(0,250px)]"><div class="flex min-w-0 items-center gap-4"><span class="${ssrRenderClass([avatarGradients[i % avatarGradients.length], "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white"])}" aria-hidden="true">${ssrInterpolate(initialOf(p.title))}</span><div class="min-w-0"><p class="truncate text-sm font-semibold text-text">${ssrInterpolate(unref(lsId)(p.title))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/projects/${p.slug}`,
          target: "_blank",
          class: "mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-text-muted transition-colors hover:text-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` /projects/${ssrInterpolate(p.slug)} `);
              _push2(ssrRenderComponent(unref(ExternalLink), {
                size: 10,
                "stroke-width": 1.75
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" /projects/" + toDisplayString(p.slug) + " ", 1),
                createVNode(unref(ExternalLink), {
                  size: 10,
                  "stroke-width": 1.75
                })
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div><span class="truncate text-sm text-text-secondary">${ssrInterpolate(unref(lsId)(p.category))}</span><span class="text-sm text-text-secondary">${ssrInterpolate(p.year)}</span><span>`);
        if (demoTypeOf(p)) {
          _push(`<span class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"${ssrRenderAttr("title", "Demo: " + demoTypeOf(p))}> Demo \xB7 ${ssrInterpolate(demoTypeOf(p))}</span>`);
        } else {
          _push(`<span class="text-xs text-text-muted">\u2014</span>`);
        }
        _push(`</span><span>`);
        if (p.featured) {
          _push(`<span class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">`);
          _push(ssrRenderComponent(unref(Star), {
            size: 10,
            "stroke-width": 2,
            class: "fill-amber-400"
          }, null, _parent));
          _push(` Featured </span>`);
        } else {
          _push(`<span class="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-text-muted">Tidak</span>`);
        }
        _push(`</span><div class="flex items-center justify-end gap-5">`);
        if (unref(tab) === "active") {
          _push(`<!--[--><div class="flex flex-col items-center gap-1">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/projects/${p.slug}`,
            class: "btn-outline shrink-0 !px-4 !py-2 text-xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Pencil), {
                  size: 13,
                  "stroke-width": 1.75
                }, null, _parent2, _scopeId));
                _push2(` Edit `);
              } else {
                return [
                  createVNode(unref(Pencil), {
                    size: 13,
                    "stroke-width": 1.75
                  }),
                  createTextVNode(" Edit ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<span class="text-[9px] text-text-muted">Ubah isi &amp; pengaturan</span></div><div class="flex flex-col items-center gap-1"><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-amber-400/50 hover:text-amber-400"${ssrIncludeBooleanAttr(unref(busy) === p.slug) ? " disabled" : ""}>`);
          if (unref(busy) === p.slug) {
            _push(ssrRenderComponent(unref(LoaderCircle), {
              size: 13,
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Archive), {
              size: 13,
              "stroke-width": 1.75
            }, null, _parent));
          }
          _push(` Arsipkan </button><span class="text-[9px] text-text-muted">Pindah ke arsip</span></div><!--]-->`);
        } else {
          _push(`<!--[--><div class="flex flex-col items-center gap-1"><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-emerald-400/50 hover:text-emerald-400"${ssrIncludeBooleanAttr(unref(busy) === p.slug) ? " disabled" : ""}>`);
          if (unref(busy) === p.slug) {
            _push(ssrRenderComponent(unref(LoaderCircle), {
              size: 13,
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(ArchiveRestore), {
              size: 13,
              "stroke-width": 1.75
            }, null, _parent));
          }
          _push(` Pulihkan </button><span class="text-[9px] text-text-muted">Kembalikan ke aktif</span></div><div class="flex flex-col items-center gap-1"><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10">`);
          _push(ssrRenderComponent(unref(Trash2), {
            size: 13,
            "stroke-width": 1.75
          }, null, _parent));
          _push(` Hapus Permanen </button><span class="text-[9px] text-text-muted">Hapus selamanya</span></div><!--]-->`);
        }
        _push(`</div></div></li>`);
      });
      _push(`<!--]-->`);
      if (!unref(currentProjects).length) {
        _push(`<li class="px-7 py-12 text-center"><p class="text-sm font-medium text-text-secondary">`);
        if (unref(tab) === "active") {
          _push(`<!--[-->Belum ada project. Klik &quot;Tambah Project&quot; untuk mulai.<!--]-->`);
        } else {
          _push(`<!--[-->Tidak ada project yang diarsipkan.<!--]-->`);
        }
        _push(`</p></li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div><ul class="divide-y divide-border/60 md:hidden"><!--[-->`);
      ssrRenderList(unref(currentProjects), (p, i) => {
        _push(`<li class="p-4"><div class="flex items-start gap-3"><span class="${ssrRenderClass([avatarGradients[i % avatarGradients.length], "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white"])}" aria-hidden="true">${ssrInterpolate(initialOf(p.title))}</span><div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-2"><div class="min-w-0"><p class="truncate text-sm font-semibold text-text">${ssrInterpolate(unref(lsId)(p.title))}</p><p class="mt-0.5 truncate text-xs text-text-muted">${ssrInterpolate(unref(lsId)(p.category))} \u2022 ${ssrInterpolate(p.year)}</p></div><div class="flex shrink-0 items-center gap-1.5">`);
        if (demoTypeOf(p)) {
          _push(`<span class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"${ssrRenderAttr("title", "Demo: " + demoTypeOf(p))}> Demo \xB7 ${ssrInterpolate(demoTypeOf(p))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (p.featured) {
          _push(`<span class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">`);
          _push(ssrRenderComponent(unref(Star), {
            size: 10,
            "stroke-width": 2,
            class: "fill-amber-400"
          }, null, _parent));
          _push(` Featured </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/projects/${p.slug}`,
          target: "_blank",
          class: "mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-text-muted hover:text-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` /projects/${ssrInterpolate(p.slug)} `);
              _push2(ssrRenderComponent(unref(ExternalLink), {
                size: 10,
                "stroke-width": 1.75
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" /projects/" + toDisplayString(p.slug) + " ", 1),
                createVNode(unref(ExternalLink), {
                  size: 10,
                  "stroke-width": 1.75
                })
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<div class="mt-3 flex flex-wrap items-start gap-3">`);
        if (unref(tab) === "active") {
          _push(`<!--[--><div class="flex flex-col items-center gap-1">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/projects/${p.slug}`,
            class: "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-text"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Pencil), {
                  size: 13,
                  "stroke-width": 1.75
                }, null, _parent2, _scopeId));
                _push2(` Edit `);
              } else {
                return [
                  createVNode(unref(Pencil), {
                    size: 13,
                    "stroke-width": 1.75
                  }),
                  createTextVNode(" Edit ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<span class="text-[9px] text-text-muted">Ubah isi &amp; pengaturan</span></div><div class="flex flex-col items-center gap-1"><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-amber-400/50 hover:text-amber-400"${ssrIncludeBooleanAttr(unref(busy) === p.slug) ? " disabled" : ""}>`);
          if (unref(busy) === p.slug) {
            _push(ssrRenderComponent(unref(LoaderCircle), {
              size: 13,
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Archive), {
              size: 13,
              "stroke-width": 1.75
            }, null, _parent));
          }
          _push(` Arsipkan </button><span class="text-[9px] text-text-muted">Pindah ke arsip</span></div><!--]-->`);
        } else {
          _push(`<!--[--><div class="flex flex-col items-center gap-1"><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-emerald-400/50 hover:text-emerald-400"${ssrIncludeBooleanAttr(unref(busy) === p.slug) ? " disabled" : ""}>`);
          if (unref(busy) === p.slug) {
            _push(ssrRenderComponent(unref(LoaderCircle), {
              size: 13,
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(ArchiveRestore), {
              size: 13,
              "stroke-width": 1.75
            }, null, _parent));
          }
          _push(` Pulihkan </button><span class="text-[9px] text-text-muted">Kembalikan ke aktif</span></div><div class="flex flex-col items-center gap-1"><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10">`);
          _push(ssrRenderComponent(unref(Trash2), {
            size: 13,
            "stroke-width": 1.75
          }, null, _parent));
          _push(` Hapus </button><span class="text-[9px] text-text-muted">Hapus selamanya</span></div><!--]-->`);
        }
        _push(`</div></div></div></li>`);
      });
      _push(`<!--]-->`);
      if (!unref(currentProjects).length) {
        _push(`<li class="px-5 py-12 text-center"><p class="text-sm font-medium text-text-secondary">`);
        if (unref(tab) === "active") {
          _push(`<!--[-->Belum ada project. Klik &quot;Tambah Project&quot; untuk mulai.<!--]-->`);
        } else {
          _push(`<!--[-->Tidak ada project yang diarsipkan.<!--]-->`);
        }
        _push(`</p></li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div>`);
      if (unref(confirmDelete)) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus permanen"><div class="card w-full max-w-sm p-7"><h3 class="text-lg font-bold text-text">Hapus permanen project?</h3><p class="mt-2 text-sm text-text-secondary"> Project <strong class="text-text">${ssrInterpolate(unref(confirmDelete))}</strong> akan <strong class="text-red-400">dihapus permanen</strong> dari file konten dan tidak bisa dipulihkan. Lanjutkan? </p><div class="mt-6 flex justify-end gap-3"><button type="button" class="btn-outline !px-4 !py-2.5">Batal</button><button type="button" class="btn-primary !px-4 !py-2.5 !bg-red-600 !shadow-none"${ssrIncludeBooleanAttr(unref(busy) === unref(confirmDelete)) ? " disabled" : ""}>`);
        if (unref(busy) === unref(confirmDelete)) {
          _push(ssrRenderComponent(unref(LoaderCircle), {
            size: 15,
            class: "animate-spin"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Trash2), {
            size: 15,
            "stroke-width": 2
          }, null, _parent));
        }
        _push(` Ya, Hapus </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BbOknas3.mjs.map
