<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ShoppingCart, Plus, Minus, Trash2, Search, X, CheckCircle2, Star } from 'lucide-vue-next'
import { loadDemo, saveDemo } from '~/utils/demoStorage'

const props = defineProps<{ storageKey?: string }>()

interface Product {
  id: number
  name: string
  price: number
  cat: string
  emoji: string
  rating: number
  sold: number
}
interface CartLine {
  id: number
  qty: number
}

const products: Product[] = [
  { id: 1, name: 'Kopi Arabika Premium 250g', price: 65000, cat: 'Minuman', emoji: '☕', rating: 4.8, sold: 320 },
  { id: 2, name: 'Headset Wireless Pro', price: 249000, cat: 'Elektronik', emoji: '🎧', rating: 4.6, sold: 145 },
  { id: 3, name: 'Tumbler Stainless 1L', price: 129000, cat: 'Rumah Tangga', emoji: '🥤', rating: 4.9, sold: 210 },
  { id: 4, name: 'Mechanical Keyboard 87', price: 899000, cat: 'Elektronik', emoji: '⌨️', rating: 4.7, sold: 88 },
  { id: 5, name: 'Tas Laptop 15" Anti Air', price: 175000, cat: 'Fashion', emoji: '🎒', rating: 4.5, sold: 96 },
  { id: 6, name: 'Smart Watch Fitnes', price: 459000, cat: 'Elektronik', emoji: '⌚', rating: 4.4, sold: 152 },
  { id: 7, name: 'Sneaker Urban White', price: 389000, cat: 'Fashion', emoji: '👟', rating: 4.6, sold: 67 },
  { id: 8, name: 'Lampu Meja LED Dimmable', price: 85000, cat: 'Rumah Tangga', emoji: '💡', rating: 4.7, sold: 178 }
]

const storageKey = props.storageKey || 'cehadev-demo-store'
const cart = ref<CartLine[]>(loadDemo<CartLine[]>(storageKey, []))
watch(cart, (v) => saveDemo(storageKey, v), { deep: true })

const query = ref('')
const activeCat = ref('Semua')
const categories = computed(() => ['Semua', ...Array.from(new Set(products.map((p) => p.cat)))])
const filtered = computed(() =>
  products.filter(
    (p) =>
      (activeCat.value === 'Semua' || p.cat === activeCat.value) &&
      p.name.toLowerCase().includes(query.value.trim().toLowerCase())
  )
)

const cartOpen = ref(false)
const checkoutOpen = ref(false)
const done = ref(false)
const orderNo = ref('')
const form = reactive({ name: '', address: '', payment: 'Transfer Bank' })

const cartCount = computed(() => cart.value.reduce((n, l) => n + l.qty, 0))
const cartTotal = computed(() =>
  cart.value.reduce((sum, l) => {
    const p = products.find((x) => x.id === l.id)
    return sum + (p ? p.price * l.qty : 0)
  }, 0)
)
const cartLines = computed(() =>
  cart.value
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.id) }))
    .filter((l) => l.product)
)

function formatRp(n: number) {
  return 'Rp' + n.toLocaleString('id-ID')
}

function addToCart(id: number) {
  const line = cart.value.find((l) => l.id === id)
  if (line) line.qty++
  else cart.value.push({ id, qty: 1 })
}

function setQty(id: number, delta: number) {
  const line = cart.value.find((l) => l.id === id)
  if (!line) return
  line.qty += delta
  if (line.qty <= 0) cart.value = cart.value.filter((l) => l.id !== id)
}

function removeLine(id: number) {
  cart.value = cart.value.filter((l) => l.id !== id)
}

function startCheckout() {
  checkoutOpen.value = true
  cartOpen.value = false
}

function submitCheckout() {
  if (!form.name.trim() || !form.address.trim()) return
  orderNo.value = 'CS-' + String(Math.floor(100000 + Math.random() * 900000))
  done.value = true
  cart.value = []
  checkoutOpen.value = false
  form.name = ''
  form.address = ''
  setTimeout(() => {
    done.value = false
  }, 4000)
}
</script>

