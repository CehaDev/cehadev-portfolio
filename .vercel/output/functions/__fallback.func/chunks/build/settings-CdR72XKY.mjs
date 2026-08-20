import { defineComponent, withAsyncContext, reactive, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { CheckCircle2, XCircle, Send, Globe, Settings2, AtSign, Lock, KeyRound, ShieldCheck, LoaderCircle, Save, PlugZap } from 'lucide-vue-next';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    let __temp, __restore;
    const { data: saved } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "smtp-settings",
      () => useRequestFetch()("/api/admin/settings/smtp")
    )), __temp = await __temp, __restore(), __temp);
    const form = reactive({
      host: (_b = (_a = saved.value) == null ? void 0 : _a.host) != null ? _b : "",
      port: (_d = (_c = saved.value) == null ? void 0 : _c.port) != null ? _d : 465,
      secure: (_f = (_e = saved.value) == null ? void 0 : _e.secure) != null ? _f : true,
      user: (_h = (_g = saved.value) == null ? void 0 : _g.user) != null ? _h : "",
      pass: "",
      from: (_j = (_i = saved.value) == null ? void 0 : _i.from) != null ? _j : "",
      fromName: (_l = (_k = saved.value) == null ? void 0 : _k.fromName) != null ? _l : "CehaDev"
    });
    const hasStoredPass = ref(Boolean((_m = saved.value) == null ? void 0 : _m.hasPass));
    const saving = ref(false);
    const testing = ref(false);
    const status = ref(null);
    const isConfigured = computed(() => Boolean(form.host && form.user && (form.pass || hasStoredPass.value)));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-2xl" }, _attrs))}>`);
      if (unref(status)) {
        _push(`<div class="card mb-6 flex items-start gap-3 px-5 py-4">`);
        if (unref(status).ok) {
          _push(ssrRenderComponent(unref(CheckCircle2), {
            size: 18,
            class: "mt-0.5 shrink-0 text-success",
            "aria-hidden": "true"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(XCircle), {
            size: 18,
            class: "mt-0.5 shrink-0 text-red-400",
            "aria-hidden": "true"
          }, null, _parent));
        }
        _push(`<p class="${ssrRenderClass([unref(status).ok ? "text-success" : "text-red-400", "text-sm leading-relaxed text-text-secondary"])}">${ssrInterpolate(unref(status).message)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card"><div class="flex items-center gap-3 border-b border-border px-6 py-5"><span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">`);
      _push(ssrRenderComponent(unref(Send), {
        size: 18,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</span><div><h2 class="text-base font-bold text-text">Email (SMTP)</h2><p class="text-xs text-text-muted">Untuk membalas pesan kontak &amp; mengirim kode OTP login admin.</p></div><span class="${ssrRenderClass([unref(isConfigured) ? "border border-success/30 bg-success/10 text-success" : "border border-red-500/30 bg-red-500/10 text-red-400", "ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"])}"><span class="${ssrRenderClass([unref(isConfigured) ? "bg-success" : "bg-red-500", "h-1.5 w-1.5 rounded-full"])}" aria-hidden="true"></span> ${ssrInterpolate(unref(isConfigured) ? "Aktif" : "Belum aktif")}</span></div><div class="space-y-5 p-6"><div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">`);
      _push(ssrRenderComponent(unref(Globe), {
        size: 13,
        "stroke-width": 1.75,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` SMTP Host </label><input${ssrRenderAttr("value", unref(form).host)} type="text" class="input-field text-sm" placeholder="smtp.gmail.com"></div><div><label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">`);
      _push(ssrRenderComponent(unref(Settings2), {
        size: 13,
        "stroke-width": 1.75,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Port </label><input${ssrRenderAttr("value", unref(form).port)} type="number" class="input-field text-sm" placeholder="465"></div></div><label class="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).secure) ? ssrLooseContain(unref(form).secure, null) : unref(form).secure) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-primary"><span class="text-sm text-text-secondary">Gunakan koneksi aman (SSL/TLS) \u2014 untuk Gmail pakai port 465</span></label><div><label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">`);
      _push(ssrRenderComponent(unref(AtSign), {
        size: 13,
        "stroke-width": 1.75,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` User (email pengirim) </label><input${ssrRenderAttr("value", unref(form).user)} type="email" class="input-field text-sm" placeholder="email-anda@gmail.com"></div><div><label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">`);
      _push(ssrRenderComponent(unref(Lock), {
        size: 13,
        "stroke-width": 1.75,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Password / App Password </label><input${ssrRenderAttr("value", unref(form).pass)} type="password" class="input-field text-sm" autocomplete="new-password"${ssrRenderAttr("placeholder", unref(hasStoredPass) ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022 (tersimpan \u2014 kosongkan untuk biarkan)" : "App Password 16 karakter")}>`);
      if (unref(hasStoredPass)) {
        _push(`<p class="mt-1.5 flex items-center gap-1 text-[11px] text-text-muted">`);
        _push(ssrRenderComponent(unref(KeyRound), {
          size: 11,
          "stroke-width": 1.75,
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Password tersimpan. Biarkan kosong jika tidak ingin mengubahnya. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">`);
      _push(ssrRenderComponent(unref(Send), {
        size: 13,
        "stroke-width": 1.75,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Alamat pengirim (From) </label><input${ssrRenderAttr("value", unref(form).from)} type="email" class="input-field text-sm" placeholder="email-anda@gmail.com"><p class="mt-1 text-[11px] text-text-muted">Salinan setiap balasan juga masuk ke alamat ini.</p></div><div><label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">`);
      _push(ssrRenderComponent(unref(ShieldCheck), {
        size: 13,
        "stroke-width": 1.75,
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Nama pengirim </label><input${ssrRenderAttr("value", unref(form).fromName)} type="text" class="input-field text-sm" placeholder="CehaDev"></div></div><div class="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-text-secondary"> Untuk Gmail: aktifkan <strong>2-Step Verification</strong>, lalu buat <strong>App Password</strong> di <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" class="text-primary hover:underline">myaccount.google.com/apppasswords</a>. Gunakan App Password (16 karakter, tanpa spasi) sebagai Password di atas. </div><div class="flex items-center gap-3 pt-1"><button type="button" class="btn-primary inline-flex items-center gap-2"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>`);
      if (unref(saving)) {
        _push(ssrRenderComponent(unref(LoaderCircle), {
          size: 16,
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Save), {
          size: 16,
          "stroke-width": 1.75
        }, null, _parent));
      }
      _push(` Simpan </button><button type="button" class="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"${ssrIncludeBooleanAttr(unref(testing)) ? " disabled" : ""}>`);
      if (unref(testing)) {
        _push(ssrRenderComponent(unref(LoaderCircle), {
          size: 16,
          class: "animate-spin"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(PlugZap), {
          size: 16,
          "stroke-width": 1.75
        }, null, _parent));
      }
      _push(` Uji Koneksi </button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-CdR72XKY.mjs.map
