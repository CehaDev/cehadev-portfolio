import { _ as __nuxt_component_0 } from './nuxt-link-Cvz8sa0r.mjs';
import { _ as _sfc_main$9 } from './TechBadge-CFNCzhp8.mjs';
import { _ as _sfc_main$a } from './Reveal-B94-pL53.mjs';
import { _ as _sfc_main$b } from './ProjectThumb-BmgOVLSh.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, resolveDynamicComponent, openBlock, createBlock, watch, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Monitor, Calendar, Clock3, FolderKanban, ArrowLeft, Star, Eye, Play, ExternalLink, Github, Bug, Rocket, PenTool, ClipboardList, Code2, Activity, FolderCheck, Users, Bell, ShieldCheck, MessageSquare, LayoutDashboard, Search, Smartphone, RotateCcw, Minimize2, Maximize2, ShoppingCart, Plus, X, Minus, Trash2, CheckCircle2, User, ListTodo, BarChart3, Check, KeyRound, LogOut, Lock, Send, Terminal, Cpu, Timer, ChevronLeft, ChevronRight, AlertCircle, PanelLeft, PanelLeftClose, FolderOpen, Folder, FileCode2, LoaderCircle, Globe, Copy } from 'lucide-vue-next';
import { u as useRoute, g as createError, _ as _export_sfc } from './server.mjs';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import langJavascript from 'shiki/dist/langs/javascript.mjs';
import langTypeScript from 'shiki/dist/langs/typescript.mjs';
import langPython from 'shiki/dist/langs/python.mjs';
import langPhp from 'shiki/dist/langs/php.mjs';
import langSql from 'shiki/dist/langs/sql.mjs';
import langBash from 'shiki/dist/langs/bash.mjs';
import langJson from 'shiki/dist/langs/json.mjs';
import langHtml from 'shiki/dist/langs/html.mjs';
import langCss from 'shiki/dist/langs/css.mjs';
import langJava from 'shiki/dist/langs/java.mjs';
import langGo from 'shiki/dist/langs/go.mjs';
import langRust from 'shiki/dist/langs/rust.mjs';
import langRuby from 'shiki/dist/langs/ruby.mjs';
import langDart from 'shiki/dist/langs/dart.mjs';
import langYaml from 'shiki/dist/langs/yaml.mjs';
import langMarkdown from 'shiki/dist/langs/markdown.mjs';
import langGithubDark from 'shiki/dist/themes/github-dark.mjs';
import { c as codeLangClass, a as codeLangLabel } from './demoCode-DHLAJk19.mjs';
import { d as useProjectsContent, a as useSiteSettings } from './useContentData-B9bxi5bI.mjs';
import { t as techIcons } from './useSkills-YG6FZoMb.mjs';
import { u as useStats } from './useStats-Dk9h29Wa.mjs';
import { u as useI18n } from './useI18n-Djb0t6ty.mjs';
import { u as useSeoMeta } from './v3-C1_XsqpX.mjs';
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
import './localize-vezARIz8.mjs';
import './ssr-DMxvrB_f.mjs';
import './asyncData-I2BNYYXU.mjs';
import 'perfect-debounce';

