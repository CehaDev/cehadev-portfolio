import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { MessageSquare, User, Inbox, ArrowLeft, CheckCircle2, Circle, LoaderCircle, Trash2, Send } from 'lucide-vue-next';
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
  __name: "chat",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: convs, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-chat-conversations",
      () => useRequestFetch()("/api/admin/chat/conversations")
    )), __temp = await __temp, __restore(), __temp);
    const { data: cfg, refresh: refreshCfg } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-chat-config",
      () => useRequestFetch()("/api/admin/chat/config")
    )), __temp = await __temp, __restore(), __temp);
    const activeId = ref(null);
    const thread = ref(null);
    const replyText = ref("");
    const sending = ref(false);
    const busyDelete = ref(false);
    ref(null);
    computed(() => {
      var _a, _b;
      return (_b = (_a = convs.value) == null ? void 0 : _a.find((c) => c.id === activeId.value)) != null ? _b : null;
    });
    function formatTime(at) {
      return new Date(at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    }
    function formatDay(at) {
      const d = new Date(at);
      const today = /* @__PURE__ */ new Date();
      const sameDay = d.toDateString() === today.toDateString();
      return sameDay ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-[calc(100dvh-76px-2rem)] flex-col lg:h-[calc(100vh-76px-4rem)]" }, _attrs))}><div class="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 class="text-xl font-bold text-text">Percakapan Pengunjung</h2><p class="mt-1 text-sm text-text-secondary">Balas pesan dari pengunjung website dan pantau percakapan secara real-time.</p></div><button type="button" class="${ssrRenderClass([((_a = unref(cfg)) == null ? void 0 : _a.enabled) ? "border-success/40 bg-success/10 text-success" : "border-border text-text-muted", "flex items-center gap-2.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors"])}"><span class="relative inline-flex h-2 w-2" aria-hidden="true">`);
      if ((_b = unref(cfg)) == null ? void 0 : _b.enabled) {
        _push(`<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${ssrRenderClass([((_c = unref(cfg)) == null ? void 0 : _c.enabled) ? "bg-success" : "bg-text-muted", "relative inline-flex h-2 w-2 rounded-full"])}"></span></span> Chat ${ssrInterpolate(((_d = unref(cfg)) == null ? void 0 : _d.enabled) ? "Aktif" : "Nonaktif")}</button></div><div class="grid min-h-0 flex-1 gap-5 lg:grid-cols-[320px_1fr]"><div class="${ssrRenderClass([unref(activeId) ? "hidden lg:flex" : "flex", "card min-h-0 flex-col overflow-hidden"])}"><div class="border-b border-border px-5 py-4"><p class="flex items-center gap-2 text-sm font-bold text-text">`);
      _push(ssrRenderComponent(unref(MessageSquare), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Percakapan <span class="rounded-full bg-bg-alt px-2 py-0.5 text-[10px] font-bold text-text-muted">${ssrInterpolate((_f = (_e = unref(convs)) == null ? void 0 : _e.length) != null ? _f : 0)}</span></p></div><div class="flex-1 overflow-y-auto">`);
      if ((_g = unref(convs)) == null ? void 0 : _g.length) {
        _push(`<ul class="divide-y divide-border/60"><!--[-->`);
        ssrRenderList(unref(convs), (c) => {
          var _a2;
          _push(`<li><button type="button" class="${ssrRenderClass([unref(activeId) === c.id ? "bg-primary/10" : "hover:bg-card", "flex w-full items-start gap-3 px-5 py-4 text-left transition-colors"])}"><span class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">`);
          _push(ssrRenderComponent(unref(User), {
            size: 17,
            "stroke-width": 1.5
          }, null, _parent));
          _push(`<span class="${ssrRenderClass([c.status === "open" ? "bg-success" : "bg-text-muted", "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card"])}"></span></span><span class="min-w-0 flex-1"><span class="flex items-center justify-between gap-2"><span class="${ssrRenderClass([c.unread > 0 ? "text-text" : "text-text-secondary", "truncate text-sm font-semibold"])}">${ssrInterpolate(c.visitor.name || "Pengunjung")}</span><span class="shrink-0 text-[10px] text-text-muted">${ssrInterpolate(formatDay(c.updatedAt))}</span></span><span class="mt-0.5 flex items-center justify-between gap-2"><span class="truncate text-xs text-text-muted">${ssrInterpolate((_a2 = c.lastMessage) == null ? void 0 : _a2.text)}</span>`);
          if (c.unread > 0) {
            _push(`<span class="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">${ssrInterpolate(c.unread)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></span></button></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<div class="flex flex-col items-center gap-2 px-6 py-14 text-center"><span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">`);
        _push(ssrRenderComponent(unref(Inbox), {
          size: 20,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</span><p class="text-sm font-medium text-text">Belum ada percakapan</p><p class="text-xs text-text-muted">Pesan dari pengunjung akan muncul di sini.</p></div>`);
      }
      _push(`</div></div>`);
      if (unref(thread)) {
        _push(`<div class="card flex min-h-0 flex-col overflow-hidden"><div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4"><div class="flex min-w-0 items-center gap-3"><button type="button" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:hidden" aria-label="Kembali ke daftar percakapan">`);
        _push(ssrRenderComponent(unref(ArrowLeft), {
          size: 16,
          "stroke-width": 1.75
        }, null, _parent));
        _push(`</button><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">`);
        _push(ssrRenderComponent(unref(User), {
          size: 17,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</span><div class="min-w-0"><p class="truncate text-sm font-bold text-text">${ssrInterpolate(unref(thread).visitor.name || "Pengunjung")}</p><p class="truncate text-xs text-text-muted">${ssrInterpolate(unref(thread).visitor.email || "Tanpa email")}</p></div></div><div class="flex shrink-0 items-center gap-2"><button type="button" class="${ssrRenderClass([unref(thread).status === "open" ? "text-success hover:border-success/50" : "text-text-muted hover:border-primary/50 hover:text-text", "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors"])}">`);
        if (unref(thread).status === "open") {
          _push(ssrRenderComponent(unref(CheckCircle2), {
            size: 13,
            "stroke-width": 1.75
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Circle), {
            size: 13,
            "stroke-width": 1.75
          }, null, _parent));
        }
        _push(` ${ssrInterpolate(unref(thread).status === "open" ? "Selesai" : "Buka")}</button><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"${ssrIncludeBooleanAttr(unref(busyDelete)) ? " disabled" : ""}>`);
        if (unref(busyDelete)) {
          _push(ssrRenderComponent(unref(LoaderCircle), {
            size: 13,
            class: "animate-spin"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Trash2), {
            size: 13,
            "stroke-width": 1.5
          }, null, _parent));
        }
        _push(` Hapus </button></div></div><div class="flex-1 space-y-3 overflow-y-auto bg-bg p-5"><!--[-->`);
        ssrRenderList(unref(thread).messages, (m) => {
          _push(`<div class="${ssrRenderClass([m.role === "visitor" ? "justify-end" : "justify-start", "flex"])}"><div class="${ssrRenderClass([m.role === "visitor" ? "rounded-br-sm bg-gradient-brand text-white" : "rounded-bl-sm border border-border bg-card text-text", "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"])}"><p class="whitespace-pre-wrap break-words">${ssrInterpolate(m.text)}</p><p class="${ssrRenderClass([m.role === "visitor" ? "text-white/70" : "text-text-muted", "mt-1 text-right text-[10px]"])}">${ssrInterpolate(formatTime(m.at))}</p></div></div>`);
        });
        _push(`<!--]--></div><div class="border-t border-border p-4"><div class="flex items-end gap-2.5"><textarea rows="2" class="input-field resize-none text-sm" placeholder="Ketik balasan untuk pengunjung...">${ssrInterpolate(unref(replyText))}</textarea><button type="button" class="btn-primary flex h-11 w-11 shrink-0 items-center justify-center !rounded-xl !p-0"${ssrIncludeBooleanAttr(unref(sending) || !unref(replyText).trim()) ? " disabled" : ""}${ssrRenderAttr("aria-label", "Kirim balasan")}>`);
        _push(ssrRenderComponent(unref(Send), {
          size: 17,
          "stroke-width": 2,
          class: unref(sending) ? "animate-pulse" : ""
        }, null, _parent));
        _push(`</button></div></div></div>`);
      } else {
        _push(`<div class="card hidden items-center justify-center lg:flex"><div class="flex flex-col items-center gap-3 text-center"><span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">`);
        _push(ssrRenderComponent(unref(MessageSquare), {
          size: 24,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</span><div><p class="text-sm font-semibold text-text">Pilih percakapan untuk dibalas</p><p class="mt-1 text-xs text-text-muted">Klik salah satu percakapan di sebelah kiri.</p></div></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/chat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=chat-DmDbSgj3.mjs.map
