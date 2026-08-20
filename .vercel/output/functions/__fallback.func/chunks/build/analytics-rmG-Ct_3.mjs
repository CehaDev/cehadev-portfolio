import { _ as _sfc_main$2 } from './CountUp-2uvjSD__.mjs';
import { _ as _sfc_main$2$1, a as _sfc_main$1$1, b as _sfc_main$3 } from './EmptyState-BNFJKZ3p.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderVNode, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { Eye, Users, MousePointerClick, Activity, TrendingUp, TrendingDown, Globe, FolderKanban, MonitorSmartphone } from 'lucide-vue-next';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
import { d as useProjectsContent } from './useContentData-B9bxi5bI.mjs';
import 'perfect-debounce';
import './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DonutChart",
  __ssrInlineRender: true,
  props: {
    items: {},
    size: {},
    thickness: {},
    centerLabel: {}
  },
  setup(__props) {
    var _a, _b;
    const props = __props;
    const palette = ["#8B5CF6", "#3B82F6", "#22C55E", "#F59E0B", "#EC4899", "#38BDF8", "#F43F5E", "#A3E635"];
    const size = (_a = props.size) != null ? _a : 170;
    const thickness = (_b = props.thickness) != null ? _b : 20;
    const r = (size - thickness) / 2;
    const C = 2 * Math.PI * r;
    const total = computed(() => props.items.reduce((acc, i) => acc + i.value, 0));
    const segments = computed(() => {
      let offset = 0;
      return props.items.map((item, i) => {
        const len = total.value > 0 ? item.value / total.value * C : 0;
        const seg = { color: palette[i % palette.length], len, offset, label: item.label, value: item.value };
        offset += len;
        return seg;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center gap-5 sm:flex-row sm:justify-center" }, _attrs))}><div class="relative shrink-0" style="${ssrRenderStyle({ width: unref(size) + "px", height: unref(size) + "px" })}"><svg${ssrRenderAttr("width", unref(size))}${ssrRenderAttr("height", unref(size))} class="block"><g${ssrRenderAttr("transform", "rotate(-90 " + unref(size) / 2 + " " + unref(size) / 2 + ")")}><circle${ssrRenderAttr("cx", unref(size) / 2)}${ssrRenderAttr("cy", unref(size) / 2)}${ssrRenderAttr("r", r)} fill="none" stroke="currentColor" class="text-bg-alt"${ssrRenderAttr("stroke-width", unref(thickness))}></circle><!--[-->`);
      ssrRenderList(unref(segments), (seg) => {
        _push(`<circle${ssrRenderAttr("cx", unref(size) / 2)}${ssrRenderAttr("cy", unref(size) / 2)}${ssrRenderAttr("r", r)} fill="none"${ssrRenderAttr("stroke", seg.color)}${ssrRenderAttr("stroke-width", unref(thickness))}${ssrRenderAttr("stroke-dasharray", seg.len + " " + (C - seg.len))}${ssrRenderAttr("stroke-dashoffset", String(-seg.offset))} stroke-linecap="butt" class="transition-all duration-700"></circle>`);
      });
      _push(`<!--]--></g></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><p class="text-2xl font-extrabold text-text">${ssrInterpolate(unref(total).toLocaleString("id-ID"))}</p><p class="text-[10px] font-medium uppercase tracking-wider text-text-muted">${ssrInterpolate((_a2 = __props.centerLabel) != null ? _a2 : "Total")}</p></div></div><ul class="min-w-[180px] space-y-2"><!--[-->`);
      ssrRenderList(unref(segments), (seg) => {
        _push(`<li class="flex items-center justify-between gap-3"><span class="flex items-center gap-2 text-xs font-medium text-text-secondary"><span class="h-2.5 w-2.5 rounded-[4px]" style="${ssrRenderStyle({ backgroundColor: seg.color })}" aria-hidden="true"></span> ${ssrInterpolate(seg.label)}</span><span class="text-xs font-bold text-text">${ssrInterpolate(seg.value.toLocaleString("id-ID"))}</span></li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/charts/DonutChart.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analytics",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: analytics } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-analytics",
      () => useRequestFetch()("/api/admin/analytics/overview")
    )), __temp = await __temp, __restore(), __temp);
    const { data: projects } = ([__temp, __restore] = withAsyncContext(() => useProjectsContent()), __temp = await __temp, __restore(), __temp);
    const range = ref(14);
    const ranges = [
      { days: 7, label: "7 Hari" },
      { days: 14, label: "14 Hari" },
      { days: 30, label: "30 Hari" }
    ];
    const daily = computed(() => {
      var _a, _b;
      return ((_b = (_a = analytics.value) == null ? void 0 : _a.daily) != null ? _b : []).slice(-range.value);
    });
    const chartLabels = computed(() => daily.value.map((d) => d.date));
    const chartViews = computed(() => daily.value.map((d) => d.views));
    const chartVisitors = computed(() => daily.value.map((d) => d.visitors));
    const avgPerDay = computed(() => {
      const n = daily.value.length;
      if (!n) return 0;
      return Math.round(daily.value.reduce((a, d) => a + d.views, 0) / n);
    });
    const totalViews = computed(() => {
      var _a, _b;
      return (_b = (_a = analytics.value) == null ? void 0 : _a.total.views) != null ? _b : 0;
    });
    const totalVisitors = computed(() => {
      var _a, _b;
      return (_b = (_a = analytics.value) == null ? void 0 : _a.total.visitors) != null ? _b : 0;
    });
    const todayViews = computed(() => {
      var _a, _b;
      return (_b = (_a = analytics.value) == null ? void 0 : _a.total.todayViews) != null ? _b : 0;
    });
    const todayVisitors = computed(() => {
      var _a, _b;
      return (_b = (_a = analytics.value) == null ? void 0 : _a.total.todayVisitors) != null ? _b : 0;
    });
    const prevHalf = computed(() => {
      const slice = daily.value;
      if (slice.length < 2) return 0;
      const mid = Math.floor(slice.length / 2);
      const a = slice.slice(0, mid).reduce((s, d) => s + d.views, 0);
      const b = slice.slice(mid).reduce((s, d) => s + d.views, 0);
      if (a === 0) return b > 0 ? 100 : 0;
      return Math.round((b - a) / a * 100);
    });
    const projectTitles = computed(() => {
      var _a;
      const map = /* @__PURE__ */ new Map();
      for (const p of (_a = projects.value) != null ? _a : []) map.set(p.slug, p.title);
      return map;
    });
    const projectItems = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = analytics.value) == null ? void 0 : _a.topProjects) != null ? _b : []).map((p) => {
          var _a2;
          return {
            label: (_a2 = projectTitles.value.get(p.slug)) != null ? _a2 : p.slug,
            value: p.views,
            hint: p.slug
          };
        });
      }
    );
    const statCards = computed(() => [
      { label: "Total Kunjungan", value: totalViews.value, icon: Eye, color: "#8B5CF6" },
      { label: "Total Pengunjung", value: totalVisitors.value, icon: Users, color: "#3B82F6" },
      { label: "Kunjungan Hari Ini", value: todayViews.value, icon: MousePointerClick, color: "#22C55E" },
      { label: "Pengunjung Hari Ini", value: todayVisitors.value, icon: Users, color: "#F59E0B" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_CountUp = _sfc_main$2;
      const _component_AreaChart = _sfc_main$2$1;
      const _component_BarList = _sfc_main$1$1;
      const _component_EmptyState = _sfc_main$3;
      const _component_DonutChart = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(statCards), (s) => {
        _push(`<div class="card relative overflow-hidden p-6"><span class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15" style="${ssrRenderStyle({ backgroundColor: s.color })}" aria-hidden="true"></span><span class="flex h-11 w-11 items-center justify-center rounded-xl" style="${ssrRenderStyle({ backgroundColor: s.color + "22", color: s.color })}" aria-hidden="true">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(s.icon), {
          size: 20,
          "stroke-width": 1.5
        }, null), _parent);
        _push(`</span><p class="mt-4 text-3xl font-extrabold text-text">`);
        _push(ssrRenderComponent(_component_CountUp, {
          end: s.value
        }, null, _parent));
        _push(`</p><p class="mt-1 text-sm font-medium text-text-secondary">${ssrInterpolate(s.label)}</p></div>`);
      });
      _push(`<!--]--></div><div class="card p-7"><div class="flex flex-wrap items-center justify-between gap-4"><div><h3 class="flex items-center gap-2 text-base font-bold text-text">`);
      _push(ssrRenderComponent(unref(Activity), {
        size: 18,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Kunjungan Website </h3><p class="mt-1 text-xs text-text-muted">Rata-rata ${ssrInterpolate(unref(avgPerDay))} kunjungan/hari</p></div><div class="flex items-center gap-1 rounded-xl border border-border bg-card p-1"><!--[-->`);
      ssrRenderList(ranges, (r) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(range) === r.days ? "bg-gradient-brand text-white shadow-btn-glow" : "text-text-secondary hover:text-text", "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors"])}">${ssrInterpolate(r.label)}</button>`);
      });
      _push(`<!--]--></div></div><div class="mt-6 flex flex-wrap items-center gap-4 text-xs text-text-secondary"><span class="flex items-center gap-2"><span class="h-0.5 w-5 rounded-full bg-[#8B5CF6]" aria-hidden="true"></span> Kunjungan </span><span class="flex items-center gap-2"><span class="h-0 w-5 border-t-2 border-dashed border-[#38BDF8]" aria-hidden="true"></span> Pengunjung </span><span class="${ssrRenderClass([unref(prevHalf) >= 0 ? "border border-success/30 bg-success/10 text-success" : "border border-red-500/30 bg-red-500/10 text-red-400", "ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"])}">`);
      if (unref(prevHalf) >= 0) {
        _push(ssrRenderComponent(unref(TrendingUp), {
          size: 12,
          "stroke-width": 2
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(TrendingDown), {
          size: 12,
          "stroke-width": 2
        }, null, _parent));
      }
      _push(` ${ssrInterpolate(Math.abs(unref(prevHalf)))}% dibanding paruh pertama </span></div><div class="mt-5">`);
      _push(ssrRenderComponent(_component_AreaChart, {
        labels: unref(chartLabels),
        values: unref(chartViews),
        secondary: unref(chartVisitors)
      }, null, _parent));
      _push(`</div></div><div class="grid gap-6 lg:grid-cols-2"><div class="card p-7"><h3 class="flex items-center gap-2 text-base font-bold text-text">`);
      _push(ssrRenderComponent(unref(Globe), {
        size: 18,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Halaman Terpopuler </h3><div class="mt-5">`);
      if (((_b = (_a = unref(analytics)) == null ? void 0 : _a.topPages) != null ? _b : []).length) {
        _push(ssrRenderComponent(_component_BarList, {
          items: unref(analytics).topPages.map((p) => ({ label: p.path, value: p.views }))
        }, null, _parent));
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
      _push(`</div></div></div><div class="grid gap-6 lg:grid-cols-2"><div class="card p-7"><h3 class="flex items-center gap-2 text-base font-bold text-text">`);
      _push(ssrRenderComponent(unref(MonitorSmartphone), {
        size: 18,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Perangkat Pengunjung </h3><div class="mt-6">`);
      if (((_d = (_c = unref(analytics)) == null ? void 0 : _c.devices) != null ? _d : []).length) {
        _push(ssrRenderComponent(_component_DonutChart, {
          items: unref(analytics).devices,
          "center-label": "Kunjungan"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Belum ada data",
          desc: "Data perangkat akan muncul setelah ada kunjungan."
        }, null, _parent));
      }
      _push(`</div></div><div class="card p-7"><h3 class="flex items-center gap-2 text-base font-bold text-text">`);
      _push(ssrRenderComponent(unref(MonitorSmartphone), {
        size: 18,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Browser Pengunjung </h3><div class="mt-5">`);
      if (((_f = (_e = unref(analytics)) == null ? void 0 : _e.browsers) != null ? _f : []).length) {
        _push(ssrRenderComponent(_component_BarList, {
          items: unref(analytics).browsers.map((b) => ({ label: b.label, value: b.value })),
          color: "#22C55E"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Belum ada data",
          desc: "Data browser akan muncul setelah ada kunjungan."
        }, null, _parent));
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/analytics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=analytics-rmG-Ct_3.mjs.map
