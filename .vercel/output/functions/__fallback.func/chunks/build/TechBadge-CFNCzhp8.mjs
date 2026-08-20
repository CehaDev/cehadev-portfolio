import { defineComponent, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { f as findTechByName } from './useSkills-YG6FZoMb.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TechBadge",
  __ssrInlineRender: true,
  props: {
    name: {},
    showGlyph: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const tech = computed(() => findTechByName(props.name));
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(tech)) {
        _push(`<span${ssrRenderAttrs(mergeProps({ class: "chip" }, _attrs))}>`);
        if (__props.showGlyph) {
          _push(`<span class="flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold" style="${ssrRenderStyle({ backgroundColor: unref(tech).color + "22", color: unref(tech).color })}" aria-hidden="true">${ssrInterpolate(unref(tech).glyph)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(tech).name)}</span>`);
      } else {
        _push(`<span${ssrRenderAttrs(mergeProps({ class: "chip" }, _attrs))}>${ssrInterpolate(__props.name)}</span>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TechBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=TechBadge-CFNCzhp8.mjs.map
