import { _ as _sfc_main$1 } from './Reveal-B94-pL53.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, withModifiers, withDirectives, isRef, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './ch-DqVFihD9.mjs';
import { Lock, LoaderCircle, LogIn, ArrowLeft } from 'lucide-vue-next';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Login Admin | CehaDev", robots: "noindex, nofollow" });
    const password = ref("");
    const error = ref("");
    const loading = ref(false);
    async function submit() {
      var _a, _b;
      if (loading.value) return;
      loading.value = true;
      error.value = "";
      try {
        const res = await $fetch("/api/auth/login", { method: "POST", body: { password: password.value } });
        if (res.devCode) sessionStorage.setItem("cehadev_dev_otp", res.devCode);
        await navigateTo(res.pending ? "/admin/verify" : "/admin");
      } catch (e) {
        const err = e;
        error.value = (_b = (_a = err.data) == null ? void 0 : _a.statusMessage) != null ? _b : "Gagal masuk, coba lagi";
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Reveal = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-site flex min-h-[calc(100vh-76px)] items-center justify-center py-16" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Reveal, { class: "w-full max-w-md" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card overflow-hidden"${_scopeId}><div class="h-1.5 bg-gradient-brand" aria-hidden="true"${_scopeId}></div><div class="p-8 md:p-10"${_scopeId}><div class="flex flex-col items-center text-center"${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="CehaDev" class="h-20 w-20 rounded-2xl object-cover shadow-btn-glow"${_scopeId}><h1 class="mt-6 text-2xl font-extrabold tracking-tight text-text"${_scopeId}> Admin <span class="bg-gradient-brand bg-clip-text text-transparent"${_scopeId}>Panel</span></h1><p class="mt-2 text-sm text-text-secondary"${_scopeId}>Masuk untuk mengelola konten website</p></div><form class="mt-8 space-y-5" novalidate${_scopeId}><div${_scopeId}><label for="admin-password" class="mb-1.5 block text-sm font-medium text-text"${_scopeId}>Password</label><div class="relative"${_scopeId}><span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted" aria-hidden="true"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Lock), {
              size: 16,
              "stroke-width": 1.5
            }, null, _parent2, _scopeId));
            _push2(`</span><input id="admin-password"${ssrRenderAttr("value", unref(password))} type="password" class="input-field !pl-11" placeholder="Masukkan password admin" autocomplete="current-password" required${_scopeId}></div>`);
            if (unref(error)) {
              _push2(`<p class="mt-1.5 text-xs text-red-400" role="alert"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button type="submit" class="btn-primary w-full"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId}>`);
            if (unref(loading)) {
              _push2(ssrRenderComponent(unref(LoaderCircle), {
                size: 16,
                class: "animate-spin"
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(LogIn), {
                size: 16,
                "stroke-width": 2
              }, null, _parent2, _scopeId));
            }
            _push2(` ${ssrInterpolate(unref(loading) ? "Memverifikasi..." : "Masuk")}</button></form>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeft), {
                    size: 14,
                    "stroke-width": 2
                  }, null, _parent3, _scopeId2));
                  _push3(` Kembali ke website `);
                } else {
                  return [
                    createVNode(unref(ArrowLeft), {
                      size: 14,
                      "stroke-width": 2
                    }),
                    createTextVNode(" Kembali ke website ")
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
                    createVNode("img", {
                      src: _imports_0,
                      alt: "CehaDev",
                      class: "h-20 w-20 rounded-2xl object-cover shadow-btn-glow"
                    }),
                    createVNode("h1", { class: "mt-6 text-2xl font-extrabold tracking-tight text-text" }, [
                      createTextVNode(" Admin "),
                      createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, "Panel")
                    ]),
                    createVNode("p", { class: "mt-2 text-sm text-text-secondary" }, "Masuk untuk mengelola konten website")
                  ]),
                  createVNode("form", {
                    class: "mt-8 space-y-5",
                    novalidate: "",
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", null, [
                      createVNode("label", {
                        for: "admin-password",
                        class: "mb-1.5 block text-sm font-medium text-text"
                      }, "Password"),
                      createVNode("div", { class: "relative" }, [
                        createVNode("span", {
                          class: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted",
                          "aria-hidden": "true"
                        }, [
                          createVNode(unref(Lock), {
                            size: 16,
                            "stroke-width": 1.5
                          })
                        ]),
                        withDirectives(createVNode("input", {
                          id: "admin-password",
                          "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                          type: "password",
                          class: "input-field !pl-11",
                          placeholder: "Masukkan password admin",
                          autocomplete: "current-password",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(password)]
                        ])
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
                      disabled: unref(loading)
                    }, [
                      unref(loading) ? (openBlock(), createBlock(unref(LoaderCircle), {
                        key: 0,
                        size: 16,
                        class: "animate-spin"
                      })) : (openBlock(), createBlock(unref(LogIn), {
                        key: 1,
                        size: 16,
                        "stroke-width": 2
                      })),
                      createTextVNode(" " + toDisplayString(unref(loading) ? "Memverifikasi..." : "Masuk"), 1)
                    ], 8, ["disabled"])
                  ], 32),
                  createVNode(_component_NuxtLink, {
                    to: "/",
                    class: "mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowLeft), {
                        size: 14,
                        "stroke-width": 2
                      }),
                      createTextVNode(" Kembali ke website ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DlJqi5K_.mjs.map
