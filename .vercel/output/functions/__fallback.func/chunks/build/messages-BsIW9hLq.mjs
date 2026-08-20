import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Inbox, Mail, ArrowLeft, Tag, User, MailOpen, LoaderCircle, Trash2, CheckCircle2, XCircle, Settings2, Send } from 'lucide-vue-next';
import { u as useAsyncData } from './asyncData-I2BNYYXU.mjs';
import { a as useRequestFetch } from './ssr-DMxvrB_f.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "messages",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: messages, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-messages",
      () => useRequestFetch()("/api/admin/messages")
    )), __temp = await __temp, __restore(), __temp);
    const { data: smtpReady } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "admin-smtp-ready",
      () => useRequestFetch()("/api/admin/settings/smtp").then((s) => Boolean(s.hasPass && s.host && s.user)).catch(() => false)
    )), __temp = await __temp, __restore(), __temp);
    const activeId = ref(null);
    const detail = ref(null);
    const busyDelete = ref(false);
    const replyText = ref("");
    const sending = ref(false);
    const replyNotice = ref("");
    const unreadCount = computed(() => {
      var _a, _b;
      return (_b = (_a = messages.value) == null ? void 0 : _a.filter((m) => !m.read).length) != null ? _b : 0;
    });
    function formatDay(at) {
      const d = new Date(at);
      const today = /* @__PURE__ */ new Date();
      const sameDay = d.toDateString() === today.toDateString();
      return sameDay ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    }
    function formatFull(at) {
      return new Date(at).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-[calc(100dvh-76px-2rem)] flex-col lg:h-[calc(100vh-76px-4rem)]" }, _attrs))}><div class="mb-5"><h2 class="text-xl font-bold text-text">Pesan Masuk</h2><p class="mt-1 text-sm text-text-secondary"> Pesan dari form kontak website. `);
      if (unref(unreadCount) > 0) {
        _push(`<span class="font-semibold text-red-400">${ssrInterpolate(unref(unreadCount))} belum dibaca</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div><div class="grid min-h-0 flex-1 gap-5 lg:grid-cols-[340px_1fr]"><div class="${ssrRenderClass([unref(activeId) ? "hidden lg:flex" : "flex", "card min-h-0 flex-col overflow-hidden"])}"><div class="border-b border-border px-5 py-4"><p class="flex items-center gap-2 text-sm font-bold text-text">`);
      _push(ssrRenderComponent(unref(Inbox), {
        size: 16,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Inbox <span class="rounded-full bg-bg-alt px-2 py-0.5 text-[10px] font-bold text-text-muted">${ssrInterpolate((_b = (_a = unref(messages)) == null ? void 0 : _a.length) != null ? _b : 0)}</span></p></div><div class="flex-1 overflow-y-auto">`);
      if ((_c = unref(messages)) == null ? void 0 : _c.length) {
        _push(`<ul class="divide-y divide-border/60"><!--[-->`);
        ssrRenderList(unref(messages), (m) => {
          _push(`<li><button type="button" class="${ssrRenderClass([unref(activeId) === m.id ? "bg-primary/10" : "hover:bg-card", "flex w-full items-start gap-3 px-5 py-4 text-left transition-colors"])}"><span class="${ssrRenderClass([m.read ? "bg-bg-alt text-text-muted" : "bg-primary/15 text-primary", "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"])}" aria-hidden="true">`);
          _push(ssrRenderComponent(unref(Mail), {
            size: 16,
            "stroke-width": 1.5
          }, null, _parent));
          _push(`</span><span class="min-w-0 flex-1"><span class="flex items-center justify-between gap-2"><span class="${ssrRenderClass([m.read ? "text-text-secondary" : "text-text", "truncate text-sm font-semibold"])}">${ssrInterpolate(m.subject)}</span><span class="shrink-0 text-[10px] text-text-muted">${ssrInterpolate(formatDay(m.at))}</span></span><span class="mt-0.5 flex items-center justify-between gap-2"><span class="${ssrRenderClass([m.read ? "text-text-muted" : "font-medium text-text-secondary", "truncate text-xs"])}">${ssrInterpolate(m.name)} \u2014 ${ssrInterpolate(m.message)}</span>`);
          if (!m.read) {
            _push(`<span class="flex h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" aria-hidden="true"></span>`);
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
        _push(`</span><p class="text-sm font-medium text-text">Belum ada pesan</p><p class="text-xs text-text-muted">Pesan dari form kontak akan muncul di sini.</p></div>`);
      }
      _push(`</div></div>`);
      if (unref(detail)) {
        _push(`<div class="card flex min-h-0 flex-col overflow-hidden"><div class="flex items-start justify-between gap-3 border-b border-border px-6 py-5"><div class="min-w-0"><p class="flex items-center gap-2 text-sm font-bold text-text"><button type="button" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:hidden" aria-label="Kembali ke daftar pesan">`);
        _push(ssrRenderComponent(unref(ArrowLeft), {
          size: 16,
          "stroke-width": 1.75
        }, null, _parent));
        _push(`</button>`);
        _push(ssrRenderComponent(unref(Tag), {
          size: 15,
          "stroke-width": 1.75,
          class: "shrink-0 text-primary",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`<span class="truncate">${ssrInterpolate(unref(detail).subject)}</span></p><div class="mt-2 flex items-center gap-2.5"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">`);
        _push(ssrRenderComponent(unref(User), {
          size: 15,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</span><div class="min-w-0 leading-tight"><p class="truncate text-sm font-semibold text-text">${ssrInterpolate(unref(detail).name)}</p><a${ssrRenderAttr("href", `mailto:${unref(detail).email}`)} class="truncate text-xs text-primary hover:underline">${ssrInterpolate(unref(detail).email)}</a></div></div><p class="mt-2 text-xs text-text-muted">${ssrInterpolate(formatFull(unref(detail).at))}</p></div><div class="flex shrink-0 items-center gap-2"><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary">`);
        _push(ssrRenderComponent(unref(MailOpen), {
          size: 13,
          "stroke-width": 1.75
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(detail).read ? "Tandai Belum Dibaca" : "Tandai Dibaca")}</button><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"${ssrIncludeBooleanAttr(unref(busyDelete)) ? " disabled" : ""}>`);
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
        _push(` Hapus </button></div></div><div class="flex-1 overflow-y-auto p-6"><div class="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5"><p class="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">${ssrInterpolate(unref(detail).message)}</p><p class="mt-2 text-right text-[10px] text-text-muted">${ssrInterpolate(formatFull(unref(detail).at))} \u2022 ${ssrInterpolate(unref(detail).name)}</p></div>`);
        if ((_d = unref(detail).replies) == null ? void 0 : _d.length) {
          _push(`<div class="mt-4 space-y-3"><p class="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Riwayat Balasan</p><!--[-->`);
          ssrRenderList(unref(detail).replies, (r) => {
            _push(`<div class="rounded-2xl rounded-tr-sm border border-primary/30 bg-primary/10 px-4 py-3.5"><div class="flex items-center justify-between gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-primary">Balasan kamu</span><span class="${ssrRenderClass([r.status === "sent" ? "border border-success/30 bg-success/10 text-success" : "border border-red-500/30 bg-red-500/10 text-red-400", "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"])}">`);
            if (r.status === "sent") {
              _push(ssrRenderComponent(unref(CheckCircle2), {
                size: 10,
                "stroke-width": 2
              }, null, _parent));
            } else {
              _push(ssrRenderComponent(unref(XCircle), {
                size: 10,
                "stroke-width": 2
              }, null, _parent));
            }
            _push(` ${ssrInterpolate(r.status === "sent" ? "Terkirim" : "Gagal")}</span></div><p class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text">${ssrInterpolate(r.text)}</p>`);
            if (r.error) {
              _push(`<p class="mt-1.5 text-[11px] text-red-400">${ssrInterpolate(r.error)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="mt-1 text-right text-[10px] text-text-muted">${ssrInterpolate(formatFull(r.at))}</p></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="border-t border-border p-4">`);
        if (unref(replyNotice)) {
          _push(`<p class="${ssrRenderClass([unref(replyNotice).startsWith("Balasan terkirim") ? "border-success/30 bg-success/10 text-success" : "border-amber-400/30 bg-amber-400/10 text-amber-500", "mb-3 rounded-lg border px-4 py-2.5 text-xs font-medium"])}" role="status">${ssrInterpolate(unref(replyNotice))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(smtpReady)) {
          _push(`<div class="mb-3 flex items-center gap-2.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs text-amber-500">`);
          _push(ssrRenderComponent(unref(Settings2), {
            size: 14,
            "stroke-width": 1.75,
            class: "shrink-0",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`<span>SMTP belum dikonfigurasi \u2014 balasan tidak akan terkirim via email. Atur di `);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/admin/settings",
            class: "font-semibold underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Settings`);
              } else {
                return [
                  createTextVNode("Settings")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`. </span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-end gap-2.5"><textarea rows="2" class="input-field resize-none text-sm"${ssrRenderAttr("placeholder", `Balas via email ke ${unref(detail).email}...`)}>${ssrInterpolate(unref(replyText))}</textarea><button type="button" class="btn-primary flex h-11 w-11 shrink-0 items-center justify-center !rounded-xl !p-0"${ssrIncludeBooleanAttr(unref(sending) || !unref(replyText).trim()) ? " disabled" : ""}${ssrRenderAttr("aria-label", "Kirim balasan email")}>`);
        _push(ssrRenderComponent(unref(Send), {
          size: 17,
          "stroke-width": 2,
          class: unref(sending) ? "animate-pulse" : ""
        }, null, _parent));
        _push(`</button></div></div></div>`);
      } else {
        _push(`<div class="card hidden items-center justify-center lg:flex"><div class="flex flex-col items-center gap-3 text-center"><span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">`);
        _push(ssrRenderComponent(unref(Mail), {
          size: 24,
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</span><div><p class="text-sm font-semibold text-text">Pilih pesan untuk dibaca</p><p class="mt-1 text-xs text-text-muted">Klik salah satu pesan di sebelah kiri.</p></div></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/messages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=messages-BsIW9hLq.mjs.map
