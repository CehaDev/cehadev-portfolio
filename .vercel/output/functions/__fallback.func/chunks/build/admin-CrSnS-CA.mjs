import { _ as _sfc_main$2 } from './ScrollProgress-BqucZOxM.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { X, LayoutDashboard, BarChart3, FolderKanban, Play, Zap, FileText, MessageSquare, Mail, Settings2, Settings, ArrowLeft, LogOut, Menu, Bell, Inbox, CheckCheck } from 'lucide-vue-next';
import { _ as _export_sfc, u as useRoute } from './server.mjs';
import { _ as _imports_0 } from './ch-DqVFihD9.mjs';
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

const state = reactive({
  messageUnread: 0,
  chatUnread: 0,
  messages: [],
  chats: [],
  total: 0
});
function useAdminNotifications() {
  return state;
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NotificationBell",
  __ssrInlineRender: true,
  setup(__props) {
    const { messageUnread, chatUnread, messages, chats, total } = useAdminNotifications();
    const open = ref(false);
    const panel = ref(null);
    function close() {
      open.value = false;
    }
    function timeAgo(iso) {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 6e4);
      if (mins < 1) return "baru saja";
      if (mins < 60) return `${mins}m lalu`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}j lalu`;
      const days = Math.floor(hours / 24);
      return `${days}h lalu`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "panel",
        ref: panel,
        class: "relative"
      }, _attrs))}><button type="button" class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"${ssrRenderAttr("aria-label", `Notifikasi (${unref(total)} belum dibaca)`)}>`);
      _push(ssrRenderComponent(unref(Bell), {
        size: 18,
        "stroke-width": 1.75
      }, null, _parent));
      if (unref(total) > 0) {
        _push(`<span class="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-btn-glow" aria-hidden="true">${ssrInterpolate(unref(total) > 9 ? "9+" : unref(total))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (unref(open)) {
        _push(`<div class="fixed inset-0 z-40" aria-hidden="true"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(open)) {
        _push(`<div class="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-btn-glow"><div class="flex items-center justify-between border-b border-border px-5 py-3.5"><p class="text-sm font-bold text-text">Notifikasi</p>`);
        if (unref(total) > 0) {
          _push(`<span class="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-400">${ssrInterpolate(unref(messageUnread) + unref(chatUnread))} belum dibaca </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="max-h-[420px] overflow-y-auto"><div class="px-5 pt-4"><p class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">`);
        _push(ssrRenderComponent(unref(Mail), {
          size: 12,
          "stroke-width": 2,
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Pesan Baru (${ssrInterpolate(unref(messageUnread))}) </p>`);
        if (unref(messages).length) {
          _push(`<ul class="mt-2"><!--[-->`);
          ssrRenderList(unref(messages), (m) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/messages",
              class: "flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-bg-alt",
              onClick: close
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Mail), {
                    size: 13,
                    "stroke-width": 1.5
                  }, null, _parent2, _scopeId));
                  _push2(`</span><span class="min-w-0"${_scopeId}><span class="block truncate text-xs font-semibold text-text"${_scopeId}>${ssrInterpolate(m.subject)}</span><span class="mt-0.5 block truncate text-[11px] text-text-muted"${_scopeId}>${ssrInterpolate(m.name)} \xB7 ${ssrInterpolate(timeAgo(m.at))}</span></span>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary",
                      "aria-hidden": "true"
                    }, [
                      createVNode(unref(Mail), {
                        size: 13,
                        "stroke-width": 1.5
                      })
                    ]),
                    createVNode("span", { class: "min-w-0" }, [
                      createVNode("span", { class: "block truncate text-xs font-semibold text-text" }, toDisplayString(m.subject), 1),
                      createVNode("span", { class: "mt-0.5 block truncate text-[11px] text-text-muted" }, toDisplayString(m.name) + " \xB7 " + toDisplayString(timeAgo(m.at)), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<p class="mt-2 px-2 py-2 text-xs text-text-muted">Tidak ada pesan baru.</p>`);
        }
        _push(`</div><div class="px-5 py-4"><p class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">`);
        _push(ssrRenderComponent(unref(MessageSquare), {
          size: 12,
          "stroke-width": 2,
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Chat Baru (${ssrInterpolate(unref(chatUnread))}) </p>`);
        if (unref(chats).length) {
          _push(`<ul class="mt-2"><!--[-->`);
          ssrRenderList(unref(chats), (c) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/chat",
              class: "flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-bg-alt",
              onClick: close
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/15 text-blue" aria-hidden="true"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(MessageSquare), {
                    size: 13,
                    "stroke-width": 1.5
                  }, null, _parent2, _scopeId));
                  _push2(`</span><span class="min-w-0"${_scopeId}><span class="block truncate text-xs font-semibold text-text"${_scopeId}>${ssrInterpolate(c.visitor)}</span><span class="mt-0.5 block truncate text-[11px] text-text-muted"${_scopeId}>${ssrInterpolate(c.text || "Membuka chat...")} \xB7 ${ssrInterpolate(timeAgo(c.at))}</span></span>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/15 text-blue",
                      "aria-hidden": "true"
                    }, [
                      createVNode(unref(MessageSquare), {
                        size: 13,
                        "stroke-width": 1.5
                      })
                    ]),
                    createVNode("span", { class: "min-w-0" }, [
                      createVNode("span", { class: "block truncate text-xs font-semibold text-text" }, toDisplayString(c.visitor), 1),
                      createVNode("span", { class: "mt-0.5 block truncate text-[11px] text-text-muted" }, toDisplayString(c.text || "Membuka chat...") + " \xB7 " + toDisplayString(timeAgo(c.at)), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<p class="mt-2 px-2 py-2 text-xs text-text-muted">Tidak ada chat baru.</p>`);
        }
        _push(`</div>`);
        if (!unref(messages).length && !unref(chats).length) {
          _push(`<div class="flex flex-col items-center gap-1.5 px-5 pb-6 pt-2 text-center">`);
          _push(ssrRenderComponent(unref(Inbox), {
            size: 18,
            "stroke-width": 1.5,
            class: "text-text-muted",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`<p class="text-xs text-text-muted">Semua sudah dibaca.</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="border-t border-border px-5 py-3"><p class="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">`);
        _push(ssrRenderComponent(unref(CheckCheck), {
          size: 12,
          "stroke-width": 1.75,
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Diperbarui otomatis setiap 10 detik </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/NotificationBell.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const navItems = [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
      { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
      { label: "Projects", to: "/admin/projects", icon: FolderKanban },
      { label: "Demos", to: "/admin/demos", icon: Play },
      { label: "Skills", to: "/admin/skills", icon: Zap },
      { label: "CV", to: "/admin/cv", icon: FileText },
      { label: "Chat", to: "/admin/chat", icon: MessageSquare },
      { label: "Messages", to: "/admin/messages", icon: Mail },
      { label: "Site", to: "/admin/site", icon: Settings2 },
      { label: "Settings", to: "/admin/settings", icon: Settings }
    ];
    const notif = useAdminNotifications();
    function unreadFor(itemTo) {
      if (itemTo === "/admin/chat") return notif.chatUnread;
      if (itemTo === "/admin/messages") return notif.messageUnread;
      return 0;
    }
    const sidebarOpen = ref(false);
    function closeSidebar() {
      sidebarOpen.value = false;
    }
    watch(() => route.fullPath, () => closeSidebar());
    watch(sidebarOpen, (open) => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_ScrollProgress = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NotificationBell = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen bg-bg" }, _attrs))} data-v-85777db4>`);
      _push(ssrRenderComponent(_component_ScrollProgress, null, null, _parent));
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" aria-hidden="true" data-v-85777db4></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([unref(sidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0", "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-bg-alt transition-transform duration-300"])}" aria-label="Navigasi admin" data-v-85777db4><div class="flex h-[76px] items-center gap-2.5 border-b border-border px-6" data-v-85777db4>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "flex items-center gap-2.5",
        onClick: closeSidebar
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="CehaDev" class="h-9 w-9 rounded-lg object-cover" data-v-85777db4${_scopeId}><div class="leading-tight" data-v-85777db4${_scopeId}><p class="text-base font-extrabold tracking-tight" data-v-85777db4${_scopeId}><span class="text-text" data-v-85777db4${_scopeId}>Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent" data-v-85777db4${_scopeId}>Dev</span></p><p class="text-[11px] text-text-muted" data-v-85777db4${_scopeId}>Admin Panel</p></div>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "CehaDev",
                class: "h-9 w-9 rounded-lg object-cover"
              }),
              createVNode("div", { class: "leading-tight" }, [
                createVNode("p", { class: "text-base font-extrabold tracking-tight" }, [
                  createVNode("span", { class: "text-text" }, "Ceha"),
                  createVNode("span", { class: "bg-gradient-brand bg-clip-text text-transparent" }, "Dev")
                ]),
                createVNode("p", { class: "text-[11px] text-text-muted" }, "Admin Panel")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:hidden" aria-label="Tutup menu" data-v-85777db4>`);
      _push(ssrRenderComponent(unref(X), {
        size: 18,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</button></div><nav class="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label="Navigasi admin" data-v-85777db4><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: ["flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors", unref(route).path === item.to ? "bg-gradient-brand text-white shadow-btn-glow" : "text-text-secondary hover:bg-card hover:text-text"],
          onClick: closeSidebar
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                size: 17,
                "stroke-width": 1.75
              }, null), _parent2, _scopeId);
              _push2(` ${ssrInterpolate(item.label)} `);
              if (unreadFor(item.to) > 0) {
                _push2(`<span class="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white" aria-hidden="true" data-v-85777db4${_scopeId}>${ssrInterpolate(unreadFor(item.to) > 9 ? "9+" : unreadFor(item.to))}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                  size: 17,
                  "stroke-width": 1.75
                })),
                createTextVNode(" " + toDisplayString(item.label) + " ", 1),
                unreadFor(item.to) > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white",
                  "aria-hidden": "true"
                }, toDisplayString(unreadFor(item.to) > 9 ? "9+" : unreadFor(item.to)), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="border-t border-border p-4" data-v-85777db4>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "mb-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-card hover:text-text",
        onClick: closeSidebar
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), {
              size: 16,
              "stroke-width": 1.75
            }, null, _parent2, _scopeId));
            _push2(` Lihat Website `);
          } else {
            return [
              createVNode(unref(ArrowLeft), {
                size: 16,
                "stroke-width": 1.75
              }),
              createTextVNode(" Lihat Website ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-card hover:text-text" data-v-85777db4>`);
      _push(ssrRenderComponent(unref(LogOut), {
        size: 16,
        "stroke-width": 1.75
      }, null, _parent));
      _push(` Logout </button></div></aside><div class="ml-0 flex-1 lg:ml-64" data-v-85777db4><header class="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md" data-v-85777db4><div class="flex h-[76px] items-center justify-between gap-3 px-4 sm:px-8" data-v-85777db4><div class="flex min-w-0 items-center gap-3" data-v-85777db4><button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:hidden" aria-label="Buka menu navigasi" data-v-85777db4>`);
      _push(ssrRenderComponent(unref(Menu), {
        size: 19,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`</button><h1 class="truncate text-base font-bold text-text sm:text-lg" data-v-85777db4>${ssrInterpolate((_a = unref(route).meta.adminTitle) != null ? _a : "Admin")}</h1></div><div class="flex shrink-0 items-center gap-3" data-v-85777db4>`);
      _push(ssrRenderComponent(_component_NotificationBell, null, null, _parent));
      _push(`<span class="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success" data-v-85777db4><span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" data-v-85777db4></span> Online </span></div></div></header><main class="p-4 sm:p-6 lg:p-8" data-v-85777db4>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-85777db4"]]);

export { admin as default };
//# sourceMappingURL=admin-CrSnS-CA.mjs.map
