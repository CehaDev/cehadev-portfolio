import { defineComponent, ref, computed, createVNode, resolveDynamicComponent, mergeProps, unref, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Reveal",
  __ssrInlineRender: true,
  props: {
    delay: { default: 0 },
    duration: { default: 1400 },
    as: { default: "div" },
    direction: { default: "up" },
    parallax: { default: 0 }
  },
  setup(__props) {
    const props = __props;
    const el = ref(null);
    const visible = ref(false);
    const parallaxY = ref(0);
    const hiddenClass = computed(() => {
      switch (props.direction) {
        case "none":
          return "";
        case "down":
          return "-translate-y-10 opacity-0";
        case "left":
          return "translate-x-[-40px] opacity-0";
        case "right":
          return "translate-x-[40px] opacity-0";
        case "scale":
          return "scale-[0.9] opacity-0";
        case "blur":
          return "translate-y-3 scale-[1.02] opacity-0 blur-[10px]";
        default:
          return "translate-y-10 opacity-0";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.as), mergeProps({
        ref_key: "el",
        ref: el,
        class: ["transition-all ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform", [unref(visible) ? "translate-x-0 translate-y-0 scale-100 blur-0 opacity-100" : unref(hiddenClass)]],
        style: {
          transitionDuration: __props.duration + "ms",
          transitionDelay: __props.delay + "ms",
          transform: __props.parallax !== 0 ? `translateY(${unref(parallaxY)}px)` : void 0
        }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Reveal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Reveal-B94-pL53.mjs.map
