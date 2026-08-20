import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AvatarIllustration",
  __ssrInlineRender: true,
  props: {
    size: { default: 260 },
    variant: { default: "default" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        style: { width: __props.size + "px", height: __props.size + "px" },
        role: "img",
        "aria-label": "Ilustrasi karakter CehaDev"
      }, _attrs))}><div class="absolute -inset-10 bg-glow-circle blur-2xl" aria-hidden="true"></div><div class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-border bg-card shadow-card"><svg${ssrRenderAttr("viewBox", "0 0 200 200")} class="h-[82%] w-[82%]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="brand-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8B5CF6"></stop><stop offset="100%" stop-color="#3B82F6"></stop></linearGradient></defs><path d="M62 116c8-14 18-20 38-20s30 6 38 20v18c0 6-5 10-11 10H73c-6 0-11-4-11-10v-18z" fill="url(#brand-g)"></path><path d="M84 128h32c-2 8-10 13-16 13s-14-5-16-13z" fill="rgba(255,255,255,0.18)"></path><rect x="92" y="90" width="16" height="12" rx="5" fill="#E8B98A"></rect><circle cx="100" cy="72" r="30" fill="#F2C79B"></circle><path d="M70 62c0-16 13-26 30-26s30 10 30 26c-4-6-9-8-16-9 1-5-3-9-8-9-4 0-7 3-7 7-5 0-10 2-13 5-5-2-10-3-16 6z" fill="#262633"></path><g stroke="url(#brand-g)" stroke-width="4"><circle cx="87" cy="72" r="9" fill="rgba(255,255,255,0.08)"></circle><circle cx="113" cy="72" r="9" fill="rgba(255,255,255,0.08)"></circle><path d="M96 72h8" stroke-width="3"></path></g><circle cx="87" cy="72" r="2" fill="#262633"></circle><circle cx="113" cy="72" r="2" fill="#262633"></circle><path d="M92 82c4 3 12 3 16 0" stroke="#B9774A" stroke-width="2.5" stroke-linecap="round"></path>`);
      if (__props.variant === "laptop") {
        _push(`<g><rect x="62" y="132" width="76" height="30" rx="5" fill="#0B0B12" stroke="url(#brand-g)" stroke-width="2.5"></rect><rect x="68" y="138" width="64" height="18" rx="2" fill="#161620"></rect><path d="M72 146l10 6 8-10 8 8 8-14 8 10" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round"></path><rect x="84" y="162" width="32" height="5" rx="2.5" fill="#262633"></rect></g>`);
      } else if (__props.variant === "code") {
        _push(`<g><rect x="58" y="128" width="84" height="26" rx="6" fill="#0B0B12" stroke="url(#brand-g)" stroke-width="2.5"></rect><text x="70" y="146" font-family="monospace" font-size="13" font-weight="bold" fill="#22C55E">&lt;/&gt;</text></g>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</svg></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AvatarIllustration.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AvatarIllustration-CKtNMuk4.mjs.map