function loadDemo(key, fallback) {
  return fallback;
}
function saveDemo(key, value) {
  return;
}
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "DemoStore",
  __ssrInlineRender: true,
  props: {
    storageKey: {}
  },
  setup(__props) {
    const props = __props;
    const products = [
      { id: 1, name: "Kopi Arabika Premium 250g", price: 65e3, cat: "Minuman", emoji: "\u2615", rating: 4.8, sold: 320 },
      { id: 2, name: "Headset Wireless Pro", price: 249e3, cat: "Elektronik", emoji: "\u{1F3A7}", rating: 4.6, sold: 145 },
      { id: 3, name: "Tumbler Stainless 1L", price: 129e3, cat: "Rumah Tangga", emoji: "\u{1F964}", rating: 4.9, sold: 210 },
      { id: 4, name: "Mechanical Keyboard 87", price: 899e3, cat: "Elektronik", emoji: "\u2328\uFE0F", rating: 4.7, sold: 88 },
      { id: 5, name: 'Tas Laptop 15" Anti Air', price: 175e3, cat: "Fashion", emoji: "\u{1F392}", rating: 4.5, sold: 96 },
      { id: 6, name: "Smart Watch Fitnes", price: 459e3, cat: "Elektronik", emoji: "\u231A", rating: 4.4, sold: 152 },
      { id: 7, name: "Sneaker Urban White", price: 389e3, cat: "Fashion", emoji: "\u{1F45F}", rating: 4.6, sold: 67 },
      { id: 8, name: "Lampu Meja LED Dimmable", price: 85e3, cat: "Rumah Tangga", emoji: "\u{1F4A1}", rating: 4.7, sold: 178 }
    ];
    const storageKey = props.storageKey || "cehadev-demo-store";
    const cart = ref(loadDemo(storageKey, []));
    watch(cart, (v) => saveDemo(), { deep: true });
    const query = ref("");
    const activeCat = ref("Semua");
    const categories = computed(() => ["Semua", ...Array.from(new Set(products.map((p) => p.cat)))]);
    const filtered = computed(
      () => products.filter(
        (p) => (activeCat.value === "Semua" || p.cat === activeCat.value) && p.name.toLowerCase().includes(query.value.trim().toLowerCase())
      )
    );
    const cartOpen = ref(false);
    const checkoutOpen = ref(false);
    const done = ref(false);
    const orderNo = ref("");
    const form = reactive({ name: "", address: "", payment: "Transfer Bank" });
    const cartCount = computed(() => cart.value.reduce((n, l) => n + l.qty, 0));
    const cartTotal = computed(
      () => cart.value.reduce((sum, l) => {
        const p = products.find((x) => x.id === l.id);
        return sum + (p ? p.price * l.qty : 0);
      }, 0)
    );
    const cartLines = computed(
      () => cart.value.map((l) => ({ ...l, product: products.find((p) => p.id === l.id) })).filter((l) => l.product)
    );
    function formatRp(n) {
      return "Rp" + n.toLocaleString("id-ID");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative flex h-full min-h-[540px] flex-col bg-bg text-text" }, _attrs))}><header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3"><div class="flex items-center gap-2"><span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">CS</span><div class="leading-tight"><p class="text-sm font-extrabold tracking-tight">Cehava Store</p><p class="text-[10px] text-text-muted">Belanja mulus &amp; cepat</p></div></div><button type="button" class="relative inline-flex items-center gap-1.5 rounded-btn border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-text">`);
      _push(ssrRenderComponent(unref(ShoppingCart), {
        size: 15,
        "stroke-width": 1.75
      }, null, _parent));
      _push(` Keranjang `);
      if (cartCount.value > 0) {
        _push(`<span class="flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-brand px-1 text-[10px] font-bold text-white">${ssrInterpolate(cartCount.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></header><div class="flex-1 overflow-y-auto p-4"><div class="relative">`);
      _push(ssrRenderComponent(unref(Search), {
        size: 14,
        "stroke-width": 1.75,
        class: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", query.value)} type="text" class="input-field !rounded-full !py-2.5 !pl-9 !text-xs" placeholder="Cari produk..."></div><div class="mt-3 flex gap-2 overflow-x-auto pb-1"><!--[-->`);
      ssrRenderList(categories.value, (c) => {
        _push(`<button type="button" class="${ssrRenderClass([activeCat.value === c ? "border-transparent bg-gradient-brand text-white" : "border-border bg-card text-text-secondary hover:text-text", "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"])}">${ssrInterpolate(c)}</button>`);
      });
      _push(`<!--]--></div><p class="mt-4 text-[11px] font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(filtered.value.length)} produk </p><div class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(filtered.value, (p) => {
        _push(`<div class="flex flex-col rounded-card border border-border bg-card p-3"><span class="flex h-20 items-center justify-center rounded-lg bg-bg-alt text-4xl" aria-hidden="true">${ssrInterpolate(p.emoji)}</span><p class="mt-2 line-clamp-2 min-h-[2.4em] text-xs font-semibold leading-tight text-text">${ssrInterpolate(p.name)}</p><p class="mt-1 text-xs font-bold text-primary">${ssrInterpolate(formatRp(p.price))}</p><div class="mt-0.5 flex items-center gap-1 text-[10px] text-text-muted">`);
        _push(ssrRenderComponent(unref(Star), {
          size: 10,
          "stroke-width": 1.5,
          class: "fill-amber-400 text-amber-400"
        }, null, _parent));
        _push(`<span class="font-semibold text-text-secondary">${ssrInterpolate(p.rating)}</span><span>\u2022 ${ssrInterpolate(p.sold)} terjual</span></div><button type="button" class="mt-2.5 inline-flex items-center justify-center gap-1 rounded-btn border border-primary/40 bg-primary/10 px-2 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20">`);
        _push(ssrRenderComponent(unref(Plus), {
          size: 12,
          "stroke-width": 2
        }, null, _parent));
        _push(` Tambah </button></div>`);
      });
      _push(`<!--]--></div>`);
      if (!filtered.value.length) {
        _push(`<p class="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted"> Produk tidak ditemukan. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (cartOpen.value) {
        _push(`<div class="absolute inset-0 z-20 bg-black/50" role="presentation"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (cartOpen.value) {
        _push(`<aside class="absolute inset-y-0 right-0 z-30 flex w-full max-w-xs flex-col border-l border-border bg-card" role="dialog" aria-label="Keranjang belanja"><div class="flex items-center justify-between border-b border-border px-4 py-3"><p class="text-sm font-bold text-text">Keranjang</p><button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:text-text" aria-label="Tutup keranjang">`);
        _push(ssrRenderComponent(unref(X), {
          size: 16,
          "stroke-width": 1.75
        }, null, _parent));
        _push(`</button></div><div class="flex-1 overflow-y-auto p-4"><!--[-->`);
        ssrRenderList(cartLines.value, (l) => {
          _push(`<div class="flex items-center gap-3 rounded-lg border border-border bg-bg p-2.5"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-lg" aria-hidden="true">${ssrInterpolate(l.product.emoji)}</span><div class="min-w-0 flex-1"><p class="truncate text-xs font-semibold text-text">${ssrInterpolate(l.product.name)}</p><p class="mt-0.5 text-[11px] font-bold text-primary">${ssrInterpolate(formatRp(l.product.price * l.qty))}</p></div><div class="flex items-center gap-1"><button type="button" class="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:text-text"${ssrRenderAttr("aria-label", `Kurangi ${l.product.name}`)}>`);
          _push(ssrRenderComponent(unref(Minus), {
            size: 11,
            "stroke-width": 2
          }, null, _parent));
          _push(`</button><span class="w-6 text-center text-xs font-bold text-text">${ssrInterpolate(l.qty)}</span><button type="button" class="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:text-text"${ssrRenderAttr("aria-label", `Tambah ${l.product.name}`)}>`);
          _push(ssrRenderComponent(unref(Plus), {
            size: 11,
            "stroke-width": 2
          }, null, _parent));
          _push(`</button><button type="button" class="ml-1 rounded-md p-1 text-red-400 hover:bg-red-500/10"${ssrRenderAttr("aria-label", `Hapus ${l.product.name}`)}>`);
          _push(ssrRenderComponent(unref(Trash2), {
            size: 13,
            "stroke-width": 1.5
          }, null, _parent));
          _push(`</button></div></div>`);
        });
        _push(`<!--]-->`);
        if (!cartLines.value.length) {
          _push(`<p class="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted"> Keranjang kosong. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="border-t border-border p-4"><div class="flex items-center justify-between text-sm"><span class="text-text-secondary">Total</span><span class="text-base font-extrabold text-text">${ssrInterpolate(formatRp(cartTotal.value))}</span></div><button type="button"${ssrIncludeBooleanAttr(!cartLines.value.length) ? " disabled" : ""} class="${ssrRenderClass([!cartLines.value.length ? "pointer-events-none opacity-40" : "", "btn-primary mt-3 w-full !py-2.5 text-xs"])}"> Checkout </button></div></aside>`);
      } else {
        _push(`<!---->`);
      }
      if (checkoutOpen.value) {
        _push(`<div class="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Checkout"><div class="w-full max-w-sm rounded-card border border-border bg-card p-5 shadow-card"><div class="flex items-center justify-between"><p class="text-sm font-bold text-text">Detail Pengiriman</p><button type="button" class="rounded-md p-1 text-text-muted hover:text-text" aria-label="Tutup checkout">`);
        _push(ssrRenderComponent(unref(X), {
          size: 15,
          "stroke-width": 1.75
        }, null, _parent));
        _push(`</button></div><div class="mt-4 space-y-3"><div><label for="demo-checkout-name" class="mb-1 block text-[11px] font-medium text-text-muted">Nama Penerima</label><input id="demo-checkout-name"${ssrRenderAttr("value", form.name)} type="text" class="input-field !py-2 text-xs" placeholder="Nama lengkap"></div><div><label for="demo-checkout-addr" class="mb-1 block text-[11px] font-medium text-text-muted">Alamat</label><textarea id="demo-checkout-addr" rows="2" class="input-field !py-2 text-xs" placeholder="Alamat lengkap">${ssrInterpolate(form.address)}</textarea></div><div><label for="demo-checkout-pay" class="mb-1 block text-[11px] font-medium text-text-muted">Metode Pembayaran</label><select id="demo-checkout-pay" class="input-field !py-2 text-xs"><option${ssrIncludeBooleanAttr(Array.isArray(form.payment) ? ssrLooseContain(form.payment, null) : ssrLooseEqual(form.payment, null)) ? " selected" : ""}>Transfer Bank</option><option${ssrIncludeBooleanAttr(Array.isArray(form.payment) ? ssrLooseContain(form.payment, null) : ssrLooseEqual(form.payment, null)) ? " selected" : ""}>E-Wallet</option><option${ssrIncludeBooleanAttr(Array.isArray(form.payment) ? ssrLooseContain(form.payment, null) : ssrLooseEqual(form.payment, null)) ? " selected" : ""}>COD</option></select></div></div><div class="mt-4 flex items-center justify-between text-xs"><span class="text-text-muted">Total bayar</span><span class="text-sm font-extrabold text-primary">${ssrInterpolate(formatRp(cartTotal.value))}</span></div><div class="mt-4 flex gap-2"><button type="button" class="btn-outline flex-1 !py-2 text-xs">Batal</button><button type="button"${ssrIncludeBooleanAttr(!form.name.trim() || !form.address.trim()) ? " disabled" : ""} class="${ssrRenderClass([!form.name.trim() || !form.address.trim() ? "pointer-events-none opacity-40" : "", "btn-primary flex-1 !py-2 text-xs"])}"> Bayar Sekarang </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (done.value) {
        _push(`<div class="absolute inset-x-4 top-4 z-50 flex items-start gap-3 rounded-card border border-success/40 bg-success/10 p-4 shadow-card" role="status">`);
        _push(ssrRenderComponent(unref(CheckCircle2), {
          size: 18,
          "stroke-width": 1.75,
          class: "shrink-0 text-success"
        }, null, _parent));
        _push(`<div class="min-w-0"><p class="text-sm font-bold text-text">Pesanan berhasil dibuat!</p><p class="mt-0.5 text-xs text-text-secondary">Nomor pesanan: <span class="font-semibold text-text">${ssrInterpolate(orderNo.value)}</span> \u2014 ini demo, tidak ada pembayaran sungguhan.</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoStore.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "DemoKanban",
  __ssrInlineRender: true,
  props: {
    storageKey: {}
  },
  setup(__props) {
    const props = __props;
    const members = [
      { initials: "CD", color: "#8B5CF6" },
      { initials: "AR", color: "#F59E0B" },
      { initials: "DS", color: "#22C55E" },
      { initials: "NF", color: "#3B82F6" }
    ];
    const columns = [
      { id: "backlog", title: "Backlog", color: "#8B5CF6" },
      { id: "progress", title: "In Progress", color: "#F59E0B" },
      { id: "done", title: "Done", color: "#22C55E" }
    ];
    const priorityMeta = {
      tinggi: { label: "Tinggi", color: "#F43F5E" },
      sedang: { label: "Sedang", color: "#F59E0B" },
      rendah: { label: "Rendah", color: "#22C55E" }
    };
    const seed = [
      { id: 1, title: "Desain halaman landing baru", priority: "tinggi", col: "backlog", assignee: 0 },
      { id: 2, title: "Perbaiki bug filter produk", priority: "sedang", col: "backlog", assignee: 1 },
      { id: 3, title: "Integrasi notifikasi email", priority: "tinggi", col: "progress", assignee: 2 },
      { id: 4, title: "Optimasi query dashboard", priority: "sedang", col: "progress", assignee: 0 },
      { id: 5, title: "Setup CI/CD otomatis", priority: "rendah", col: "done", assignee: 3 },
      { id: 6, title: "Review keamanan autentikasi", priority: "tinggi", col: "done", assignee: 1 }
    ];
    const storageKey = props.storageKey || "cehadev-demo-kanban";
    const tasks = ref(loadDemo(storageKey, seed));
    watch(tasks, (v) => saveDemo(), { deep: true });
    const showForm = ref(false);
    const newTitle = ref("");
    const newPriority = ref("sedang");
    Math.max(...tasks.value.map((t) => t.id), 0) + 1;
    function tasksOf(col) {
      return tasks.value.filter((t) => t.col === col);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full min-h-[540px] flex-col bg-bg text-text" }, _attrs))}><header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3"><div class="flex min-w-0 items-center gap-2.5"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">MG</span><div class="min-w-0 leading-tight"><p class="truncate text-sm font-extrabold tracking-tight">Magerans \u2014 Sprint Board</p><p class="flex items-center gap-1.5 text-[10px] text-text-muted"><span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden="true"></span> Kolaborasi tim real-time </p></div></div><div class="flex shrink-0 items-center gap-2"><div class="hidden items-center sm:flex" aria-hidden="true"><!--[-->`);
      ssrRenderList(members, (m, i) => {
        _push(`<span class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white" style="${ssrRenderStyle({ backgroundColor: m.color, zIndex: 4 - i, marginLeft: i ? "-6px" : "0" })}">${ssrInterpolate(m.initials)}</span>`);
      });
      _push(`<!--]--></div><button type="button" class="inline-flex items-center gap-1.5 rounded-btn border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">`);
      _push(ssrRenderComponent(unref(Plus), {
        size: 14,
        "stroke-width": 2
      }, null, _parent));
      _push(` Tugas </button></div></header>`);
      if (showForm.value) {
        _push(`<form class="border-b border-border bg-card px-4 py-3"><div class="flex flex-wrap items-center gap-2"><input${ssrRenderAttr("value", newTitle.value)} type="text" class="input-field min-w-0 flex-1 !py-2 text-xs" placeholder="Judul tugas baru..."><div class="flex items-center gap-1 rounded-btn border border-border bg-bg p-1"><!--[-->`);
        ssrRenderList(priorityMeta, (m, key) => {
          _push(`<button type="button" class="${ssrRenderClass([newPriority.value === key ? "text-white" : "text-text-secondary hover:text-text", "rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors"])}" style="${ssrRenderStyle(newPriority.value === key ? { backgroundColor: m.color } : {})}">${ssrInterpolate(m.label)}</button>`);
        });
        _push(`<!--]--></div><button type="submit" class="btn-primary !px-4 !py-2 text-xs">Tambah</button><button type="button" class="btn-outline !px-4 !py-2 text-xs">Batal</button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-1 items-stretch gap-4 overflow-x-auto p-4"><!--[-->`);
      ssrRenderList(columns, (col) => {
        _push(`<div class="flex w-64 shrink-0 flex-col rounded-card border border-border bg-card-alt/60"><div class="flex items-center justify-between border-b border-border px-3 py-2.5"><p class="flex items-center gap-2 text-xs font-bold text-text"><span class="h-2 w-2 rounded-full" style="${ssrRenderStyle({ backgroundColor: col.color })}" aria-hidden="true"></span> ${ssrInterpolate(col.title)}</p><span class="rounded-full bg-bg px-2 py-0.5 text-[10px] font-bold text-text-muted">${ssrInterpolate(tasksOf(col.id).length)}</span></div><div class="flex-1 space-y-2.5 overflow-y-auto p-3"><!--[-->`);
        ssrRenderList(tasksOf(col.id), (t) => {
          _push(`<div class="group rounded-lg border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-card-hover"><div class="flex items-start justify-between gap-2"><p class="text-xs font-semibold leading-snug text-text">${ssrInterpolate(t.title)}</p><button type="button" class="rounded-md p-1 text-text-muted opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"${ssrRenderAttr("aria-label", `Hapus ${t.title}`)}>`);
          _push(ssrRenderComponent(unref(Trash2), {
            size: 13,
            "stroke-width": 1.5
          }, null, _parent));
          _push(`</button></div><div class="mt-2.5 flex items-center justify-between gap-2"><div class="flex items-center gap-1.5"><span class="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide" style="${ssrRenderStyle({ backgroundColor: priorityMeta[t.priority].color + "22", color: priorityMeta[t.priority].color })}">${ssrInterpolate(priorityMeta[t.priority].label)}</span><span class="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style="${ssrRenderStyle({ backgroundColor: members[t.assignee].color })}"${ssrRenderAttr("title", `Anggota ${members[t.assignee].initials}`)}>${ssrInterpolate(members[t.assignee].initials)}</span></div><div class="flex items-center gap-0.5"><button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:text-text disabled:opacity-30"${ssrIncludeBooleanAttr(columns.findIndex((c) => c.id === t.col) === 0) ? " disabled" : ""}${ssrRenderAttr("aria-label", `Pindah ${t.title} ke kiri`)}>`);
          _push(ssrRenderComponent(unref(ChevronLeft), {
            size: 14,
            "stroke-width": 2
          }, null, _parent));
          _push(`</button><button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:text-text disabled:opacity-30"${ssrIncludeBooleanAttr(columns.findIndex((c) => c.id === t.col) === columns.length - 1) ? " disabled" : ""}${ssrRenderAttr("aria-label", `Pindah ${t.title} ke kanan`)}>`);
          _push(ssrRenderComponent(unref(ChevronRight), {
            size: 14,
            "stroke-width": 2
          }, null, _parent));
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]-->`);
        if (!tasksOf(col.id).length) {
          _push(`<p class="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-text-muted"> Kosong </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--><div class="flex w-56 shrink-0 items-center justify-center rounded-card border border-dashed border-border text-center"><div>`);
      _push(ssrRenderComponent(unref(MessageSquare), {
        size: 22,
        "stroke-width": 1.5,
        class: "mx-auto text-text-muted"
      }, null, _parent));
      _push(`<p class="mt-2 text-xs font-semibold text-text-secondary">Diskusi tim</p><p class="mt-1 px-4 text-[11px] text-text-muted">Chat &amp; komentar tersedia di aplikasi penuh.</p></div></div></div></div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoKanban.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const W = 400;
const H = 130;
const PAD = 10;
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "DemoDashboard",
  __ssrInlineRender: true,
  props: {
    storageKey: {}
  },
  setup(__props) {
    const metrics = reactive({ uptime: 99.92, reqs: 342, errors: 0.42, latency: 88 });
    const kpis = computed(() => [
      { label: "Uptime", value: metrics.uptime.toFixed(2) + "%", sub: "30 hari terakhir", icon: ShieldCheck, color: "#22C55E" },
      { label: "Request / detik", value: String(metrics.reqs), sub: "rata-rata per menit", icon: Activity, color: "#3B82F6" },
      { label: "Error rate", value: metrics.errors.toFixed(2) + "%", sub: "dari total request", icon: Cpu, color: "#F43F5E" },
      { label: "p95 latency", value: metrics.latency + "ms", sub: "waktu respons", icon: Timer, color: "#F59E0B" }
    ]);
    const chart = Array.from({ length: 24 }, (_, i) => ({
      label: String(i).padStart(2, "0") + ":00",
      value: 55 + Math.round(Math.random() * 95)
    }));
    const maxV = Math.max(...chart.map((p) => p.value)) * 1.15;
    const pts = chart.map((p, i) => ({
      x: PAD + (W - PAD * 2) * i / (chart.length - 1),
      y: H - PAD - p.value / maxV * (H - PAD * 2)
    }));
    const linePath = "M" + pts.map((p) => `${p.x} ${p.y}`).join(" L ");
    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;
    const barData = [
      { day: "Sen", value: 210 },
      { day: "Sel", value: 265 },
      { day: "Rab", value: 240 },
      { day: "Kam", value: 320 },
      { day: "Jum", value: 290 },
      { day: "Sab", value: 180 },
      { day: "Min", value: 140 }
    ];
    const maxBar = Math.max(...barData.map((b) => b.value)) * 1.15;
    const sampleLogs = [
      { time: "10:42:13", level: "info", msg: "GET /api/events \u2192 200 \xB7 38ms" },
      { time: "10:42:09", level: "warn", msg: "Latensi tinggi: /api/search \u2192 1.2s" },
      { time: "10:41:55", level: "info", msg: "WS terhubung client=db-7" },
      { time: "10:41:30", level: "error", msg: "Timeout query: orders#index" },
      { time: "10:41:12", level: "info", msg: "Cache hit rate 94.2%" },
      { time: "10:40:58", level: "info", msg: "Deploy rilis v2.4.1 selesai" },
      { time: "10:40:41", level: "warn", msg: "Penggunaan memori 78% dari limit" },
      { time: "10:40:25", level: "info", msg: "POST /api/auth/login \u2192 201 \xB7 52ms" },
      { time: "10:39:57", level: "error", msg: "Retry bank API: pembayaran #8812" },
      { time: "10:39:33", level: "info", msg: "Cron harian: laporan terjadwal" }
    ];
    const levelColor = { info: "#3B82F6", warn: "#F59E0B", error: "#F43F5E" };
    const levelLabel = { info: "INFO", warn: "WARN", error: "ERROR" };
    const logFilter = ref("all");
    const filteredLogs = computed(
      () => logFilter.value === "all" ? sampleLogs : sampleLogs.filter((l) => l.level === logFilter.value)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full min-h-[540px] flex-col bg-bg text-text" }, _attrs))}><header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3"><div class="flex items-center gap-2.5"><span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">DB</span><div class="leading-tight"><p class="text-sm font-extrabold tracking-tight">DevBoard</p><p class="text-[10px] text-text-muted">Production \xB7 v2.4.1</p></div></div><span class="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success"><span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden="true"></span> LIVE </span></header><div class="flex-1 overflow-y-auto p-4"><div class="grid grid-cols-2 gap-3 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(kpis.value, (k) => {
        _push(`<div class="rounded-card border border-border bg-card p-4"><div class="flex items-center justify-between"><p class="text-[11px] font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(k.label)}</p><span class="flex h-7 w-7 items-center justify-center rounded-lg" style="${ssrRenderStyle({ backgroundColor: k.color + "22", color: k.color })}" aria-hidden="true">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(k.icon), {
          size: 14,
          "stroke-width": 1.75
        }, null), _parent);
        _push(`</span></div><p class="mt-2 text-2xl font-extrabold tracking-tight text-text">${ssrInterpolate(k.value)}</p><p class="mt-0.5 text-[11px] text-text-muted">${ssrInterpolate(k.sub)}</p></div>`);
      });
      _push(`<!--]--></div><div class="mt-4 grid gap-4 lg:grid-cols-3"><div class="rounded-card border border-border bg-card p-4 lg:col-span-2"><div class="flex items-center justify-between"><p class="text-xs font-bold text-text">Request / Jam</p><span class="text-[10px] text-text-muted">24 jam terakhir</span></div><svg viewBox="0 0 400 130" class="mt-3 w-full" role="img" aria-label="Grafik request per jam"><defs><linearGradient id="demo-dash-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35"></stop><stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.02"></stop></linearGradient></defs><path${ssrRenderAttr("d", areaPath)} fill="url(#demo-dash-fill)"></path><path${ssrRenderAttr("d", linePath)} fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path><!--[-->`);
      ssrRenderList(unref(pts), (p, i) => {
        _push(`<g><circle${ssrRenderAttr("cx", p.x)}${ssrRenderAttr("cy", p.y)} r="2" fill="#3B82F6"></circle></g>`);
      });
      _push(`<!--]--></svg></div><div class="rounded-card border border-border bg-card p-4"><p class="text-xs font-bold text-text">Traffic Mingguan</p><div class="mt-4 flex h-32 items-end justify-between gap-2"><!--[-->`);
      ssrRenderList(barData, (b) => {
        _push(`<div class="flex flex-1 flex-col items-center gap-1.5"><div class="flex w-full flex-1 items-end rounded-md bg-bg-alt"><div class="w-full rounded-md bg-gradient-to-t from-primary-violet to-primary-blue" style="${ssrRenderStyle({ height: b.value / maxBar * 100 + "%" })}"></div></div><span class="text-[9px] font-medium text-text-muted">${ssrInterpolate(b.day)}</span></div>`);
      });
      _push(`<!--]--></div></div></div><div class="mt-4 overflow-hidden rounded-card border border-border bg-card"><div class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3"><p class="flex items-center gap-2 text-xs font-bold text-text">`);
      _push(ssrRenderComponent(unref(Terminal), {
        size: 14,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` System Logs <span class="flex items-center gap-1 text-[10px] font-medium text-text-muted">`);
      _push(ssrRenderComponent(unref(Bell), {
        size: 11,
        "stroke-width": 1.5
      }, null, _parent));
      _push(` streaming </span></p><div class="flex gap-1"><!--[-->`);
      ssrRenderList(["all", "info", "warn", "error"], (f) => {
        _push(`<button type="button" class="${ssrRenderClass([logFilter.value === f ? "bg-bg-alt text-text" : "text-text-muted hover:text-text", "rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors"])}">${ssrInterpolate(f)}</button>`);
      });
      _push(`<!--]--></div></div><ul class="max-h-44 divide-y divide-border/60 overflow-y-auto"><!--[-->`);
      ssrRenderList(filteredLogs.value, (l, i) => {
        _push(`<li class="flex items-center gap-2.5 px-4 py-2 text-[11px]"><span class="shrink-0 font-mono text-text-muted">${ssrInterpolate(l.time)}</span><span class="w-11 shrink-0 rounded px-1.5 py-0.5 text-center text-[9px] font-bold" style="${ssrRenderStyle({ backgroundColor: levelColor[l.level] + "1f", color: levelColor[l.level] })}">${ssrInterpolate(levelLabel[l.level])}</span><span class="truncate font-mono text-text-secondary">${ssrInterpolate(l.msg)}</span></li>`);
      });
      _push(`<!--]-->`);
      if (!filteredLogs.value.length) {
        _push(`<li class="px-4 py-6 text-center text-[11px] text-text-muted"> Tidak ada log dengan level ini. </li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul></div></div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoDashboard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "DemoApi",
  __ssrInlineRender: true,
  props: {
    storageKey: {}
  },
  setup(__props) {
    const endpoints = [
      {
        id: "login",
        method: "POST",
        path: "/api/v1/auth/login",
        desc: "Login dan dapatkan JWT token",
        params: [
          { key: "email", label: "email", def: "user@example.com" },
          { key: "password", label: "password", def: "secret123" }
        ],
        status: 200,
        res: {
          success: true,
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU1MDEyMDAwfQ._demo",
          user: { id: 1, name: "CehaDev", email: "user@example.com", role: "admin" }
        }
      },
      {
        id: "users",
        method: "GET",
        path: "/api/v1/users",
        desc: "Daftar user (pagination)",
        params: [{ key: "limit", label: "limit", def: "10" }],
        status: 200,
        res: {
          success: true,
          data: [
            { id: 1, name: "CehaDev", email: "cehadev@example.com", role: "admin" },
            { id: 2, name: "Ari Wibowo", email: "ari@example.com", role: "user" },
            { id: 3, name: "Nanda Fajar", email: "nanda@example.com", role: "user" }
          ],
          meta: { total: 3, limit: 10, page: 1 }
        }
      },
      {
        id: "products",
        method: "GET",
        path: "/api/v1/products",
        desc: "Katalog produk",
        params: [
          { key: "category", label: "category", def: "" },
          { key: "sort", label: "sort", def: "popular" }
        ],
        status: 200,
        res: {
          success: true,
          data: [
            { id: 101, name: "Kopi Arabika Premium", price: 65e3, stock: 24 },
            { id: 102, name: "Headset Wireless Pro", price: 249e3, stock: 9 },
            { id: 103, name: "Mechanical Keyboard 87", price: 899e3, stock: 3 }
          ]
        }
      },
      {
        id: "orders",
        method: "POST",
        path: "/api/v1/orders",
        desc: "Buat pesanan (butuh token)",
        params: [
          { key: "productId", label: "productId", def: "102" },
          { key: "qty", label: "qty", def: "1" }
        ],
        status: 201,
        auth: true,
        res: {
          success: true,
          data: { orderId: "ORD-88123", total: 249e3, status: "PAID", eta: "2-3 hari" }
        }
      },
      {
        id: "stats",
        method: "GET",
        path: "/api/v1/stats/overview",
        desc: "Ringkasan metrik API",
        params: [{ key: "range", label: "range", def: "7d" }],
        status: 200,
        auth: true,
        res: {
          success: true,
          data: {
            requests: 48201,
            avgLatency: 186,
            errorRate: 0.42,
            topEndpoints: ["/api/v1/products", "/api/v1/users", "/api/v1/auth/login"]
          }
        }
      }
    ];
    const methodColor = { GET: "#22C55E", POST: "#F59E0B" };
    const activeIdx = ref(0);
    const params = reactive({});
    const token = ref(null);
    const sending = ref(false);
    const response = ref(null);
    const status = ref(null);
    const latency = ref(null);
    const active = computed(() => endpoints[activeIdx.value]);
    const queryString = computed(() => {
      const qs = Object.entries(params).filter(([, v]) => v.trim() !== "").map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
      return qs ? "?" + qs : "";
    });
    const displayUrl = computed(() => active.value.path + (active.value.method === "GET" ? queryString.value : ""));
    const bodyText = computed(() => {
      var _a;
      if (active.value.method === "POST") {
        const body = {};
        for (const p of active.value.params) {
          if ((_a = params[p.key]) == null ? void 0 : _a.trim()) body[p.key] = params[p.key].trim();
        }
        return JSON.stringify(body, null, 2);
      }
      return null;
    });
    const responseText = computed(() => response.value ? JSON.stringify(response.value, null, 2) : null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full min-h-[540px] flex-col bg-bg text-text" }, _attrs))}><header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3"><div class="flex items-center gap-2.5"><span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">NT</span><div class="leading-tight"><p class="text-sm font-extrabold tracking-tight">NuTech API</p><p class="text-[10px] text-text-muted">REST API \xB7 Node.js + TypeScript</p></div></div><div class="flex items-center gap-2">`);
      if (token.value) {
        _push(`<span class="inline-flex max-w-40 items-center gap-1.5 overflow-hidden rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success"${ssrRenderAttr("title", token.value)}>`);
        _push(ssrRenderComponent(unref(KeyRound), {
          size: 11,
          "stroke-width": 2,
          class: "shrink-0"
        }, null, _parent));
        _push(`<span class="truncate">Token aktif</span></span>`);
      } else {
        _push(`<!---->`);
      }
      if (token.value) {
        _push(`<button type="button" class="inline-flex items-center gap-1.5 rounded-btn border border-border bg-bg px-2.5 py-1.5 text-[10px] font-semibold text-text-secondary transition-colors hover:text-red-400">`);
        _push(ssrRenderComponent(unref(LogOut), {
          size: 12,
          "stroke-width": 1.75
        }, null, _parent));
        _push(` Logout </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><div class="flex min-h-0 flex-1 flex-col sm:flex-row"><div class="border-b border-border bg-card-alt/60 sm:w-48 sm:border-b-0 sm:border-r"><div class="flex gap-1 overflow-x-auto p-2 sm:flex-col sm:overflow-y-auto"><!--[-->`);
      ssrRenderList(endpoints, (ep, i) => {
        _push(`<button type="button" class="${ssrRenderClass([activeIdx.value === i ? "bg-card text-text shadow-card" : "text-text-secondary hover:bg-card/60 hover:text-text", "flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors sm:min-w-0"])}"><span class="w-10 shrink-0 rounded px-1 py-0.5 text-center text-[9px] font-bold text-white" style="${ssrRenderStyle({ backgroundColor: methodColor[ep.method] })}">${ssrInterpolate(ep.method)}</span><span class="hidden truncate font-mono text-[11px] sm:block">${ssrInterpolate(ep.path.replace("/api/v1", ""))}</span>`);
        if (ep.auth) {
          _push(ssrRenderComponent(unref(Lock), {
            size: 10,
            "stroke-width": 2,
            class: "shrink-0 text-amber-400"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div><div class="flex-1 overflow-y-auto p-4"><div class="rounded-card border border-border bg-card p-4"><p class="text-[11px] font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(active.value.desc)}</p><div class="mt-2 flex items-center gap-2"><span class="rounded-md px-2 py-1 text-[10px] font-bold text-white" style="${ssrRenderStyle({ backgroundColor: methodColor[active.value.method] })}">${ssrInterpolate(active.value.method)}</span><code class="min-w-0 flex-1 truncate rounded-md bg-bg px-3 py-1.5 font-mono text-[11px] text-text-secondary">${ssrInterpolate(displayUrl.value)}</code></div><div class="mt-3 grid gap-2 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(active.value.params, (p) => {
        _push(`<div><label${ssrRenderAttr("for", `demo-api-${active.value.id}-${p.key}`)} class="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">${ssrInterpolate(p.key)}</label><input${ssrRenderAttr("id", `demo-api-${active.value.id}-${p.key}`)}${ssrRenderAttr("value", params[p.key])} type="text" class="input-field !py-2 font-mono !text-[11px]"${ssrRenderAttr("placeholder", p.def)}></div>`);
      });
      _push(`<!--]--></div>`);
      if (bodyText.value) {
        _push(`<div class="mt-3"><p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">Request Body</p><pre class="overflow-x-auto rounded-md bg-bg p-3 font-mono text-[10px] leading-relaxed text-text-secondary">${ssrInterpolate(bodyText.value)}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="btn-primary mt-4 !px-5 !py-2.5 text-xs"${ssrIncludeBooleanAttr(sending.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(unref(Send), {
        size: 14,
        "stroke-width": 2,
        class: "rotate-180"
      }, null, _parent));
      _push(` ${ssrInterpolate(sending.value ? "Mengirim..." : "Send Request")}</button></div><div class="mt-3 rounded-card border border-border bg-card p-4"><div class="flex flex-wrap items-center justify-between gap-2"><p class="flex items-center gap-2 text-xs font-bold text-text">`);
      _push(ssrRenderComponent(unref(Terminal), {
        size: 14,
        "stroke-width": 1.75,
        class: "text-primary",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Response </p>`);
      if (status.value) {
        _push(`<div class="flex items-center gap-2 text-[10px]"><span class="rounded px-1.5 py-0.5 font-bold" style="${ssrRenderStyle({ backgroundColor: status.value < 400 ? "#22C55E22" : "#F43F5E22", color: status.value < 400 ? "#22C55E" : "#F43F5E" })}">${ssrInterpolate(status.value)}</span>`);
        if (latency.value) {
          _push(`<span class="font-mono text-text-muted">${ssrInterpolate(latency.value)}ms</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (responseText.value) {
        _push(`<pre class="${ssrRenderClass([status.value && status.value >= 400 ? "!text-red-400" : "", "mt-2 overflow-x-auto rounded-md bg-bg p-3 font-mono text-[10px] leading-relaxed text-text-secondary"])}">${ssrInterpolate(responseText.value)}</pre>`);
      } else {
        _push(`<p class="mt-2 rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-text-muted"> Kirim request untuk melihat respons. </p>`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoApi.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "DemoTodo",
  __ssrInlineRender: true,
  props: {
    storageKey: {}
  },
  setup(__props) {
    const props = __props;
    const priorityMeta = {
      tinggi: { label: "Tinggi", color: "#F43F5E" },
      sedang: { label: "Sedang", color: "#F59E0B" },
      rendah: { label: "Rendah", color: "#22C55E" }
    };
    const seed = [
      { id: 1, title: "Rapat sprint mingguan", priority: "sedang", done: false },
      { id: 2, title: "Kirim proposal ke klien", priority: "tinggi", done: false },
      { id: 3, title: "Push update dokumentasi API", priority: "sedang", done: false },
      { id: 4, title: "Review pull request tim", priority: "rendah", done: false },
      { id: 5, title: "Bayar tagihan domain", priority: "tinggi", done: true },
      { id: 6, title: "Buat wireframe landing page", priority: "sedang", done: true }
    ];
    const storageKey = props.storageKey || "cehadev-demo-todo";
    const tasks = ref(loadDemo(storageKey, seed));
    watch(tasks, (v) => saveDemo(), { deep: true });
    const view = ref("tasks");
    const filter = ref("all");
    const newTitle = ref("");
    const newPriority = ref("sedang");
    Math.max(...tasks.value.map((t) => t.id), 0) + 1;
    const visible = computed(() => {
      if (filter.value === "active") return tasks.value.filter((t) => !t.done);
      if (filter.value === "done") return tasks.value.filter((t) => t.done);
      return tasks.value;
    });
    const doneCount = computed(() => tasks.value.filter((t) => t.done).length);
    const progress = computed(() => tasks.value.length ? Math.round(doneCount.value / tasks.value.length * 100) : 0);
    const today = (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full min-h-[540px] flex-col bg-bg text-text" }, _attrs))}><header class="px-4 pb-3 pt-4"><div class="flex items-center justify-between"><div><p class="text-[10px] font-semibold uppercase tracking-wider text-text-muted">${ssrInterpolate(unref(today))}</p><p class="text-lg font-extrabold tracking-tight text-text">TaskFlow <span class="bg-gradient-brand bg-clip-text text-transparent">Mobile</span></p></div><span class="relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary">`);
      _push(ssrRenderComponent(unref(User), {
        size: 14,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`<span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-success" aria-hidden="true"></span></span></div><div class="mt-3 rounded-card border border-border bg-card p-3"><div class="flex items-center justify-between text-xs"><span class="font-semibold text-text">${ssrInterpolate(doneCount.value)} dari ${ssrInterpolate(tasks.value.length)} selesai</span><span class="font-bold text-primary">${ssrInterpolate(progress.value)}%</span></div><div class="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-alt"><div class="h-full rounded-full bg-gradient-brand transition-all duration-500" style="${ssrRenderStyle({ width: progress.value + "%" })}"></div></div></div></header><div class="mx-4 grid grid-cols-3 gap-1 rounded-btn border border-border bg-card p-1"><!--[-->`);
      ssrRenderList({ tasks: "Tugas", stats: "Statistik", profile: "Profil" }, (v, key) => {
        _push(`<button type="button" class="${ssrRenderClass([view.value === key ? "bg-gradient-brand text-white" : "text-text-secondary", "inline-flex items-center justify-center gap-1.5 rounded-[8px] py-2 text-[11px] font-bold transition-colors"])}">`);
        if (key === "tasks") {
          _push(ssrRenderComponent(unref(ListTodo), {
            size: 13,
            "stroke-width": 2
          }, null, _parent));
        } else if (key === "stats") {
          _push(ssrRenderComponent(unref(BarChart3), {
            size: 13,
            "stroke-width": 2
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(User), {
            size: 13,
            "stroke-width": 2
          }, null, _parent));
        }
        _push(` ${ssrInterpolate(v)}</button>`);
      });
      _push(`<!--]--></div><div class="flex-1 overflow-y-auto px-4 pb-4 pt-3">`);
      if (view.value === "tasks") {
        _push(`<!--[--><form class="flex gap-2"><input${ssrRenderAttr("value", newTitle.value)} type="text" class="input-field min-w-0 flex-1 !py-2 text-xs" placeholder="Tugas baru..."><button type="submit" class="btn-primary shrink-0 !px-3 !py-2" aria-label="Tambah tugas">`);
        _push(ssrRenderComponent(unref(Plus), {
          size: 16,
          "stroke-width": 2
        }, null, _parent));
        _push(`</button></form><div class="mt-2 flex items-center gap-1"><!--[-->`);
        ssrRenderList(["all", "active", "done"], (f) => {
          _push(`<button type="button" class="${ssrRenderClass([filter.value === f ? "bg-card text-text shadow-card" : "text-text-muted", "rounded-full px-2.5 py-1 text-[10px] font-bold capitalize transition-colors"])}">${ssrInterpolate(f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai")}</button>`);
        });
        _push(`<!--]--><div class="ml-auto flex items-center gap-1"><!--[-->`);
        ssrRenderList(priorityMeta, (m, key) => {
          _push(`<button type="button" class="${ssrRenderClass([newPriority.value === key ? "text-white" : "text-text-muted", "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase transition-colors"])}" style="${ssrRenderStyle(newPriority.value === key ? { backgroundColor: m.color } : {})}">${ssrInterpolate(m.label)}</button>`);
        });
        _push(`<!--]--></div></div><ul class="mt-3 space-y-2"><!--[-->`);
        ssrRenderList(visible.value, (t) => {
          _push(`<li class="${ssrRenderClass([t.done ? "opacity-60" : "", "flex items-center gap-2.5 rounded-card border border-border bg-card px-3 py-2.5"])}"><button type="button" class="${ssrRenderClass([t.done ? "border-transparent bg-gradient-brand text-white" : "border-border text-transparent", "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"])}"${ssrRenderAttr("aria-label", `Tandai ${t.title}`)}>`);
          _push(ssrRenderComponent(unref(Check), {
            size: 13,
            "stroke-width": 2.5
          }, null, _parent));
          _push(`</button><div class="min-w-0 flex-1"><p class="${ssrRenderClass([t.done ? "line-through" : "", "truncate text-xs font-semibold text-text"])}">${ssrInterpolate(t.title)}</p><span class="text-[9px] font-bold uppercase" style="${ssrRenderStyle({ color: priorityMeta[t.priority].color })}">${ssrInterpolate(priorityMeta[t.priority].label)}</span></div><button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"${ssrRenderAttr("aria-label", `Hapus ${t.title}`)}>`);
          _push(ssrRenderComponent(unref(Trash2), {
            size: 13,
            "stroke-width": 1.5
          }, null, _parent));
          _push(`</button></li>`);
        });
        _push(`<!--]-->`);
        if (!visible.value.length) {
          _push(`<li class="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-text-muted"> Tidak ada tugas. </li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul><!--]-->`);
      } else if (view.value === "stats") {
        _push(`<!--[--><div class="grid grid-cols-2 gap-3"><div class="rounded-card border border-border bg-card p-3.5 text-center"><p class="text-2xl font-extrabold text-text">${ssrInterpolate(tasks.value.length)}</p><p class="text-[11px] text-text-muted">Total Tugas</p></div><div class="rounded-card border border-border bg-card p-3.5 text-center"><p class="text-2xl font-extrabold text-success">${ssrInterpolate(doneCount.value)}</p><p class="text-[11px] text-text-muted">Selesai</p></div><div class="rounded-card border border-border bg-card p-3.5 text-center"><p class="text-2xl font-extrabold text-amber-400">${ssrInterpolate(tasks.value.length - doneCount.value)}</p><p class="text-[11px] text-text-muted">Tertunda</p></div><div class="rounded-card border border-border bg-card p-3.5 text-center"><p class="text-2xl font-extrabold text-primary">${ssrInterpolate(progress.value)}%</p><p class="text-[11px] text-text-muted">Progress</p></div></div><div class="mt-4 rounded-card border border-border bg-card p-4"><p class="text-xs font-bold text-text">Prioritas</p><div class="mt-3 space-y-2.5"><!--[-->`);
        ssrRenderList(priorityMeta, (m, key) => {
          _push(`<div class="flex items-center gap-2"><span class="w-14 text-[10px] font-semibold" style="${ssrRenderStyle({ color: m.color })}">${ssrInterpolate(m.label)}</span><div class="h-2 flex-1 overflow-hidden rounded-full bg-bg-alt"><div class="h-full rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: tasks.value.filter((t) => t.priority === key).length / Math.max(tasks.value.length, 1) * 100 + "%", backgroundColor: m.color })}"></div></div><span class="w-5 text-right text-[10px] font-bold text-text">${ssrInterpolate(tasks.value.filter((t) => t.priority === key).length)}</span></div>`);
        });
        _push(`<!--]--></div></div><!--]-->`);
      } else {
        _push(`<!--[--><div class="rounded-card border border-border bg-card p-5 text-center"><span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-xl font-extrabold text-white">CD</span><p class="mt-3 text-sm font-extrabold text-text">CehaDev</p><p class="text-[11px] text-text-muted">Web Developer</p><p class="mt-1 text-[11px] text-text-muted">cehadev@example.com</p></div><ul class="mt-3 divide-y divide-border/60 rounded-card border border-border bg-card"><!--[-->`);
        ssrRenderList(["Akun", "Notifikasi", "Sinkronisasi Cloud", "Pengaturan"], (item, i) => {
          _push(`<li class="flex items-center gap-3 px-4 py-3 text-xs font-medium text-text"><span class="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden="true"></span> ${ssrInterpolate(item)} `);
          if (i === 2) {
            _push(`<span class="ml-auto inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[9px] font-bold text-success"><span class="h-1 w-1 rounded-full bg-success" aria-hidden="true"></span> ON </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul><!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoTodo.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const shikiLangs = {
  javascript: langJavascript,
  typescript: langTypeScript,
  python: langPython,
  php: langPhp,
  sql: langSql,
  bash: langBash,
  json: langJson,
  html: langHtml,
  css: langCss,
  java: langJava,
  go: langGo,
  rust: langRust,
  ruby: langRuby,
  dart: langDart,
  yaml: langYaml,
  markdown: langMarkdown
};
const engine = createJavaScriptRegexEngine();
let highlighterPromise = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [langGithubDark],
      langs: Object.values(shikiLangs),
      engine
    });
  }
  return highlighterPromise;
}
function isShikiLang(lang) {
  return lang in shikiLangs;
}
async function codeToHtml(code, lang, theme = "github-dark") {
  const hl = await getHighlighter();
  const safeLang = isShikiLang(lang) ? lang : "text";
  return hl.codeToHtml(code, { lang: safeLang, theme });
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DemoCode",
  __ssrInlineRender: true,
  props: {
    files: { default: () => [] },
    storageKey: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const files = computed(() => {
      var _a;
      return ((_a = props.files) != null ? _a : []).filter((f) => f.name && f.content);
    });
    const activeIdx = ref(0);
    const highlighted = ref({});
    const loading = ref(false);
    const error = ref("");
    const copied = ref(false);
    const activeFile = computed(() => files.value[activeIdx.value]);
    const lineCount = computed(() => {
      var _a, _b;
      return ((_b = (_a = activeFile.value) == null ? void 0 : _a.content) != null ? _b : "").split("\n").length;
    });
    async function highlight() {
      var _a;
      if (!activeFile.value) return;
      const idx = activeIdx.value;
      if (highlighted.value[idx] !== void 0) return;
      loading.value = true;
      error.value = "";
      try {
        const lang = isShikiLang(activeFile.value.language) ? activeFile.value.language : "text";
        highlighted.value[idx] = await codeToHtml(activeFile.value.content, lang);
      } catch (e) {
        highlighted.value[idx] = "";
        error.value = String((_a = e == null ? void 0 : e.message) != null ? _a : e);
      } finally {
        loading.value = false;
      }
    }
    watch([activeIdx, files], () => {
      if (!files.value.length) return;
      if (activeIdx.value >= files.value.length) activeIdx.value = 0;
      void highlight();
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (files.value.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full flex-col bg-bg text-text" }, _attrs))} data-v-94cabcbe><div class="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-border bg-bg-alt/50 px-2 pt-1.5 sm:gap-1 sm:px-3 sm:pt-2" role="tablist" data-v-94cabcbe><!--[-->`);
        ssrRenderList(files.value, (f, i) => {
          _push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", i === activeIdx.value)} class="${ssrRenderClass([i === activeIdx.value ? "border-primary bg-bg text-text" : "border-transparent text-text-muted hover:bg-card/60 hover:text-text-secondary", "inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-2 py-2 text-[11px] font-semibold transition-colors sm:gap-2 sm:px-3 sm:py-2.5 sm:text-xs"])}" data-v-94cabcbe>`);
          _push(ssrRenderComponent(unref(FileCode2), {
            size: 12,
            "stroke-width": 1.75,
            class: "sm:hidden"
          }, null, _parent));
          _push(ssrRenderComponent(unref(FileCode2), {
            size: 13,
            "stroke-width": 1.75,
            class: "hidden sm:block"
          }, null, _parent));
          _push(`<span class="max-w-28 truncate font-mono sm:max-w-44" data-v-94cabcbe>${ssrInterpolate(f.name)}</span><span class="${ssrRenderClass([unref(codeLangClass)(f.language), "hidden rounded-md px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide sm:inline-block sm:px-1.5 sm:text-[9px]"])}" data-v-94cabcbe>${ssrInterpolate(unref(codeLangLabel)(f.language))}</span></button>`);
        });
        _push(`<!--]--></div><div class="relative min-h-0 flex-1 overflow-hidden" data-v-94cabcbe><div class="absolute right-2 top-2 z-10 flex items-center gap-1.5 sm:right-4 sm:top-3 sm:gap-2" data-v-94cabcbe>`);
        if (copied.value) {
          _push(`<span class="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success sm:px-2 sm:py-1 sm:text-[10px]" data-v-94cabcbe>`);
          _push(ssrRenderComponent(unref(Check), {
            size: 10,
            "stroke-width": 2.25,
            class: "sm:hidden"
          }, null, _parent));
          _push(ssrRenderComponent(unref(Check), {
            size: 11,
            "stroke-width": 2.25,
            class: "hidden sm:block"
          }, null, _parent));
          _push(` Tersalin </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-text sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[11px]" data-v-94cabcbe>`);
        _push(ssrRenderComponent(unref(Copy), {
          size: 11,
          "stroke-width": 1.75,
          class: "sm:hidden"
        }, null, _parent));
        _push(ssrRenderComponent(unref(Copy), {
          size: 12,
          "stroke-width": 1.75,
          class: "hidden sm:block"
        }, null, _parent));
        _push(` Salin </button></div>`);
        if (loading.value) {
          _push(`<div class="flex h-full items-center justify-center gap-2 text-text-muted" data-v-94cabcbe>`);
          _push(ssrRenderComponent(unref(LoaderCircle), {
            size: 16,
            class: "animate-spin sm:hidden"
          }, null, _parent));
          _push(ssrRenderComponent(unref(LoaderCircle), {
            size: 18,
            class: "hidden animate-spin sm:block"
          }, null, _parent));
          _push(`<span class="text-[11px] sm:text-xs" data-v-94cabcbe>Menyiapkan editor...</span></div>`);
        } else {
          _push(`<div class="flex h-full" data-v-94cabcbe><div class="select-none border-r border-border bg-card-alt/40 py-3 pl-2.5 pr-1.5 text-right font-mono text-[11px] leading-[1.65] text-text-muted sm:py-4 sm:pl-4 sm:pr-3 sm:text-[12.5px]" aria-hidden="true" data-v-94cabcbe><!--[-->`);
          ssrRenderList(lineCount.value, (n) => {
            _push(`<div data-v-94cabcbe>${ssrInterpolate(n)}</div>`);
          });
          _push(`<!--]--></div><div class="min-w-0 flex-1 overflow-x-auto py-3 pr-2 sm:py-4 sm:pr-4" data-v-94cabcbe>`);
          if (highlighted.value[activeIdx.value]) {
            _push(`<div class="code-panel" data-v-94cabcbe>${(_a = highlighted.value[activeIdx.value]) != null ? _a : ""}</div>`);
          } else {
            _push(`<pre class="font-mono text-[11px] leading-[1.65] text-text-secondary sm:text-[12.5px]" data-v-94cabcbe>${ssrInterpolate(activeFile.value.content)}`);
            if (error.value) {
              _push(`<span class="mt-2 block text-[9px] text-red-400 sm:mt-3 sm:text-[10px]" data-v-94cabcbe>Tidak dapat mewarnai kode: ${ssrInterpolate(error.value)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</pre>`);
          }
          _push(`</div></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full items-center justify-center bg-bg p-6 text-center text-text-muted sm:p-8" }, _attrs))} data-v-94cabcbe><div data-v-94cabcbe>`);
        _push(ssrRenderComponent(unref(FileCode2), {
          size: 24,
          "stroke-width": 1.5,
          class: "mx-auto opacity-60 sm:hidden"
        }, null, _parent));
        _push(ssrRenderComponent(unref(FileCode2), {
          size: 28,
          "stroke-width": 1.5,
          class: "mx-auto hidden opacity-60 sm:block"
        }, null, _parent));
        _push(`<p class="mt-2 text-xs sm:mt-3 sm:text-sm" data-v-94cabcbe>Belum ada file kode.</p><p class="mt-0.5 text-[11px] sm:mt-1 sm:text-xs" data-v-94cabcbe>Atur file kode project lewat panel admin.</p></div></div>`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoCode.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const DemoCode = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-94cabcbe"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DemoStudio",
  __ssrInlineRender: true,
  props: {
    files: { default: () => [] },
    storageKey: { default: "" },
    phoneMode: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const sourceFiles = computed(() => {
      var _a;
      return ((_a = props.files) != null ? _a : []).filter((f) => f.name && f.content);
    });
    const editedContent = reactive({});
    const files = computed(
      () => sourceFiles.value.map((f) => {
        var _a;
        return { ...f, content: (_a = editedContent[f.name]) != null ? _a : f.content };
      })
    );
    const tree = ref([]);
    const expanded = ref({});
    const activePath = ref("");
    const sidebarOpen = ref(true);
    const rows = computed(() => {
      const out = [];
      const walk = (nodes, depth) => {
        for (const n of nodes) {
          out.push({ node: n, depth });
          if (n.children && expanded.value[n.path]) walk(n.children, depth + 1);
        }
      };
      walk(tree.value, 0);
      return out;
    });
    const activeFile = computed(() => files.value.find((f) => f.name === activePath.value));
    const lineCount = computed(() => {
      var _a, _b;
      return ((_b = (_a = activeFile.value) == null ? void 0 : _a.content) != null ? _b : "").split("\n").length;
    });
    const highlighted = ref({});
    const loading = ref(false);
    async function highlight() {
      const f = activeFile.value;
      if (!f || highlighted.value[f.name] !== void 0) return;
      loading.value = true;
      try {
        highlighted.value[f.name] = await codeToHtml(f.content, f.language);
      } catch {
        highlighted.value[f.name] = "";
      } finally {
        loading.value = false;
      }
    }
    watch(activeFile, () => {
      if (activeFile.value) void highlight();
    }, { immediate: true });
    ref(null);
    ref(null);
    computed(() => {
      var _a;
      const list = files.value.filter((f) => /\.html?$/i.test(f.name));
      return (_a = list.find((f) => /index\.html?$/i.test(f.name))) != null ? _a : list[0];
    });
    const previewDoc = ref("");
    const previewMode = ref("note");
    const previewNote = ref("");
    ref(0);
    const isLive = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      if (__props.phoneMode) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full flex-col bg-bg text-text" }, _attrs))} data-v-1779912a>`);
        if (previewMode.value === "web") {
          _push(`<iframe${ssrRenderAttr("srcdoc", previewDoc.value)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title="Live preview project" class="h-full min-h-0 w-full flex-1 border-0 bg-white" data-v-1779912a></iframe>`);
        } else {
          _push(`<div class="flex h-full min-h-0 flex-1 items-center justify-center bg-bg p-4" data-v-1779912a><div class="max-w-xs rounded-xl border border-border bg-card/60 p-3 text-center" data-v-1779912a>`);
          _push(ssrRenderComponent(unref(AlertCircle), {
            size: 20,
            "stroke-width": 1.75,
            class: "mx-auto text-amber-400"
          }, null, _parent));
          _push(`<p class="mt-2 text-[11px] font-semibold text-text-secondary" data-v-1779912a>Tidak bisa dijalankan</p><p class="mt-1 text-[10px] leading-relaxed text-text-muted" data-v-1779912a>${ssrInterpolate(previewNote.value)}</p></div></div>`);
        }
        _push(`</div>`);
      } else if (files.value.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "studio-root flex h-full flex-col bg-bg text-text" }, _attrs))} data-v-1779912a><div class="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-bg-alt/50 px-2 py-1.5 sm:px-3 sm:py-2" data-v-1779912a><div class="flex items-center gap-1.5 sm:gap-2" data-v-1779912a><button type="button" class="${ssrRenderClass([sidebarOpen.value ? "border-primary/30 bg-primary/10 text-primary" : "", "hidden items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/40 hover:text-text lg:flex"])}" data-v-1779912a>`);
        if (!sidebarOpen.value) {
          _push(ssrRenderComponent(unref(PanelLeft), {
            size: 13,
            "stroke-width": 2
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(PanelLeftClose), {
            size: 13,
            "stroke-width": 2
          }, null, _parent));
        }
        _push(`</button><span class="flex items-center gap-1 text-[11px] font-semibold text-text-secondary sm:gap-1.5 sm:text-xs" data-v-1779912a>`);
        _push(ssrRenderComponent(unref(FolderOpen), {
          size: 13,
          class: "shrink-0 text-primary sm:hidden"
        }, null, _parent));
        _push(ssrRenderComponent(unref(FolderOpen), {
          size: 14,
          class: "hidden shrink-0 text-primary sm:block"
        }, null, _parent));
        _push(`<span class="truncate" data-v-1779912a>${ssrInterpolate(files.value.length)} berkas</span></span></div><div class="flex items-center gap-1.5 sm:gap-2" data-v-1779912a><button type="button" class="${ssrRenderClass([isLive.value ? "border-success/40 bg-success/10 text-success" : "border-border bg-bg text-text-secondary", "hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all lg:flex"])}" data-v-1779912a><span class="${ssrRenderClass([isLive.value ? "animate-pulse bg-success" : "bg-text-muted", "h-1.5 w-1.5 rounded-full"])}" data-v-1779912a></span> ${ssrInterpolate(isLive.value ? "Live" : "Manual")}</button><button type="button" class="flex items-center gap-1 rounded-lg bg-gradient-brand px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:shadow-btn-glow hover:scale-[1.02] active:scale-95 sm:px-3" data-v-1779912a>`);
        _push(ssrRenderComponent(unref(Play), {
          size: 11,
          "stroke-width": 2.25
        }, null, _parent));
        _push(` Run </button></div></div><div class="hidden min-h-0 flex-1 lg:grid lg:grid-cols-2" data-v-1779912a><div class="flex min-h-0 flex-col border-r border-border" data-v-1779912a><div class="${ssrRenderClass([sidebarOpen.value ? "grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[170px_minmax(0,1fr)]" : "grid-cols-1", "grid min-h-0 flex-1"])}" data-v-1779912a>`);
        if (sidebarOpen.value) {
          _push(`<aside class="min-h-0 overflow-y-auto border-r border-border bg-card-alt/30 p-1 text-[11px] sm:p-1.5 sm:text-[12px]" data-v-1779912a><!--[-->`);
          ssrRenderList(rows.value, (row) => {
            _push(`<button type="button" class="${ssrRenderClass([row.node.file && activePath.value === row.node.path ? "bg-primary/15 font-medium text-text" : !row.node.file && activePath.value === row.node.path ? "bg-card/80 text-text-secondary" : "text-text-muted hover:bg-card/60 hover:text-text-secondary", "flex w-full items-center gap-1 rounded-lg px-1.5 py-1 text-left transition-colors sm:gap-1.5 sm:px-2 sm:py-1.5"])}" style="${ssrRenderStyle({ paddingLeft: row.depth * 12 + 6 + "px" })}" data-v-1779912a>`);
            if (row.node.children && expanded.value[row.node.path]) {
              _push(ssrRenderComponent(unref(FolderOpen), {
                size: 12,
                "stroke-width": 1.75,
                class: "shrink-0 text-sky-400"
              }, null, _parent));
            } else if (row.node.children) {
              _push(ssrRenderComponent(unref(Folder), {
                size: 12,
                "stroke-width": 1.75,
                class: "shrink-0 text-sky-400"
              }, null, _parent));
            } else {
              _push(ssrRenderComponent(unref(FileCode2), {
                size: 12,
                "stroke-width": 1.75,
                class: "shrink-0 text-text-muted"
              }, null, _parent));
            }
            _push(`<span class="truncate font-mono text-[10px] sm:text-[11px]" data-v-1779912a>${ssrInterpolate(row.node.name)}</span></button>`);
          });
          _push(`<!--]--></aside>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex min-h-0 flex-col" data-v-1779912a><div class="flex shrink-0 items-center justify-between border-b border-border bg-card-alt/40 px-2 py-1 sm:px-3 sm:py-1.5" data-v-1779912a><span class="flex min-w-0 items-center gap-1 font-mono text-[10px] font-semibold text-text-secondary sm:gap-1.5 sm:text-[11px]" data-v-1779912a>`);
        _push(ssrRenderComponent(unref(FileCode2), {
          size: 11,
          "stroke-width": 1.75,
          class: "shrink-0 text-primary sm:hidden"
        }, null, _parent));
        _push(ssrRenderComponent(unref(FileCode2), {
          size: 12,
          "stroke-width": 1.75,
          class: "hidden shrink-0 text-primary sm:block"
        }, null, _parent));
        _push(`<span class="truncate" data-v-1779912a>${ssrInterpolate((_b = (_a = activeFile.value) == null ? void 0 : _a.name) != null ? _b : "\u2014")}</span>`);
        if (editedContent[(_d = (_c = activeFile.value) == null ? void 0 : _c.name) != null ? _d : ""]) {
          _push(`<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" title="Modified" data-v-1779912a></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span><span class="${ssrRenderClass([unref(codeLangClass)((_f = (_e = activeFile.value) == null ? void 0 : _e.language) != null ? _f : ""), "shrink-0 rounded-md px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide sm:px-1.5 sm:text-[9px]"])}" data-v-1779912a>${ssrInterpolate(unref(codeLangLabel)((_h = (_g = activeFile.value) == null ? void 0 : _g.language) != null ? _h : ""))}</span></div><div class="editor-wrap relative min-h-0 flex-1 overflow-hidden" data-v-1779912a>`);
        if (loading.value) {
          _push(`<div class="flex h-full items-center justify-center gap-2 text-text-muted" data-v-1779912a>`);
          _push(ssrRenderComponent(unref(LoaderCircle), {
            size: 16,
            class: "animate-spin sm:hidden"
          }, null, _parent));
          _push(ssrRenderComponent(unref(LoaderCircle), {
            size: 18,
            class: "hidden animate-spin sm:block"
          }, null, _parent));
          _push(`<span class="text-[11px] sm:text-xs" data-v-1779912a>Menyiapkan editor...</span></div>`);
        } else if (activeFile.value) {
          _push(`<!--[--><div class="absolute inset-y-0 left-0 z-10 flex select-none bg-card-alt/40 py-2.5 pl-2 pr-1.5 text-right font-mono text-[11px] leading-[1.65] text-text-muted sm:py-3 sm:pl-3 sm:pr-2 sm:text-[12.5px]" aria-hidden="true" data-v-1779912a><!--[-->`);
          ssrRenderList(lineCount.value, (n) => {
            _push(`<div data-v-1779912a>${ssrInterpolate(n)}</div>`);
          });
          _push(`<!--]--></div><div class="editor-highlight pointer-events-none absolute inset-0 overflow-hidden py-2.5 pl-[40px] pr-2 sm:py-3 sm:pl-[52px] sm:pr-3" data-v-1779912a>`);
          if (highlighted.value[activeFile.value.name]) {
            _push(`<div class="code-panel font-mono text-[11px] leading-[1.65] sm:text-[12.5px]" data-v-1779912a>${(_i = highlighted.value[activeFile.value.name]) != null ? _i : ""}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><textarea spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" class="editor-textarea absolute inset-0 z-20 h-full w-full resize-none bg-transparent py-2.5 pl-[40px] pr-2 font-mono text-[11px] leading-[1.65] text-transparent caret-text focus:outline-none sm:py-3 sm:pl-[52px] sm:pr-3 sm:text-[12.5px]"${ssrRenderAttr("aria-label", `Editor ${activeFile.value.name}`)} data-v-1779912a>${ssrInterpolate(activeFile.value.content)}</textarea><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div><div class="flex min-h-0 flex-col" data-v-1779912a><div class="flex shrink-0 items-center justify-between border-b border-border bg-card-alt/40 px-2 py-1 sm:px-3 sm:py-1.5" data-v-1779912a><span class="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted sm:gap-1.5 sm:text-[10px]" data-v-1779912a>`);
        _push(ssrRenderComponent(unref(Globe), {
          size: 10,
          "stroke-width": 1.75,
          class: "text-primary sm:hidden"
        }, null, _parent));
        _push(ssrRenderComponent(unref(Globe), {
          size: 11,
          "stroke-width": 1.75,
          class: "hidden text-primary sm:block"
        }, null, _parent));
        _push(` Live Preview </span>`);
        if (previewMode.value === "web" && isLive.value) {
          _push(`<span class="flex items-center gap-1 text-[9px] text-text-muted sm:text-[10px]" data-v-1779912a><span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success" data-v-1779912a></span> auto </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="min-h-0 flex-1 overflow-hidden" data-v-1779912a>`);
        if (previewMode.value === "web") {
          _push(`<iframe${ssrRenderAttr("srcdoc", previewDoc.value)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title="Live preview project" class="h-full w-full border-0 bg-white" data-v-1779912a></iframe>`);
        } else {
          _push(`<div class="flex h-full items-center justify-center bg-bg p-4 sm:p-6" data-v-1779912a><div class="max-w-xs rounded-xl border border-border bg-card/60 p-3 text-center sm:max-w-sm sm:p-4" data-v-1779912a>`);
          _push(ssrRenderComponent(unref(AlertCircle), {
            size: 20,
            "stroke-width": 1.75,
            class: "mx-auto text-amber-400 sm:hidden"
          }, null, _parent));
          _push(ssrRenderComponent(unref(AlertCircle), {
            size: 22,
            "stroke-width": 1.75,
            class: "mx-auto hidden text-amber-400 sm:block"
          }, null, _parent));
          _push(`<p class="mt-2 text-[11px] font-semibold text-text-secondary sm:text-xs" data-v-1779912a>Tidak bisa dijalankan di browser</p><p class="mt-1 text-[10px] leading-relaxed text-text-muted sm:text-[11px]" data-v-1779912a>${ssrInterpolate(previewNote.value)}</p></div></div>`);
        }
        _push(`</div></div></div><div class="min-h-0 flex-1 overflow-hidden lg:hidden" data-v-1779912a>`);
        if (previewMode.value === "web") {
          _push(`<iframe${ssrRenderAttr("srcdoc", previewDoc.value)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title="Live preview project" class="h-full w-full border-0 bg-white" data-v-1779912a></iframe>`);
        } else {
          _push(`<div class="flex h-full items-center justify-center bg-bg p-4 sm:p-6" data-v-1779912a><div class="max-w-xs rounded-xl border border-border bg-card/60 p-3 text-center sm:max-w-sm sm:p-4" data-v-1779912a>`);
          _push(ssrRenderComponent(unref(AlertCircle), {
            size: 20,
            "stroke-width": 1.75,
            class: "mx-auto text-amber-400 sm:hidden"
          }, null, _parent));
          _push(ssrRenderComponent(unref(AlertCircle), {
            size: 22,
            "stroke-width": 1.75,
            class: "mx-auto hidden text-amber-400 sm:block"
          }, null, _parent));
          _push(`<p class="mt-2 text-[11px] font-semibold text-text-secondary sm:text-xs" data-v-1779912a>Tidak bisa dijalankan di browser</p><p class="mt-1 text-[10px] leading-relaxed text-text-muted sm:text-[11px]" data-v-1779912a>${ssrInterpolate(previewNote.value)}</p></div></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full items-center justify-center bg-bg p-6 text-center text-text-muted sm:p-8" }, _attrs))} data-v-1779912a><div data-v-1779912a>`);
        _push(ssrRenderComponent(unref(FileCode2), {
          size: 24,
          "stroke-width": 1.5,
          class: "mx-auto opacity-60 sm:hidden"
        }, null, _parent));
        _push(ssrRenderComponent(unref(FileCode2), {
          size: 28,
          "stroke-width": 1.5,
          class: "mx-auto hidden opacity-60 sm:block"
        }, null, _parent));
        _push(`<p class="mt-2 text-xs sm:mt-3 sm:text-sm" data-v-1779912a>Belum ada file project.</p><p class="mt-0.5 text-[11px] sm:mt-1 sm:text-xs" data-v-1779912a>Atur file HTML/CSS/JS lewat panel admin untuk live preview.</p></div></div>`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoStudio.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DemoStudio = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-1779912a"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DemoRunner",
  __ssrInlineRender: true,
  props: {
    type: {},
    slug: {},
    title: { default: "" },
    url: { default: "" },
    note: { default: "" },
    files: { default: () => [] }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    const h = computed(() => {
      var _a, _b, _c;
      return (_c = (_b = (_a = site.value) == null ? void 0 : _a.headings) == null ? void 0 : _b.demo) != null ? _c : {};
    });
    const demoComponents = {
      store: _sfc_main$8,
      kanban: _sfc_main$7,
      dashboard: _sfc_main$6,
      api: _sfc_main$5,
      todo: _sfc_main$4,
      code: DemoCode,
      studio: DemoStudio
    };
    const device = ref("desktop");
    const resetKey = ref(0);
    ref(null);
    const isFullscreen = ref(false);
    const storageKey = computed(() => `cehadev-demo-${props.slug}-${props.type}`);
    const demoComponent = computed(() => {
      var _a;
      return (_a = demoComponents[props.type]) != null ? _a : _sfc_main$8;
    });
    const displayUrl = computed(() => props.url || `/demo/${props.slug}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "demo-runner" }, _attrs))} data-v-d64100af><div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" data-v-d64100af><div class="min-w-0" data-v-d64100af><h3 class="text-lg font-extrabold tracking-tight text-text sm:text-xl md:text-2xl" data-v-d64100af>${ssrInterpolate(__props.title || h.value.title || "Demo Interaktif")}</h3>`);
      if (__props.note || h.value.note) {
        _push(`<p class="mt-1 text-xs text-text-secondary sm:text-sm" data-v-d64100af>${ssrInterpolate(__props.note || h.value.note || "Demo berjalan penuh di browser \u2014 tanpa perlu server.")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-wrap items-center gap-1.5 sm:gap-2" data-v-d64100af><div class="flex rounded-xl border border-border bg-bg p-0.5 sm:p-1" role="group" data-v-d64100af><button type="button" class="${ssrRenderClass([device.value === "desktop" ? "bg-gradient-brand text-white shadow-btn-glow" : "text-text-secondary hover:text-text", "flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all sm:px-3 sm:py-2 sm:text-xs"])}" data-v-d64100af>`);
      _push(ssrRenderComponent(unref(Monitor), {
        size: 13,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`<span class="hidden sm:inline" data-v-d64100af>${ssrInterpolate(h.value.desktop || "Desktop")}</span></button><button type="button" class="${ssrRenderClass([device.value === "phone" ? "bg-gradient-brand text-white shadow-btn-glow" : "text-text-secondary hover:text-text", "flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all sm:px-3 sm:py-2 sm:text-xs"])}" data-v-d64100af>`);
      _push(ssrRenderComponent(unref(Smartphone), {
        size: 13,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`<span class="hidden sm:inline" data-v-d64100af>${ssrInterpolate(h.value.mobile || "HP")}</span></button></div><button type="button" class="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-bg px-2.5 py-1.5 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text sm:px-3 sm:py-2 sm:text-xs" data-v-d64100af>`);
      _push(ssrRenderComponent(unref(RotateCcw), {
        size: 13,
        "stroke-width": 1.75
      }, null, _parent));
      _push(`<span class="hidden sm:inline" data-v-d64100af>${ssrInterpolate(h.value.reset || "Reset")}</span></button><button type="button" class="${ssrRenderClass([isFullscreen.value ? "border border-primary/40 bg-primary/10 text-primary" : "border border-border bg-bg text-text-secondary hover:border-primary/50 hover:text-text", "flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-all sm:px-3 sm:py-2 sm:text-xs"])}" data-v-d64100af>`);
      if (isFullscreen.value) {
        _push(ssrRenderComponent(unref(Minimize2), {
          size: 13,
          "stroke-width": 1.75
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Maximize2), {
          size: 13,
          "stroke-width": 1.75
        }, null, _parent));
      }
      _push(`<span class="hidden sm:inline" data-v-d64100af>${ssrInterpolate(isFullscreen.value ? "Keluar" : "Layar Penuh")}</span></button>`);
      if (__props.url) {
        _push(`<a${ssrRenderAttr("href", __props.url)} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center rounded-xl border border-border bg-bg px-2.5 py-1.5 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text sm:px-3 sm:py-2 sm:text-xs" data-v-d64100af>`);
        _push(ssrRenderComponent(unref(ExternalLink), {
          size: 13,
          "stroke-width": 1.75
        }, null, _parent));
        _push(`</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (device.value === "desktop") {
        _push(`<div class="dr-frame overflow-hidden rounded-xl border border-border bg-card shadow-card sm:rounded-2xl" data-v-d64100af><div class="flex items-center gap-2 border-b border-border bg-bg-alt/50 px-3 py-2 sm:px-4 sm:py-2.5" aria-hidden="true" data-v-d64100af><span class="h-2.5 w-2.5 rounded-full bg-[#FF5F57] sm:h-3 sm:w-3" data-v-d64100af></span><span class="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] sm:h-3 sm:w-3" data-v-d64100af></span><span class="h-2.5 w-2.5 rounded-full bg-[#28C840] sm:h-3 sm:w-3" data-v-d64100af></span><div class="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-bg/80 px-2.5 py-1 sm:px-3 sm:py-1.5" data-v-d64100af><span class="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-success sm:block" data-v-d64100af></span><span class="truncate text-[10px] text-text-muted sm:text-[11px]" data-v-d64100af>${ssrInterpolate(displayUrl.value)}</span></div><span class="hidden shrink-0 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success sm:inline-flex" data-v-d64100af>${ssrInterpolate(h.value.runsOffline || "Offline")}</span></div><div class="dr-content overflow-y-auto bg-bg" data-v-d64100af>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(demoComponent.value), {
          key: resetKey.value,
          "storage-key": storageKey.value,
          files: __props.files
        }, null), _parent);
        _push(`</div></div>`);
      } else {
        _push(`<div class="dr-phone-wrap" data-v-d64100af><div class="dr-phone mx-auto w-full max-w-full rounded-none border-0 border-border bg-card p-0 shadow-none sm:w-[320px] sm:rounded-[2.8rem] sm:border-2 sm:p-2.5 sm:shadow-card" data-v-d64100af><div class="h-full sm:overflow-hidden sm:rounded-[2.2rem] sm:border sm:border-border" data-v-d64100af><div class="relative hidden h-8 items-center justify-center bg-bg sm:flex" aria-hidden="true" data-v-d64100af><span class="absolute left-5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-border bg-bg-alt" data-v-d64100af></span><span class="h-2.5 w-28 rounded-full bg-border" data-v-d64100af></span></div><div class="dr-phone-content h-full bg-bg" data-v-d64100af>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(demoComponent.value), {
          key: resetKey.value,
          "storage-key": storageKey.value,
          files: __props.files,
          "phone-mode": true
        }, null), _parent);
        _push(`</div><div class="hidden h-7 items-center justify-center border-t border-border bg-bg sm:flex" aria-hidden="true" data-v-d64100af><span class="h-1 w-24 rounded-full bg-border" data-v-d64100af></span></div></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/DemoRunner.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d64100af"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const route = useRoute();
    const { viewsOf, formatCount } = useStats();
    const { data: projects } = ([__temp, __restore] = withAsyncContext(() => useProjectsContent()), __temp = await __temp, __restore(), __temp);
    const { data: site } = ([__temp, __restore] = withAsyncContext(() => useSiteSettings()), __temp = await __temp, __restore(), __temp);
    const { t } = useI18n();
    const headings = computed(() => {
      var _a2, _b, _c;
      return (_c = (_b = (_a2 = site.value) == null ? void 0 : _a2.headings) == null ? void 0 : _b.projectDetail) != null ? _c : {};
    });
    const project = computed(() => {
      var _a2;
      return ((_a2 = projects.value) != null ? _a2 : []).find((p) => p.slug === route.params.slug);
    });
    useSeoMeta({
      title: () => {
        var _a2, _b;
        return `${(_b = (_a2 = project.value) == null ? void 0 : _a2.title) != null ? _b : "Project"} | CehaDev`;
      },
      description: () => {
        var _a2, _b;
        return (_b = (_a2 = project.value) == null ? void 0 : _a2.tagline) != null ? _b : "";
      }
    });
    if (!project.value) {
      throw createError({ statusCode: 404, statusMessage: (_a = headings.value.notFound) != null ? _a : "Project tidak ditemukan", fatal: true });
    }
    const detail = computed(() => {
      var _a2;
      return (_a2 = project.value) == null ? void 0 : _a2.detail;
    });
    const demoConfig = computed(
      () => {
        var _a2, _b;
        return (_b = (_a2 = project.value) == null ? void 0 : _a2.demo) != null ? _b : {};
      }
    );
    const demoEnabled = computed(() => Boolean(demoConfig.value.enabled));
    const demoFiles = computed(() => {
      var _a2, _b;
      return (_b = (_a2 = demoConfig.value.code) == null ? void 0 : _a2.files) != null ? _b : [];
    });
    const tabLabels = computed(() => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      return {
        Demo: (_a2 = headings.value.tabDemo) != null ? _a2 : "Demo Interaktif",
        Overview: (_b = headings.value.tabOverview) != null ? _b : "Overview",
        Fitur: (_c = headings.value.tabFeatures) != null ? _c : "Fitur",
        Teknologi: (_d = headings.value.tabTech) != null ? _d : "Teknologi",
        Proses: (_e = headings.value.tabProcess) != null ? _e : "Proses",
        Tantangan: (_f = headings.value.tabChallenges) != null ? _f : "Tantangan",
        Hasil: (_g = headings.value.tabResults) != null ? _g : "Hasil",
        Galeri: (_h = headings.value.tabGallery) != null ? _h : "Galeri"
      };
    });
    const tabDefs = [
      { key: "Demo", has: () => demoEnabled.value },
      { key: "Overview", has: () => true },
      { key: "Fitur", has: () => {
        var _a2;
        return Boolean((_a2 = detail.value) == null ? void 0 : _a2.mainFeatures);
      } },
      { key: "Teknologi", has: () => {
        var _a2;
        return Boolean((_a2 = detail.value) == null ? void 0 : _a2.techStack);
      } },
      { key: "Proses", has: () => {
        var _a2;
        return Boolean((_a2 = detail.value) == null ? void 0 : _a2.process);
      } },
      { key: "Tantangan", has: () => {
        var _a2;
        return Boolean((_a2 = detail.value) == null ? void 0 : _a2.challenges);
      } },
      { key: "Hasil", has: () => {
        var _a2;
        return Boolean((_a2 = detail.value) == null ? void 0 : _a2.results);
      } },
      { key: "Galeri", has: () => {
        var _a2;
        return Boolean((_a2 = detail.value) == null ? void 0 : _a2.gallery);
      } }
    ];
    const tabs = computed(() => tabDefs.filter((t2) => t2.has()).map((t2) => t2.key));
    const activeTab = ref("Overview");
    const metaItems = computed(() => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      return [
        { icon: Monitor, label: (_a2 = headings.value.metaRole) != null ? _a2 : "Peran", value: (_b = project.value) == null ? void 0 : _b.role },
        { icon: Calendar, label: (_c = headings.value.metaYear) != null ? _c : "Tahun", value: (_d = project.value) == null ? void 0 : _d.year },
        { icon: Clock3, label: (_e = headings.value.metaDuration) != null ? _e : "Durasi", value: (_f = project.value) == null ? void 0 : _f.duration },
        { icon: FolderKanban, label: (_g = headings.value.metaCategory) != null ? _g : "Kategori", value: (_h = project.value) == null ? void 0 : _h.category }
      ];
    });
    const featureIcons = {
      Search,
      LayoutDashboard,
      MessageSquare,
      ShieldCheck,
      FolderKanban,
      Star,
      Bell,
      Users,
      FolderCheck,
      Activity,
      Code2,
      ClipboardList,
      PenTool,
      Rocket,
      Bug
    };
    const gallery = computed(() => {
      var _a2, _b, _c;
      const g = (_a2 = detail.value) == null ? void 0 : _a2.gallery;
      return (g == null ? void 0 : g.length) ? g : [{ label: (_c = (_b = project.value) == null ? void 0 : _b.title) != null ? _c : "Preview", seed: 1, image: void 0 }];
    });
    const externalLive = computed(() => {
      var _a2;
      const url = (_a2 = project.value) == null ? void 0 : _a2.liveUrl;
      return typeof url === "string" && /^https?:\/\//.test(url) && !/example\.(com|org|net)/i.test(url);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_TechBadge = _sfc_main$9;
      const _component_Reveal = _sfc_main$a;
      const _component_ProjectThumb = _sfc_main$b;
      const _component_DemoRunner = __nuxt_component_4;
      if (unref(project)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-site py-12 md:py-16" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/projects",
          class: "inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a3, _b2;
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), {
                size: 16,
                "stroke-width": 2
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate((_a3 = unref(headings).backToProjects) != null ? _a3 : "Kembali ke Projects")}`);
            } else {
              return [
                createVNode(unref(ArrowLeft), {
                  size: 16,
                  "stroke-width": 2
                }),
                createTextVNode(" " + toDisplayString((_b2 = unref(headings).backToProjects) != null ? _b2 : "Kembali ke Projects"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<section class="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]"><div>`);
        if (unref(project).featured) {
          _push(`<span class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">`);
          _push(ssrRenderComponent(unref(Star), {
            size: 12,
            "stroke-width": 2,
            class: "fill-amber-400"
          }, null, _parent));
          _push(` ${ssrInterpolate((_a2 = unref(headings).featured) != null ? _a2 : "Featured Project")}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-text-secondary">`);
        _push(ssrRenderComponent(unref(Eye), {
          size: 12,
          "stroke-width": 1.75,
          class: "text-primary",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(formatCount)(unref(viewsOf)(unref(project).slug)))} ${ssrInterpolate(unref(t)("common.viewed"))}</span><h1 class="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">${ssrInterpolate(unref(project).title)}</h1><p class="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">${ssrInterpolate(unref(project).tagline)}</p><div class="mt-5 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(unref(project).tags, (tag) => {
          _push(ssrRenderComponent(_component_TechBadge, {
            key: tag,
            name: tag
          }, null, _parent));
        });
        _push(`<!--]--></div><div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"><!--[-->`);
        ssrRenderList(unref(metaItems), (item) => {
          _push(`<div class="flex items-center gap-3"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-primary" aria-hidden="true">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
            size: 18,
            "stroke-width": 1.5
          }, null), _parent);
          _push(`</span><div><p class="text-xs text-text-muted">${ssrInterpolate(item.label)}</p><p class="text-sm font-semibold text-text">${ssrInterpolate(item.value)}</p></div></div>`);
        });
        _push(`<!--]--></div><div class="mt-8 flex flex-wrap gap-4">`);
        if (unref(demoEnabled)) {
          _push(`<button type="button" class="btn-primary">`);
          _push(ssrRenderComponent(unref(Play), {
            size: 16,
            "stroke-width": 2
          }, null, _parent));
          _push(` ${ssrInterpolate((_b = unref(headings).tryDemo) != null ? _b : "Coba Demo")}</button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(externalLive)) {
          _push(`<a${ssrRenderAttr("href", unref(project).liveUrl)} target="_blank" rel="noopener noreferrer" class="btn-primary">${ssrInterpolate((_c = unref(headings).liveDemo) != null ? _c : "Live Demo")} `);
          _push(ssrRenderComponent(unref(ExternalLink), {
            size: 16,
            "stroke-width": 2
          }, null, _parent));
          _push(`</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<a${ssrRenderAttr("href", unref(project).githubUrl)} target="_blank" rel="noopener noreferrer" class="btn-outline">`);
        _push(ssrRenderComponent(unref(Github), {
          size: 16,
          "stroke-width": 1.5
        }, null, _parent));
        _push(` ${ssrInterpolate((_d = unref(headings).viewGithub) != null ? _d : "View on GitHub")}</a></div></div>`);
        _push(ssrRenderComponent(_component_Reveal, { class: "mx-auto w-full max-w-[420px]" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="overflow-hidden rounded-card border border-border bg-card shadow-card"${_scopeId}><div class="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden="true"${_scopeId}><span class="h-3 w-3 rounded-full bg-[#FF5F57]"${_scopeId}></span><span class="h-3 w-3 rounded-full bg-[#FEBC2E]"${_scopeId}></span><span class="h-3 w-3 rounded-full bg-[#28C840]"${_scopeId}></span><span class="ml-3 flex-1 rounded-md bg-bg px-3 py-1 text-[11px] text-text-muted"${_scopeId}>${ssrInterpolate(unref(project).liveUrl)}</span></div>`);
              _push2(ssrRenderComponent(_component_ProjectThumb, {
                seed: unref(project).title.length + 7,
                label: unref(project).title,
                height: "h-64 md:h-72"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "overflow-hidden rounded-card border border-border bg-card shadow-card" }, [
                  createVNode("div", {
                    class: "flex items-center gap-1.5 border-b border-border px-4 py-3",
                    "aria-hidden": "true"
                  }, [
                    createVNode("span", { class: "h-3 w-3 rounded-full bg-[#FF5F57]" }),
                    createVNode("span", { class: "h-3 w-3 rounded-full bg-[#FEBC2E]" }),
                    createVNode("span", { class: "h-3 w-3 rounded-full bg-[#28C840]" }),
                    createVNode("span", { class: "ml-3 flex-1 rounded-md bg-bg px-3 py-1 text-[11px] text-text-muted" }, toDisplayString(unref(project).liveUrl), 1)
                  ]),
                  createVNode(_component_ProjectThumb, {
                    seed: unref(project).title.length + 7,
                    label: unref(project).title,
                    height: "h-64 md:h-72"
                  }, null, 8, ["seed", "label"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section><section class="mt-14"><div class="flex gap-1 overflow-x-auto border-b border-border pb-px" role="tablist"${ssrRenderAttr("aria-label", (_e = unref(headings).tabAria) != null ? _e : "Navigasi konten project")}><!--[-->`);
        ssrRenderList(unref(tabs), (tab) => {
          _push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeTab) === tab)}${ssrRenderAttr("aria-controls", `panel-${tab}`)} class="${ssrRenderClass([unref(activeTab) === tab ? "text-text" : "text-text-muted hover:text-text-secondary", "relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors"])}">${ssrInterpolate(unref(tabLabels)[tab])} `);
          if (unref(activeTab) === tab) {
            _push(`<span class="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-brand rounded-full" aria-hidden="true"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div><div class="mt-10">`);
        if (unref(activeTab) === "Demo") {
          _push(`<div id="demo-panel" role="tabpanel"><div class="rounded-card border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-blue/10 p-3 sm:p-6 md:p-8">`);
          _push(ssrRenderComponent(_component_DemoRunner, {
            type: unref(demoConfig).type || "store",
            slug: unref(project).slug,
            title: unref(demoConfig).title,
            note: unref(demoConfig).note,
            url: unref(externalLive) ? unref(project).liveUrl : `/demo/${unref(project).slug}`,
            files: unref(demoFiles)
          }, null, _parent));
          _push(`</div></div>`);
        } else if (unref(activeTab) === "Overview") {
          _push(`<div id="panel-Overview" role="tabpanel"><div class="grid gap-10 lg:grid-cols-[1fr_1fr]"><div class="space-y-4 text-[15px] leading-relaxed text-text-secondary">`);
          if ((_f = unref(detail)) == null ? void 0 : _f.overview) {
            _push(`<!--[-->`);
            ssrRenderList(unref(detail).overview.split("\n\n"), (para, i) => {
              _push(`<p>${ssrInterpolate(para)}</p>`);
            });
            _push(`<!--]-->`);
          } else {
            _push(`<p>${ssrInterpolate(unref(project).description)}</p>`);
          }
          _push(`</div>`);
          if ((_h = (_g = unref(detail)) == null ? void 0 : _g.featureHighlights) == null ? void 0 : _h.length) {
            _push(`<div class="grid grid-cols-2 gap-4"><!--[-->`);
            ssrRenderList(unref(detail).featureHighlights, (f, i) => {
              _push(ssrRenderComponent(_component_Reveal, {
                key: f.title,
                class: "card p-5",
                delay: i * 60
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<span class="flex h-10 w-10 items-center justify-center rounded-xl" style="${ssrRenderStyle({ backgroundColor: f.color + "22", color: f.color })}" aria-hidden="true"${_scopeId}>`);
                    ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(featureIcons[f.icon]), {
                      size: 20,
                      "stroke-width": 1.5
                    }, null), _parent2, _scopeId);
                    _push2(`</span><h3 class="mt-3 text-sm font-semibold text-text"${_scopeId}>${ssrInterpolate(f.title)}</h3><p class="mt-1 text-xs leading-relaxed text-text-secondary"${_scopeId}>${ssrInterpolate(f.desc)}</p>`);
                  } else {
                    return [
                      createVNode("span", {
                        class: "flex h-10 w-10 items-center justify-center rounded-xl",
                        style: { backgroundColor: f.color + "22", color: f.color },
                        "aria-hidden": "true"
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(featureIcons[f.icon]), {
                          size: 20,
                          "stroke-width": 1.5
                        }))
                      ], 4),
                      createVNode("h3", { class: "mt-3 text-sm font-semibold text-text" }, toDisplayString(f.title), 1),
                      createVNode("p", { class: "mt-1 text-xs leading-relaxed text-text-secondary" }, toDisplayString(f.desc), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else if (unref(activeTab) === "Fitur") {
          _push(`<div id="panel-Fitur" role="tabpanel"><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(detail).mainFeatures, (f, i) => {
            _push(ssrRenderComponent(_component_Reveal, {
              key: f.title,
              class: "card p-6",
              delay: i % 3 * 60
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="flex h-11 w-11 items-center justify-center rounded-xl" style="${ssrRenderStyle({ backgroundColor: f.color + "22", color: f.color })}" aria-hidden="true"${_scopeId}>`);
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(featureIcons[f.icon]), {
                    size: 22,
                    "stroke-width": 1.5
                  }, null), _parent2, _scopeId);
                  _push2(`</span><h3 class="mt-4 text-base font-semibold text-text"${_scopeId}>${ssrInterpolate(f.title)}</h3><p class="mt-2 text-sm leading-relaxed text-text-secondary"${_scopeId}>${ssrInterpolate(f.desc)}</p>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "flex h-11 w-11 items-center justify-center rounded-xl",
                      style: { backgroundColor: f.color + "22", color: f.color },
                      "aria-hidden": "true"
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(featureIcons[f.icon]), {
                        size: 22,
                        "stroke-width": 1.5
                      }))
                    ], 4),
                    createVNode("h3", { class: "mt-4 text-base font-semibold text-text" }, toDisplayString(f.title), 1),
                    createVNode("p", { class: "mt-2 text-sm leading-relaxed text-text-secondary" }, toDisplayString(f.desc), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else if (unref(activeTab) === "Teknologi") {
          _push(`<div id="panel-Teknologi" role="tabpanel"><div class="flex flex-wrap gap-3"><!--[-->`);
          ssrRenderList(unref(detail).techStack, (t2) => {
            var _a3, _b2, _c2, _d2;
            _push(`<div class="flex items-center gap-2.5 rounded-card border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"><span class="flex h-8 w-8 items-center justify-center rounded-lg bg-bg text-sm font-bold" style="${ssrRenderStyle(`color: ${(_a3 = unref(techIcons)[t2]) == null ? void 0 : _a3.color}`)}" aria-hidden="true">${ssrInterpolate((_b2 = unref(techIcons)[t2]) == null ? void 0 : _b2.glyph)}</span><span class="text-sm font-medium text-text">${ssrInterpolate((_d2 = (_c2 = unref(techIcons)[t2]) == null ? void 0 : _c2.name) != null ? _d2 : t2)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else if (unref(activeTab) === "Proses") {
          _push(`<div id="panel-Proses" role="tabpanel"><ol class="grid gap-6 md:grid-cols-5"><!--[-->`);
          ssrRenderList(unref(detail).process, (p, i) => {
            _push(ssrRenderComponent(_component_Reveal, {
              key: p.num,
              class: "relative",
              delay: i * 70
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="flex flex-col items-center text-center"${_scopeId}><span class="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary" aria-hidden="true"${_scopeId}>`);
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(featureIcons[p.icon]), {
                    size: 22,
                    "stroke-width": 1.5
                  }, null), _parent2, _scopeId);
                  _push2(`<span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white"${_scopeId}>${ssrInterpolate(p.num)}</span></span><h3 class="mt-4 text-sm font-semibold text-text"${_scopeId}>${ssrInterpolate(p.title)}</h3><p class="mt-1.5 text-xs leading-relaxed text-text-secondary"${_scopeId}>${ssrInterpolate(p.desc)}</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-col items-center text-center" }, [
                      createVNode("span", {
                        class: "relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary",
                        "aria-hidden": "true"
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(featureIcons[p.icon]), {
                          size: 22,
                          "stroke-width": 1.5
                        })),
                        createVNode("span", { class: "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white" }, toDisplayString(p.num), 1)
                      ]),
                      createVNode("h3", { class: "mt-4 text-sm font-semibold text-text" }, toDisplayString(p.title), 1),
                      createVNode("p", { class: "mt-1.5 text-xs leading-relaxed text-text-secondary" }, toDisplayString(p.desc), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></ol></div>`);
        } else if (unref(activeTab) === "Tantangan") {
          _push(`<div id="panel-Tantangan" role="tabpanel"><div class="grid gap-5 md:grid-cols-2"><!--[-->`);
          ssrRenderList(unref(detail).challenges, (c, i) => {
            _push(ssrRenderComponent(_component_Reveal, {
              key: c.title,
              class: "card p-6",
              delay: i % 2 * 60
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Bug), {
                    size: 20,
                    "stroke-width": 1.5
                  }, null, _parent2, _scopeId));
                  _push2(`</span><h3 class="mt-3 text-sm font-semibold text-text"${_scopeId}>${ssrInterpolate(c.title)}</h3><p class="mt-2 text-sm leading-relaxed text-text-secondary"${_scopeId}>${ssrInterpolate(c.desc)}</p>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary",
                      "aria-hidden": "true"
                    }, [
                      createVNode(unref(Bug), {
                        size: 20,
                        "stroke-width": 1.5
                      })
                    ]),
                    createVNode("h3", { class: "mt-3 text-sm font-semibold text-text" }, toDisplayString(c.title), 1),
                    createVNode("p", { class: "mt-2 text-sm leading-relaxed text-text-secondary" }, toDisplayString(c.desc), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else if (unref(activeTab) === "Hasil") {
          _push(`<div id="panel-Hasil" role="tabpanel"><div class="grid grid-cols-2 gap-4 lg:grid-cols-4"><!--[-->`);
          ssrRenderList(unref(detail).results, (r, i) => {
            _push(ssrRenderComponent(_component_Reveal, {
              key: r.label,
              class: "card p-6 text-center",
              delay: i * 70
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true"${_scopeId}>`);
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(featureIcons[r.icon]), {
                    size: 20,
                    "stroke-width": 1.5
                  }, null), _parent2, _scopeId);
                  _push2(`</span><p class="mt-3 text-2xl font-extrabold text-text md:text-3xl"${_scopeId}>${ssrInterpolate(r.value)}</p><p class="mt-1 text-xs font-medium text-text-muted md:text-sm"${_scopeId}>${ssrInterpolate(r.label)}</p>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary",
                      "aria-hidden": "true"
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(featureIcons[r.icon]), {
                        size: 20,
                        "stroke-width": 1.5
                      }))
                    ]),
                    createVNode("p", { class: "mt-3 text-2xl font-extrabold text-text md:text-3xl" }, toDisplayString(r.value), 1),
                    createVNode("p", { class: "mt-1 text-xs font-medium text-text-muted md:text-sm" }, toDisplayString(r.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<div id="panel-Galeri" role="tabpanel"><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(gallery), (g, i) => {
            _push(ssrRenderComponent(_component_Reveal, {
              key: g.label,
              class: i === 0 ? "sm:col-span-2 lg:row-span-2" : "",
              delay: i % 3 * 60
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (g.image) {
                    _push2(`<div class="${ssrRenderClass([i === 0 ? "h-full min-h-56" : "h-44", "group relative overflow-hidden rounded-card border border-border"])}"${_scopeId}><img${ssrRenderAttr("src", g.image)}${ssrRenderAttr("alt", g.label)} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"${_scopeId}></div><span class="absolute left-3 top-3 rounded-md bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"${_scopeId}>${ssrInterpolate(g.label)}</span></div>`);
                  } else {
                    _push2(ssrRenderComponent(_component_ProjectThumb, {
                      seed: g.seed,
                      label: g.label,
                      height: i === 0 ? "h-full min-h-56" : "h-44"
                    }, null, _parent2, _scopeId));
                  }
                } else {
                  return [
                    g.image ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: ["group relative overflow-hidden rounded-card border border-border", i === 0 ? "h-full min-h-56" : "h-44"]
                    }, [
                      createVNode("img", {
                        src: g.image,
                        alt: g.label,
                        class: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                        loading: "lazy"
                      }, null, 8, ["src", "alt"]),
                      createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
                      createVNode("span", { class: "absolute left-3 top-3 rounded-md bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm" }, toDisplayString(g.label), 1)
                    ], 2)) : (openBlock(), createBlock(_component_ProjectThumb, {
                      key: 1,
                      seed: g.seed,
                      label: g.label,
                      height: i === 0 ? "h-full min-h-56" : "h-44"
                    }, null, 8, ["seed", "label", "height"]))
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div></section><section class="mt-16 rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 via-primary/5 to-blue/10 p-8 text-center md:p-12"><h2 class="text-2xl font-extrabold text-text md:text-3xl">${ssrInterpolate((_i = unref(headings).ctaHead) != null ? _i : "Tertarik untuk bekerja sama?")}</h2><p class="mx-auto mt-3 max-w-md text-[15px] text-text-secondary">${ssrInterpolate((_j = unref(headings).ctaDesc) != null ? _j : "Punya ide atau project yang ingin diwujudkan? Mari diskusikan dan bangun sesuatu yang hebat bersama.")}</p><div class="mt-7 flex flex-wrap justify-center gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/contact",
          class: "btn-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a3, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate((_a3 = unref(headings).contactMe) != null ? _a3 : "Hubungi Saya")}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b2 = unref(headings).contactMe) != null ? _b2 : "Hubungi Saya"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/projects",
          class: "btn-outline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a3, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate((_a3 = unref(headings).otherProjects) != null ? _a3 : "Lihat Project Lainnya")}`);
            } else {
              return [
                createTextVNode(toDisplayString((_b2 = unref(headings).otherProjects) != null ? _b2 : "Lihat Project Lainnya"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-BQuZ6WZy.mjs.map
