import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$1 } from './CountUp-2uvjSD__.mjs';
import { _ as _sfc_main$2, a as _sfc_main$1$1, b as _sfc_main$3 } from './EmptyState-BNFJKZ3p.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Eye, Users, Activity, Mail, Sparkles, Play, FileText, Plus, ArrowRight, Globe, FolderKanban, Layers, Star } from 'lucide-vue-next';
import { a as lsId } from './localize-vezARIz8.mjs';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
import { d as useProjectsContent } from './useContentData-B9bxi5bI.mjs';
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
    const { data: analytics } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-dash-analytics",
      () => useRequestFetch()("/api/admin/analytics/overview")
    )), __temp = await __temp, __restore(), __temp);
    const { data: projects, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-projects",
      () => useRequestFetch()("/api/admin/projects")
    )), __temp = await __temp, __restore(), __temp);
    const { data: messages } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-dash-messages",
      () => useRequestFetch()("/api/admin/messages")
    )), __temp = await __temp, __restore(), __temp);
    const { data: projectTitles } = ([__temp, __restore] = withAsyncContext(() => useProjectsContent()), __temp = await __temp, __restore(), __temp);
    const unreadMessages = computed(() => {
      var _a, _b;
      return (_b = (_a = messages.value) == null ? void 0 : _a.filter((m) => !m.read)) != null ? _b : [];
    });
    const recentMessages = computed(() => {
      var _a;
      return ((_a = messages.value) != null ? _a : []).slice(0, 4);
    });
    function messageTime(at) {
      const d = new Date(at);
      const today = /* @__PURE__ */ new Date();
      return d.toDateString() === today.toDateString() ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    }
    const stats = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      return [
        {
          label: "Total Kunjungan",
          value: (_b = (_a = analytics.value) == null ? void 0 : _a.total.views) != null ? _b : 0,
          icon: Eye,
          color: "#8B5CF6",
          spark: ((_d = (_c = analytics.value) == null ? void 0 : _c.daily) != null ? _d : []).slice(-14).map((d) => d.views)
        },
        {
          label: "Total Pengunjung",
          value: (_f = (_e = analytics.value) == null ? void 0 : _e.total.visitors) != null ? _f : 0,
          icon: Users,
          color: "#3B82F6",
          spark: ((_h = (_g = analytics.value) == null ? void 0 : _g.daily) != null ? _h : []).slice(-14).map((d) => d.visitors)
        },
        {
          label: "Kunjungan Hari Ini",
          value: (_j = (_i = analytics.value) == null ? void 0 : _i.total.todayViews) != null ? _j : 0,
          icon: Activity,
          color: "#22C55E",
          spark: ((_l = (_k = analytics.value) == null ? void 0 : _k.daily) != null ? _l : []).slice(-7).map((d) => d.views)
        },
        {
          label: "Pesan Belum Dibaca",
          value: unreadMessages.value.length,
          icon: Mail,
          color: "#F59E0B",
          spark: []
        }
      ];
    });
    const chartLabels = computed(() => {
      var _a, _b;
      return ((_b = (_a = analytics.value) == null ? void 0 : _a.daily) != null ? _b : []).slice(-14).map((d) => d.date);
    });
    const chartViews = computed(() => {
      var _a, _b;
      return ((_b = (_a = analytics.value) == null ? void 0 : _a.daily) != null ? _b : []).slice(-14).map((d) => d.views);
    });
    const chartVisitors = computed(() => {
      var _a, _b;
      return ((_b = (_a = analytics.value) == null ? void 0 : _a.daily) != null ? _b : []).slice(-14).map((d) => d.visitors);
    });
    const titleMap = computed(() => {
      var _a;
      const map = /* @__PURE__ */ new Map();
      for (const p of (_a = projectTitles.value) != null ? _a : []) map.set(p.slug, p.title);
      return map;
    });
    const projectItems = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = analytics.value) == null ? void 0 : _a.topProjects) != null ? _b : []).slice(0, 6).map((p) => {
          var _a2;
          return {
            label: (_a2 = titleMap.value.get(p.slug)) != null ? _a2 : p.slug,
            value: p.views,
            hint: p.slug
          };
        });
      }
    );
    const topPageItems = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = analytics.value) == null ? void 0 : _a.topPages) != null ? _b : []).slice(0, 6).map((p) => ({ label: p.path, value: p.views }));
      }
    );
    const latest = computed(() => {
      var _a;
      return [...(_a = projects.value) != null ? _a : []].sort((a, b) => String(b.year).localeCompare(String(a.year))).slice(0, 5);
    });
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
    const avatarGradients = [
      "from-violet-500 to-indigo-600",
      "from-cyan-500 to-blue-600",
      "from-emerald-500 to-lime-600",
      "from-amber-500 to-rose-500",
      "from-fuchsia-500 to-violet-600",
      "from-teal-500 to-emerald-600"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CountUp = _sfc_main$1;
      const _component_AreaChart = _sfc_main$2;
      const _component_BarList = _sfc_main$1$1;
      const _component_EmptyState = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="card relative overflow-hidden p-8"><div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-blue/10 blur-3xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-6"><div class="min-w-0"><span class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">`);
      _push(ssrRenderComponent(unref(Sparkles), {
        size: 12,
        "stroke-width": 2,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Admin Panel </span><h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text">Selamat datang kembali \u{1F44B}</h2><p class="mt-1.5 text-sm text-text-secondary">Pantau performa website, kelola project, dan balas pesan \u2014 semua dari sini.</p></div><div class="flex flex-wrap items-end gap-5"><div class="flex flex-col items-center gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/demos",
        class: "btn-outline !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Play), {
              size: 16,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` Lihat Demo `);
          } else {
            return [
              createVNode(unref(Play), {
                size: 16,
                "stroke-width": 2
              }),
              createTextVNode(" Lihat Demo ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Live preview project</span></div><div class="flex flex-col items-center gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/cv",
        class: "btn-outline !py-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(FileText), {
              size: 16,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
            _push2(` Kelola CV `);
          } else {
            return [
              createVNode(unref(FileText), {
                size: 16,
                "stroke-width": 2
              }),
              createTextVNode(" Kelola CV ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Perbarui CV &amp; unduh</span></div><div class="flex flex-col items-center gap-1">`);
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
      _push(`<span class="text-[10px] text-text-muted">Buat project baru</span></div></div></div></div><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(stats), (s) => {
        _push(`<div class="card relative overflow-hidden p-6"><span class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15" style="${ssrRenderStyle({ backgroundColor: s.color })}" aria-hidden="true"></span><div class="flex items-start justify-between"><span class="flex h-11 w-11 items-center justify-center rounded-xl" style="${ssrRenderStyle({ backgroundColor: s.color + "22", color: s.color })}" aria-hidden="true">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(s.icon), {
          size: 20,
          "stroke-width": 1.5
        }, null), _parent);
        _push(`</span>`);
        if (s.spark.length) {
          _push(`<span class="flex h-8 items-end gap-[2px]" aria-hidden="true"><!--[-->`);
          ssrRenderList(s.spark, (v, i) => {
            _push(`<span class="w-[3px] rounded-sm transition-all" style="${ssrRenderStyle({
              height: `${Math.max(v / Math.max(...s.spark, 1) * 100, 6)}%`,
              backgroundColor: s.color + (i === s.spark.length - 1 ? "" : "55")
            })}"></span>`);
          });
          _push(`<!--]--></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="mt-4 text-3xl font-extrabold text-text">`);
        _push(ssrRenderComponent(_component_CountUp, {
          end: s.value
        }, null, _parent));
        _push(`</p><p class="mt-1 text-sm font-medium text-text-secondary">${ssrInterpolate(s.label)}</p></div>`);
      });
      _push(`<!--]--></div><div class="card p-7"><div class="flex flex-wrap items-center justify-between gap-3"><div><h3 class="flex items-center gap-2 text-base font-bold text-text">`);
      _push(ssrRenderComponent(unref(Activity), {
        size: 18,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Kunjungan 14 Hari Terakhir </h3><p class="mt-1 text-xs text-text-muted">Garis solid = kunjungan, garis putus-putus = pengunjung unik</p></div><div class="flex flex-col items-end gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/analytics",
        class: "inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Analytics Lengkap `);
            _push2(ssrRenderComponent(unref(ArrowRight), {
              size: 15,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Analytics Lengkap "),
              createVNode(unref(ArrowRight), {
                size: 15,
                "stroke-width": 2
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Detail grafik &amp; metrik kunjungan</span></div></div><div class="mt-5">`);
      _push(ssrRenderComponent(_component_AreaChart, {
        labels: unref(chartLabels),
        values: unref(chartViews),
        secondary: unref(chartVisitors),
        height: 230
      }, null, _parent));
      _push(`</div></div><div class="grid gap-6 lg:grid-cols-2"><div class="card p-7"><h3 class="flex items-center gap-2 text-base font-bold text-text">`);
      _push(ssrRenderComponent(unref(Globe), {
        size: 18,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Halaman Terpopuler </h3><div class="mt-5">`);
      if (unref(topPageItems).length) {
        _push(ssrRenderComponent(_component_BarList, { items: unref(topPageItems) }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Belum ada kunjungan",
          desc: "Kunjungan ke website akan tercatat di sini."
        }, null, _parent));
      }
      _push(`</div></div><div class="card p-7"><h3 class="flex items-center gap-2 text-base font-bold text-text">`);
      _push(ssrRenderComponent(unref(FolderKanban), {
        size: 18,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Kunjungan per Project </h3><div class="mt-5">`);
      if (unref(projectItems).length) {
        _push(ssrRenderComponent(_component_BarList, {
          items: unref(projectItems),
          color: "#3B82F6"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Belum ada data",
          desc: "Kunjungan ke halaman project akan muncul di sini."
        }, null, _parent));
      }
      _push(`</div></div></div><div class="card overflow-hidden p-0"><div class="relative overflow-hidden border-b border-border px-7 py-6"><div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true"></div><div class="relative flex flex-wrap items-center justify-between gap-5"><div class="flex items-start gap-4"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Layers), {
        size: 22,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex items-center gap-2 text-base font-bold text-text"> Project Terbaru <span class="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-text-muted">${ssrInterpolate(unref(latest).length)}</span></h3><p class="mt-1 text-xs text-text-muted">Tambah, ubah, dan pantau project terbaru Anda dari satu tempat.</p></div></div><div class="flex flex-col items-end gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/projects",
        class: "inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Lihat Semua `);
            _push2(ssrRenderComponent(unref(ArrowRight), {
              size: 15,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Lihat Semua "),
              createVNode(unref(ArrowRight), {
                size: 15,
                "stroke-width": 2
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Kelola seluruh project</span></div></div></div><div class="hidden border-b border-border bg-card-alt/50 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_minmax(0,180px)] md:gap-6"><span>Project</span><span>Detail</span><span class="text-right">Aksi</span></div><ul class="divide-y divide-border/60"><!--[-->`);
      ssrRenderList(unref(latest), (p, i) => {
        _push(`<li class="px-7 py-5 transition-colors hover:bg-card/40"><div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_minmax(0,180px)] md:items-center md:gap-6"><div class="flex min-w-0 items-center gap-4"><span class="${ssrRenderClass([avatarGradients[i % avatarGradients.length], "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white"])}" aria-hidden="true">${ssrInterpolate(unref(lsId)(p.title).trim().charAt(0).toUpperCase())}</span><div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><p class="truncate text-sm font-semibold text-text">${ssrInterpolate(unref(lsId)(p.title))}</p>`);
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
        _push(`</div><p class="mt-1 truncate text-xs text-text-muted">${ssrInterpolate(unref(lsId)(p.category))} \u2022 ${ssrInterpolate(p.year)}</p></div></div><div class="flex min-w-0 flex-wrap items-center gap-2 md:flex-col md:items-start md:gap-1.5"><code class="truncate rounded-md border border-border bg-bg px-2 py-1 font-mono text-[10px] text-text-muted">${ssrInterpolate(p.slug)}</code>`);
        if (demoTypeOf(p)) {
          _push(`<span class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"> Demo \xB7 ${ssrInterpolate(demoTypeOf(p))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center justify-start gap-5 md:justify-end"><div class="flex flex-col items-center gap-1">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/projects/${p.slug}`,
          class: "btn-outline shrink-0 !px-4 !py-2 text-xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Edit`);
            } else {
              return [
                createTextVNode("Edit")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span class="text-[9px] text-text-muted">Ubah isi &amp; pengaturan</span></div><div class="flex flex-col items-center gap-1">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/projects/${p.slug}`,
          target: "_blank",
          class: "btn-outline shrink-0 !px-4 !py-2 text-xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Eye), {
                size: 13,
                "stroke-width": 1.75
              }, null, _parent2, _scopeId));
              _push2(` Lihat `);
            } else {
              return [
                createVNode(unref(Eye), {
                  size: 13,
                  "stroke-width": 1.75
                }),
                createTextVNode(" Lihat ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span class="text-[9px] text-text-muted">Buka halaman publik</span></div></div></div></li>`);
      });
      _push(`<!--]-->`);
      if (!unref(latest).length) {
        _push(`<li class="px-7 py-10 text-center text-sm text-text-muted"> Belum ada project. Tambahkan project pertama Anda. </li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div><div class="card p-7"><div class="flex flex-wrap items-start justify-between gap-5"><div class="flex items-start gap-3"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Mail), {
        size: 18,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</span><div><h3 class="flex items-center gap-2 text-base font-bold text-text"> Pesan Masuk `);
      if (unref(unreadMessages).length > 0) {
        _push(`<span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white" aria-hidden="true">${ssrInterpolate(unref(unreadMessages).length > 9 ? "9+" : unref(unreadMessages).length)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</h3><p class="mt-1 text-xs text-text-muted">Pesan dari pengunjung via form kontak.</p></div></div><div class="flex flex-col items-end gap-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/messages",
        class: "inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Buka Inbox `);
            _push2(ssrRenderComponent(unref(ArrowRight), {
              size: 15,
              "stroke-width": 2
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Buka Inbox "),
              createVNode(unref(ArrowRight), {
                size: 15,
                "stroke-width": 2
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-[10px] text-text-muted">Balas &amp; kelola pesan</span></div></div>`);
      if (unref(recentMessages).length) {
        _push(`<ul class="mt-5 divide-y divide-border/60"><!--[-->`);
        ssrRenderList(unref(recentMessages), (m) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/messages`,
            class: "flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-card"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex min-w-0 items-center gap-3"${_scopeId}><span class="${ssrRenderClass([m.read ? "bg-bg-alt text-text-muted" : "bg-primary/15 text-primary", "flex h-9 w-9 shrink-0 items-center justify-center rounded-full"])}" aria-hidden="true"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Mail), {
                  size: 15,
                  "stroke-width": 1.5
                }, null, _parent2, _scopeId));
                _push2(`</span><div class="min-w-0"${_scopeId}><p class="truncate text-sm font-semibold text-text"${_scopeId}>`);
                if (!m.read) {
                  _push2(`<span class="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" aria-hidden="true"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(m.subject)}</p><p class="mt-0.5 truncate text-xs text-text-muted"${_scopeId}>${ssrInterpolate(m.name)} \u2014 ${ssrInterpolate(m.email)}</p></div></div><span class="shrink-0 text-[10px] text-text-muted"${_scopeId}>${ssrInterpolate(messageTime(m.at))}</span>`);
              } else {
                return [
                  createVNode("div", { class: "flex min-w-0 items-center gap-3" }, [
                    createVNode("span", {
                      class: ["flex h-9 w-9 shrink-0 items-center justify-center rounded-full", m.read ? "bg-bg-alt text-text-muted" : "bg-primary/15 text-primary"],
                      "aria-hidden": "true"
                    }, [
                      createVNode(unref(Mail), {
                        size: 15,
                        "stroke-width": 1.5
                      })
                    ], 2),
                    createVNode("div", { class: "min-w-0" }, [
                      createVNode("p", { class: "truncate text-sm font-semibold text-text" }, [
                        !m.read ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500 align-middle",
                          "aria-hidden": "true"
                        })) : createCommentVNode("", true),
                        createTextVNode(" " + toDisplayString(m.subject), 1)
                      ]),
                      createVNode("p", { class: "mt-0.5 truncate text-xs text-text-muted" }, toDisplayString(m.name) + " \u2014 " + toDisplayString(m.email), 1)
                    ])
                  ]),
                  createVNode("span", { class: "shrink-0 text-[10px] text-text-muted" }, toDisplayString(messageTime(m.at)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Belum ada pesan masuk",
          desc: "Pesan dari form kontak akan muncul di sini."
        }, null, _parent));
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CYUwQSzL.mjs.map
