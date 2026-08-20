import { _ as _sfc_main$1 } from './Reveal-B94-pL53.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, withDirectives, isRef, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { MailCheck, LoaderCircle, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-vue-next';
import { u as useSeoMeta } from './v3-C1_XsqpX.mjs';
import { n as navigateTo } from './server.mjs';
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

const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "verify",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Verifikasi Kode | CehaDev", robots: "noindex, nofollow" });
    const code = ref("");
    const error = ref("");
    const busy = ref(false);
    const resendBusy = ref(false);
    const cooldown = ref(0);
    const devCode = ref(sessionStorage.getItem("cehadev_dev_otp"));
    function startCooldown(seconds) {
      cooldown.value = seconds;
      setInterval();
    }
    async function resend() {
      var _a, _b, _c;
      if (resendBusy.value || cooldown.value > 0) return;
      resendBusy.value = true;
      error.value = "";
      try {
        const res = await $fetch("/api/auth/otp/resend", { method: "POST" });
        if (res.devCode) sessionStorage.setItem("cehadev_dev_otp", res.devCode);
        devCode.value = (_a = res.devCode) != null ? _a : null;
        startCooldown(30);
      } catch (e) {
        const err = e;
        error.value = (_c = (_b = err.data) == null ? void 0 : _b.statusMessage) != null ? _c : "Gagal mengirim ulang kode.";
      } finally {
        resendBusy.value = false;
      }
    }
    const codeReady = computed(() => code.value.replace(/\s/g, "").length === 6);
    async function submit() {
      var _a, _b;
      if (busy.value || !codeReady.value) return;
      busy.value = true;
      error.value = "";
      try {
        await $fetch("/api/auth/verify", { method: "POST", body: { code: code.value } });
        await navigateTo("/admin");
      } catch (e) {
        const err = e;
        error.value = (_b = (_a = err.data) == null ? void 0 : _a.statusMessage) != null ? _b : "Kode tidak valid";
        code.value = "";
      } finally {
        busy.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Reveal = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-site flex min-h-[calc(100vh-76px)] items-center justify-center py-16" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Reveal, { class: "w-full max-w-md" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card overflow-hidden"${_scopeId}><div class="h-1.5 bg-gradient-brand" aria-hidden="true"${_scopeId}></div><div class="p-8 md:p-10"${_scopeId}><div class="flex flex-col items-center text-center"${_scopeId}><span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(MailCheck), {
              size: 26,
              "stroke-width": 1.5
            }, null, _parent2, _scopeId));
            _push2(`</span><h1 class="mt-5 text-2xl font-extrabold tracking-tight text-text"${_scopeId}> Kode <span class="bg-gradient-brand bg-clip-text text-transparent"${_scopeId}>Login</span></h1><p class="mt-2 text-sm text-text-secondary"${_scopeId}> Kode verifikasi 6 digit telah dikirim ke email Anda. Berlaku 10 menit. </p></div>`);
            if (unref(devCode)) {
              _push2(`<div class="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-sm font-mono font-semibold tracking-widest text-amber-500"${_scopeId}> Mode pengembangan: kode = ${ssrInterpolate(unref(devCode))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="mt-7 space-y-5" novalidate${_scopeId}><div${_scopeId}><label for="verify-code" class="mb-1.5 block text-sm font-medium text-text"${_scopeId}>Kode 6 digit</label><input id="verify-code"${ssrRenderAttr("value", unref(code))} type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="input-field text-center font-mono text-lg tracking-[0.4em]" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022"${ssrIncludeBooleanAttr(unref(busy)) ? " disabled" : ""}${_scopeId}>`);
            if (unref(error)) {
              _push2(`<p class="mt-1.5 text-xs text-red-400" role="alert"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button type="submit" class="btn-primary w-full"${ssrIncludeBooleanAttr(unref(busy) || !unref(codeReady)) ? " disabled" : ""}${_scopeId}>`);
            if (unref(busy)) {
              _push2(ssrRenderComponent(unref(LoaderCircle), {
                size: 16,
                class: "animate-spin"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(CheckCircle2), {
                size: 16,
                "stroke-width": 2
              }, null, _parent2, _scopeId));
            }
            _push2(` Verifikasi &amp; Masuk </button><button type="button" class="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text disabled:opacity-50"${ssrIncludeBooleanAttr(unref(resendBusy) || unref(cooldown) > 0) ? " disabled" : ""}${_scopeId}>`);
            if (unref(resendBusy)) {
              _push2(ssrRenderComponent(unref(LoaderCircle), {
                size: 14,
                class: "animate-spin"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(RefreshCw), {
                size: 14,
                "stroke-width": 2
              }, null, _parent2, _scopeId));
            }
            _push2(` ${ssrInterpolate(unref(cooldown) > 0 ? `Kirim ulang kode (${unref(cooldown)}s)` : "Kirim ulang kode")}</button></form>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/login",
              class: "mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeft), {
                    size: 14,
                    "stroke-width": 2
                  }, null, _parent3, _scopeId2));
                  _push3(` Kembali ke login `);
                } else {
                  return [
                    createVNode(unref(ArrowLeft), {
                      size: 14,
                      "stroke-width": 2
                    }),
                    createTextVNode(" Kembali ke login ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "card overflow-hidden" }, [
                createVNode("div", {
                  class: "h-1.5 bg-gradient-brand",
                  "aria-hidden": "true"
                }),
                createVNode("div", { class: "p-8 md:p-10" }, [
                  createVNode("div", { class: "flex flex-col items-center text-center" }, [
                    createVNode("span", {
                      class: "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary",
                      "aria-hidden": "true"
                    }, [
                      createVNode(unref(MailCheck), {
                        size: 26,
                        "stroke-width": 1.5
                      })
                    ]),
                    createVNode("h1", { class: "mt-5 text-2xl font-extrabold tracking-tight text-text" }, [
                      createTextVNode(" Kode "),
                      createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, "Login")
                    ]),
                    createVNode("p", { class: "mt-2 text-sm text-text-secondary" }, " Kode verifikasi 6 digit telah dikirim ke email Anda. Berlaku 10 menit. ")
                  ]),
                  unref(devCode) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-sm font-mono font-semibold tracking-widest text-amber-500"
                  }, " Mode pengembangan: kode = " + toDisplayString(unref(devCode)), 1)) : createCommentVNode("", true),
                  createVNode("form", {
                    class: "mt-7 space-y-5",
                    novalidate: "",
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", null, [
                      createVNode("label", {
                        for: "verify-code",
                        class: "mb-1.5 block text-sm font-medium text-text"
                      }, "Kode 6 digit"),
                      withDirectives(createVNode("input", {
                        id: "verify-code",
                        "onUpdate:modelValue": ($event) => isRef(code) ? code.value = $event : null,
                        type: "text",
                        inputmode: "numeric",
                        autocomplete: "one-time-code",
                        maxlength: "6",
                        class: "input-field text-center font-mono text-lg tracking-[0.4em]",
                        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
                        disabled: unref(busy),
                        onInput: ($event) => code.value = unref(code).replace(/[^0-9]/g, "").slice(0, 6)
                      }, null, 40, ["onUpdate:modelValue", "disabled", "onInput"]), [
                        [vModelText, unref(code)]
                      ]),
                      unref(error) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1.5 text-xs text-red-400",
                        role: "alert"
                      }, toDisplayString(unref(error)), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("button", {
                      type: "submit",
                      class: "btn-primary w-full",
                      disabled: unref(busy) || !unref(codeReady)
                    }, [
                      unref(busy) ? (openBlock(), createBlock(unref(LoaderCircle), {
                        key: 0,
                        size: 16,
                        class: "animate-spin"
                      })) : (openBlock(), createBlock(unref(CheckCircle2), {
                        key: 1,
                        size: 16,
                        "stroke-width": 2
                      })),
                      createTextVNode(" Verifikasi & Masuk ")
                    ], 8, ["disabled"]),
                    createVNode("button", {
                      type: "button",
                      class: "flex w-full items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text disabled:opacity-50",
                      disabled: unref(resendBusy) || unref(cooldown) > 0,
                      onClick: resend
                    }, [
                      unref(resendBusy) ? (openBlock(), createBlock(unref(LoaderCircle), {
                        key: 0,
                        size: 14,
                        class: "animate-spin"
                      })) : (openBlock(), createBlock(unref(RefreshCw), {
                        key: 1,
                        size: 14,
                        "stroke-width": 2
                      })),
                      createTextVNode(" " + toDisplayString(unref(cooldown) > 0 ? `Kirim ulang kode (${unref(cooldown)}s)` : "Kirim ulang kode"), 1)
                    ], 8, ["disabled"])
                  ], 32),
                  createVNode(_component_NuxtLink, {
                    to: "/admin/login",
                    class: "mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowLeft), {
                        size: 14,
                        "stroke-width": 2
                      }),
                      createTextVNode(" Kembali ke login ")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/verify.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=verify-Bnrrv9Ng.mjs.map