<template>
  <div class="relative flex h-full min-h-[540px] flex-col bg-bg text-text">
    <!-- Header toko -->
    <header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">CS</span>
        <div class="leading-tight">
          <p class="text-sm font-extrabold tracking-tight">Cehava Store</p>
          <p class="text-[10px] text-text-muted">Belanja mulus & cepat</p>
        </div>
      </div>
      <button
        type="button"
        class="relative inline-flex items-center gap-1.5 rounded-btn border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-text"
        @click="cartOpen = true"
      >
        <ShoppingCart :size="15" :stroke-width="1.75" />
        Keranjang
        <span
          v-if="cartCount > 0"
          class="flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-brand px-1 text-[10px] font-bold text-white"
        >
          {{ cartCount }}
        </span>
      </button>
    </header>

    <!-- Konten scroll -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="relative">
        <Search :size="14" :stroke-width="1.75" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          v-model="query"
          type="text"
          class="input-field !rounded-full !py-2.5 !pl-9 !text-xs"
          placeholder="Cari produk..."
        />
      </div>

      <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="c in categories"
          :key="c"
          type="button"
          class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
          :class="activeCat === c ? 'border-transparent bg-gradient-brand text-white' : 'border-border bg-card text-text-secondary hover:text-text'"
          @click="activeCat = c"
        >
          {{ c }}
        </button>
      </div>

      <p class="mt-4 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {{ filtered.length }} produk
      </p>

      <div class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div v-for="p in filtered" :key="p.id" class="flex flex-col rounded-card border border-border bg-card p-3">
          <span class="flex h-20 items-center justify-center rounded-lg bg-bg-alt text-4xl" aria-hidden="true">{{ p.emoji }}</span>
          <p class="mt-2 line-clamp-2 min-h-[2.4em] text-xs font-semibold leading-tight text-text">{{ p.name }}</p>
          <p class="mt-1 text-xs font-bold text-primary">{{ formatRp(p.price) }}</p>
          <div class="mt-0.5 flex items-center gap-1 text-[10px] text-text-muted">
            <Star :size="10" :stroke-width="1.5" class="fill-amber-400 text-amber-400" />
            <span class="font-semibold text-text-secondary">{{ p.rating }}</span>
            <span>• {{ p.sold }} terjual</span>
          </div>
          <button
            type="button"
            class="mt-2.5 inline-flex items-center justify-center gap-1 rounded-btn border border-primary/40 bg-primary/10 px-2 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
            @click="addToCart(p.id)"
          >
            <Plus :size="12" :stroke-width="2" />
            Tambah
          </button>
        </div>
      </div>

      <p v-if="!filtered.length" class="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
        Produk tidak ditemukan.
      </p>
    </div>

    <!-- Drawer keranjang -->
    <div v-if="cartOpen" class="absolute inset-0 z-20 bg-black/50" role="presentation" @click="cartOpen = false" />
    <aside
      v-if="cartOpen"
      class="absolute inset-y-0 right-0 z-30 flex w-full max-w-xs flex-col border-l border-border bg-card"
      role="dialog"
      aria-label="Keranjang belanja"
    >
      <div class="flex items-center justify-between border-b border-border px-4 py-3">
        <p class="text-sm font-bold text-text">Keranjang</p>
        <button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:text-text" aria-label="Tutup keranjang" @click="cartOpen = false">
          <X :size="16" :stroke-width="1.75" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div v-for="l in cartLines" :key="l.id" class="flex items-center gap-3 rounded-lg border border-border bg-bg p-2.5">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-lg" aria-hidden="true">{{ l.product!.emoji }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-text">{{ l.product!.name }}</p>
            <p class="mt-0.5 text-[11px] font-bold text-primary">{{ formatRp(l.product!.price * l.qty) }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:text-text" :aria-label="`Kurangi ${l.product!.name}`" @click="setQty(l.id, -1)">
              <Minus :size="11" :stroke-width="2" />
            </button>
            <span class="w-6 text-center text-xs font-bold text-text">{{ l.qty }}</span>
            <button type="button" class="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:text-text" :aria-label="`Tambah ${l.product!.name}`" @click="setQty(l.id, 1)">
              <Plus :size="11" :stroke-width="2" />
            </button>
            <button type="button" class="ml-1 rounded-md p-1 text-red-400 hover:bg-red-500/10" :aria-label="`Hapus ${l.product!.name}`" @click="removeLine(l.id)">
              <Trash2 :size="13" :stroke-width="1.5" />
            </button>
          </div>
        </div>
        <p v-if="!cartLines.length" class="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
          Keranjang kosong.
        </p>
      </div>
      <div class="border-t border-border p-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-text-secondary">Total</span>
          <span class="text-base font-extrabold text-text">{{ formatRp(cartTotal) }}</span>
        </div>
        <button
          type="button"
          class="btn-primary mt-3 w-full !py-2.5 text-xs"
          :disabled="!cartLines.length"
          :class="!cartLines.length ? 'pointer-events-none opacity-40' : ''"
          @click="startCheckout"
        >
          Checkout
        </button>
      </div>
    </aside>

    <!-- Modal checkout -->
    <div v-if="checkoutOpen" class="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Checkout">
      <div class="w-full max-w-sm rounded-card border border-border bg-card p-5 shadow-card">
        <div class="flex items-center justify-between">
          <p class="text-sm font-bold text-text">Detail Pengiriman</p>
          <button type="button" class="rounded-md p-1 text-text-muted hover:text-text" aria-label="Tutup checkout" @click="checkoutOpen = false">
            <X :size="15" :stroke-width="1.75" />
          </button>
        </div>
        <div class="mt-4 space-y-3">
          <div>
            <label for="demo-checkout-name" class="mb-1 block text-[11px] font-medium text-text-muted">Nama Penerima</label>
            <input id="demo-checkout-name" v-model="form.name" type="text" class="input-field !py-2 text-xs" placeholder="Nama lengkap" />
          </div>
          <div>
            <label for="demo-checkout-addr" class="mb-1 block text-[11px] font-medium text-text-muted">Alamat</label>
            <textarea id="demo-checkout-addr" v-model="form.address" rows="2" class="input-field !py-2 text-xs" placeholder="Alamat lengkap" />
          </div>
          <div>
            <label for="demo-checkout-pay" class="mb-1 block text-[11px] font-medium text-text-muted">Metode Pembayaran</label>
            <select id="demo-checkout-pay" v-model="form.payment" class="input-field !py-2 text-xs">
              <option>Transfer Bank</option>
              <option>E-Wallet</option>
              <option>COD</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs">
          <span class="text-text-muted">Total bayar</span>
          <span class="text-sm font-extrabold text-primary">{{ formatRp(cartTotal) }}</span>
        </div>
        <div class="mt-4 flex gap-2">
          <button type="button" class="btn-outline flex-1 !py-2 text-xs" @click="checkoutOpen = false">Batal</button>
          <button type="button" class="btn-primary flex-1 !py-2 text-xs" :disabled="!form.name.trim() || !form.address.trim()" :class="!form.name.trim() || !form.address.trim() ? 'pointer-events-none opacity-40' : ''" @click="submitCheckout">
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>

    <!-- Toast sukses -->
    <div v-if="done" class="absolute inset-x-4 top-4 z-50 flex items-start gap-3 rounded-card border border-success/40 bg-success/10 p-4 shadow-card" role="status">
      <CheckCircle2 :size="18" :stroke-width="1.75" class="shrink-0 text-success" />
      <div class="min-w-0">
        <p class="text-sm font-bold text-text">Pesanan berhasil dibuat!</p>
        <p class="mt-0.5 text-xs text-text-secondary">Nomor pesanan: <span class="font-semibold text-text">{{ orderNo }}</span> — ini demo, tidak ada pembayaran sungguhan.</p>
      </div>
    </div>
  </div>
</template>
