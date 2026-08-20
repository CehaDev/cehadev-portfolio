import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CountUp",
  __ssrInlineRender: true,
  props: {
    end: {},
    suffix: {},
    duration: {}
  },
  setup(__props) {
    const value = ref(0);
    const el = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<span${ssrRenderAttrs(mergeProps({
        ref_key: "el",
        ref: el
      }, _attrs))}>${ssrInterpolate(unref(value))}${ssrInterpolate((_a = __props.suffix) != null ? _a : "")}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CountUp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CountUp-2uvjSD__.mjs.map
