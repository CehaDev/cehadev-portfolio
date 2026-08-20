import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { Inbox } from 'lucide-vue-next';

const PAD_X = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AreaChart",
  __ssrInlineRender: true,
  props: {
    labels: {},
    values: {},
    secondary: {},
    height: {},
    color: {},
    secondaryColor: {}
  },
  setup(__props) {
    var _a, _b, _c;
    const props = __props;
    const color = (_a = props.color) != null ? _a : "#8B5CF6";
    const secondaryColor = (_b = props.secondaryColor) != null ? _b : "#38BDF8";
    const height = (_c = props.height) != null ? _c : 240;
    const container = ref(null);
    const width = ref(640);
    const hover = ref(null);
    let gradCounter = 0;
    const gradId = `areachart-grad-${++gradCounter}`;
    const maxValue = computed(() => {
      var _a2;
      const all = [...props.values, ...(_a2 = props.secondary) != null ? _a2 : []];
      const m = Math.max(...all, 1);
      return m === 0 ? 1 : m;
    });
    const plotW = computed(() => width.value - PAD_X * 2);
    const plotH = computed(() => height - PAD_TOP - PAD_BOTTOM);
    function xAt(i) {
      const n = props.labels.length;
      return PAD_X + (n <= 1 ? plotW.value / 2 : i / (n - 1) * plotW.value);
    }
    function yAt(v) {
      return PAD_TOP + plotH.value - v / maxValue.value * plotH.value;
    }
    const points = computed(() => props.values.map((v, i) => ({ x: xAt(i), y: yAt(v) })));
    const linePath = computed(() => points.value.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "));
    const areaPath = computed(() => {
      if (!points.value.length) return "";
      const base = PAD_TOP + plotH.value;
      return `${linePath.value} L ${points.value[points.value.length - 1].x} ${base} L ${points.value[0].x} ${base} Z`;
    });
    const secondaryPoints = computed(() => {
      var _a2;
      return ((_a2 = props.secondary) != null ? _a2 : []).map((v, i) => ({ x: xAt(i), y: yAt(v) }));
    });
    const secondaryPath = computed(() => secondaryPoints.value.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "));
    const gridLines = computed(() => {
      const lines = [];
      for (let g = 0; g <= 4; g++) {
        const v = maxValue.value / 4 * g;
        lines.push({ y: yAt(v), value: Math.round(v) });
      }
      return lines;
    });
    const xLabelStep = computed(() => Math.max(1, Math.ceil(props.labels.length / 7)));
    function fmtDate(d) {
      return d.slice(5).replace("-", "/");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "container",
        ref: container,
        class: "relative w-full select-none",
        style: { height: unref(height) + "px" }
      }, _attrs))}>`);
      if (unref(width) > 0) {
        _push(`<svg${ssrRenderAttr("width", unref(width))}${ssrRenderAttr("height", unref(height))} class="block overflow-visible"><defs><linearGradient${ssrRenderAttr("id", gradId)} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${ssrRenderAttr("stop-color", unref(color))} stop-opacity="0.3"></stop><stop offset="100%"${ssrRenderAttr("stop-color", unref(color))} stop-opacity="0.01"></stop></linearGradient></defs><!--[-->`);
        ssrRenderList(unref(gridLines), (g) => {
          _push(`<g><line${ssrRenderAttr("x1", PAD_X)}${ssrRenderAttr("x2", unref(width) - PAD_X)}${ssrRenderAttr("y1", g.y)}${ssrRenderAttr("y2", g.y)} stroke="currentColor" class="text-border" stroke-width="1" stroke-dasharray="3 5"></line><text${ssrRenderAttr("x", PAD_X + 2)}${ssrRenderAttr("y", g.y - 5)} font-size="10" fill="#8E95A9">${ssrInterpolate(g.value)}</text></g>`);
        });
        _push(`<!--]--><path${ssrRenderAttr("d", unref(areaPath))}${ssrRenderAttr("fill", "url(#" + gradId + ")")}></path><path${ssrRenderAttr("d", unref(linePath))} fill="none"${ssrRenderAttr("stroke", unref(color))} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>`);
        if (unref(secondaryPath)) {
          _push(`<path${ssrRenderAttr("d", unref(secondaryPath))} fill="none"${ssrRenderAttr("stroke", unref(secondaryColor))} stroke-width="2" stroke-dasharray="4 5" stroke-linecap="round" stroke-linejoin="round"></path>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(points), (p, i) => {
          _push(`<g><circle${ssrRenderAttr("cx", p.x)}${ssrRenderAttr("cy", p.y)}${ssrRenderAttr("r", unref(hover) && unref(hover).i === i ? 5 : 3)}${ssrRenderAttr("fill", unref(hover) && unref(hover).i === i ? unref(color) : "#fff")}${ssrRenderAttr("stroke", unref(color))} stroke-width="2"></circle></g>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(__props.labels, (l, i) => {
          _push(`<text${ssrRenderAttr("x", xAt(i))}${ssrRenderAttr("y", unref(height) - 8)} font-size="10" fill="#8E95A9" text-anchor="middle" style="${ssrRenderStyle(i % unref(xLabelStep) === 0 ? null : { display: "none" })}">${ssrInterpolate(fmtDate(l))}</text>`);
        });
        _push(`<!--]--><rect${ssrRenderAttr("width", unref(width))}${ssrRenderAttr("height", unref(height))} fill="transparent"></rect></svg>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hover)) {
        _push(`<div class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-card px-3 py-2 shadow-btn-glow" style="${ssrRenderStyle({ left: unref(hover).x + "px", top: unref(hover).y - 12 + "px" })}"><p class="text-[10px] font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(__props.labels[unref(hover).i])}</p><p class="mt-0.5 text-sm font-bold text-text">${ssrInterpolate(__props.values[unref(hover).i])} kunjungan</p>`);
        if (__props.secondary) {
          _push(`<p class="text-[11px] text-text-secondary">${ssrInterpolate(__props.secondary[unref(hover).i])} pengunjung</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/charts/AreaChart.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BarList",
  __ssrInlineRender: true,
  props: {
    items: {},
    color: {}
  },
  setup(__props) {
    const props = __props;
    const palette = ["#8B5CF6", "#3B82F6", "#22C55E", "#F59E0B", "#EC4899", "#38BDF8", "#F43F5E", "#A3E635"];
    const max = computed(() => Math.max(...props.items.map((i) => i.value), 1));
    function pct(value) {
      return Math.max(value / max.value * 100, value > 0 ? 3 : 0);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3.5" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.items, (item, i) => {
        var _a, _b;
        _push(`<div class="group"><div class="mb-1.5 flex items-baseline justify-between gap-3"><div class="flex min-w-0 items-baseline gap-2"><span class="h-2 w-2 shrink-0 rounded-full" style="${ssrRenderStyle({ backgroundColor: (_a = __props.color) != null ? _a : palette[i % palette.length] })}" aria-hidden="true"></span><span class="truncate text-xs font-medium text-text-secondary">${ssrInterpolate(item.label)}</span>`);
        if (item.hint) {
          _push(`<span class="shrink-0 text-[10px] text-text-muted">${ssrInterpolate(item.hint)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><span class="shrink-0 text-xs font-bold text-text">${ssrInterpolate(item.value.toLocaleString("id-ID"))}<span class="ml-0.5 font-medium text-text-muted">\xD7</span></span></div><div class="h-2 overflow-hidden rounded-full bg-bg-alt"><div class="h-full rounded-full transition-all duration-700" style="${ssrRenderStyle({ width: pct(item.value) + "%", backgroundColor: (_b = __props.color) != null ? _b : palette[i % palette.length] })}"></div></div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/charts/BarList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    title: {},
    desc: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center gap-2 py-8 text-center" }, _attrs))}><span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Inbox), {
        size: 18,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</span><p class="text-sm font-medium text-text-secondary">${ssrInterpolate(__props.title)}</p>`);
      if (__props.desc) {
        _push(`<p class="text-xs text-text-muted">${ssrInterpolate(__props.desc)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EmptyState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$2 as _, _sfc_main$1 as a, _sfc_main as b };
//# sourceMappingURL=EmptyState-BNFJKZ3p.mjs.map
