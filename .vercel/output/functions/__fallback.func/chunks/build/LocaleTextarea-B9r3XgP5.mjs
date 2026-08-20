import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LocaleTextarea",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: "" },
    id: { default: void 0 },
    placeholder: { default: "" },
    rows: { default: 3 },
    labelId: { default: "ID" },
    labelEn: { default: "EN" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const ls = computed({
      get() {
        var _a, _b;
        const v = props.modelValue;
        if (typeof v === "string") return { id: v, en: v };
        return { id: (_a = v == null ? void 0 : v.id) != null ? _a : "", en: (_b = v == null ? void 0 : v.en) != null ? _b : "" };
      },
      set(value) {
        emit("update:modelValue", value);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid gap-2 sm:grid-cols-2" }, _attrs))}><div><span class="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(__props.labelId)}</span><textarea${ssrRenderAttr("id", __props.id ? `${__props.id}-id` : void 0)}${ssrRenderAttr("rows", __props.rows)} class="input-field resize-none"${ssrRenderAttr("placeholder", __props.placeholder)}>${ssrInterpolate(ls.value.id)}</textarea></div><div><span class="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(__props.labelEn)}</span><textarea${ssrRenderAttr("id", __props.id ? `${__props.id}-en` : void 0)}${ssrRenderAttr("rows", __props.rows)} class="input-field resize-none"${ssrRenderAttr("placeholder", __props.placeholder)}>${ssrInterpolate(ls.value.en)}</textarea></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/LocaleTextarea.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=LocaleTextarea-B9r3XgP5.mjs.map
