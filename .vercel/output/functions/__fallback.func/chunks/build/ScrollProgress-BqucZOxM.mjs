import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ScrollProgress",
  __ssrInlineRender: true,
  setup(__props) {
    const progress = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent print:hidden",
        "aria-hidden": "true"
      }, _attrs))}><div class="h-full rounded-r-full bg-gradient-brand transition-[width] duration-150 ease-out" style="${ssrRenderStyle({ width: (unref(progress) * 100).toFixed(2) + "%" })}"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ScrollProgress.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ScrollProgress-BqucZOxM.mjs.map
