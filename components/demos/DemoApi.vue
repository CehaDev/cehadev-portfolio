<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Send, Terminal, Lock, LogOut, KeyRound } from 'lucide-vue-next'

defineProps<{ storageKey?: string }>()

interface Endpoint {
  id: string
  method: 'GET' | 'POST'
  path: string
  desc: string
  params: Array<{ key: string; label: string; def: string }>
  res: Record<string, unknown>
  status: number
  auth?: boolean
}

const endpoints: Endpoint[] = [
  {
    id: 'login',
    method: 'POST',
    path: '/api/v1/auth/login',
    desc: 'Login dan dapatkan JWT token',
    params: [
      { key: 'email', label: 'email', def: 'user@example.com' },
      { key: 'password', label: 'password', def: 'secret123' }
    ],
    status: 200,
    res: {
      success: true,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU1MDEyMDAwfQ._demo',
      user: { id: 1, name: 'CehaDev', email: 'user@example.com', role: 'admin' }
    }
  },
  {
    id: 'users',
    method: 'GET',
    path: '/api/v1/users',
    desc: 'Daftar user (pagination)',
    params: [{ key: 'limit', label: 'limit', def: '10' }],
    status: 200,
    res: {
      success: true,
      data: [
        { id: 1, name: 'CehaDev', email: 'cehadev@example.com', role: 'admin' },
        { id: 2, name: 'Ari Wibowo', email: 'ari@example.com', role: 'user' },
        { id: 3, name: 'Nanda Fajar', email: 'nanda@example.com', role: 'user' }
      ],
      meta: { total: 3, limit: 10, page: 1 }
    }
  },
  {
    id: 'products',
    method: 'GET',
    path: '/api/v1/products',
    desc: 'Katalog produk',
    params: [
      { key: 'category', label: 'category', def: '' },
      { key: 'sort', label: 'sort', def: 'popular' }
    ],
    status: 200,
    res: {
      success: true,
      data: [
        { id: 101, name: 'Kopi Arabika Premium', price: 65000, stock: 24 },
        { id: 102, name: 'Headset Wireless Pro', price: 249000, stock: 9 },
        { id: 103, name: 'Mechanical Keyboard 87', price: 899000, stock: 3 }
      ]
    }
  },
  {
    id: 'orders',
    method: 'POST',
    path: '/api/v1/orders',
    desc: 'Buat pesanan (butuh token)',
    params: [
      { key: 'productId', label: 'productId', def: '102' },
      { key: 'qty', label: 'qty', def: '1' }
    ],
    status: 201,
    auth: true,
    res: {
      success: true,
      data: { orderId: 'ORD-88123', total: 249000, status: 'PAID', eta: '2-3 hari' }
    }
  },
  {
    id: 'stats',
    method: 'GET',
    path: '/api/v1/stats/overview',
    desc: 'Ringkasan metrik API',
    params: [{ key: 'range', label: 'range', def: '7d' }],
    status: 200,
    auth: true,
    res: {
      success: true,
      data: {
        requests: 48201,
        avgLatency: 186,
        errorRate: 0.42,
        topEndpoints: ['/api/v1/products', '/api/v1/users', '/api/v1/auth/login']
      }
    }
  }
]

const methodColor: Record<Endpoint['method'], string> = { GET: '#22C55E', POST: '#F59E0B' }

const activeIdx = ref(0)
const params = reactive<Record<string, string>>({})
const token = ref<string | null>(null)
const sending = ref(false)
const response = ref<Record<string, unknown> | null>(null)
const status = ref<number | null>(null)
const latency = ref<number | null>(null)

const active = computed(() => endpoints[activeIdx.value])

const queryString = computed(() => {
  const qs = Object.entries(params)
    .filter(([, v]) => v.trim() !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return qs ? '?' + qs : ''
})

const displayUrl = computed(() => active.value.path + (active.value.method === 'GET' ? queryString.value : ''))

const bodyText = computed(() => {
  if (active.value.method === 'POST') {
    const body: Record<string, string> = {}
    for (const p of active.value.params) {
      if (params[p.key]?.trim()) body[p.key] = params[p.key].trim()
    }
    return JSON.stringify(body, null, 2)
  }
  return null
})

const responseText = computed(() => (response.value ? JSON.stringify(response.value, null, 2) : null))

function selectEndpoint(i: number) {
  activeIdx.value = i
  for (const p of endpoints[i].params) {
    if (!(p.key in params)) params[p.key] = p.def
  }
  response.value = null
  status.value = null
  latency.value = null
}

function send() {
  if (sending.value) return
  sending.value = true
  status.value = null
  latency.value = null
  const ep = active.value
  const t0 = performance.now()
  setTimeout(() => {
    const t = Math.max(40, Math.round(performance.now() - t0) + 40)
    if (ep.auth && !token.value) {
      status.value = 401
      response.value = { error: 'Unauthorized', message: 'Login terlebih dahulu untuk mengakses endpoint ini.', hint: 'Kirim POST /api/v1/auth/login untuk mendapatkan token.' }
    } else {
      status.value = ep.status
      response.value = ep.res
      if (ep.id === 'login') {
        const r = ep.res as { token?: string }
        if (typeof r.token === 'string') token.value = r.token
      }
    }
    latency.value = t
    sending.value = false
  }, 260 + Math.random() * 420)
}

function logout() {
  token.value = null
  response.value = null
  status.value = null
  latency.value = null
}
</script>

<template>
  <div class="flex h-full min-h-[540px] flex-col bg-bg text-text">
    <!-- Header -->
    <header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div class="flex items-center gap-2.5">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">NT</span>
        <div class="leading-tight">
          <p class="text-sm font-extrabold tracking-tight">NuTech API</p>
          <p class="text-[10px] text-text-muted">REST API · Node.js + TypeScript</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="token"
          class="inline-flex max-w-40 items-center gap-1.5 overflow-hidden rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success"
          :title="token"
        >
          <KeyRound :size="11" :stroke-width="2" class="shrink-0" />
          <span class="truncate">Token aktif</span>
        </span>
        <button
          v-if="token"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-btn border border-border bg-bg px-2.5 py-1.5 text-[10px] font-semibold text-text-secondary transition-colors hover:text-red-400"
          @click="logout"
        >
          <LogOut :size="12" :stroke-width="1.75" />
          Logout
        </button>
      </div>
    </header>

    <div class="flex min-h-0 flex-1 flex-col sm:flex-row">
      <!-- Daftar endpoint -->
      <div class="border-b border-border bg-card-alt/60 sm:w-48 sm:border-b-0 sm:border-r">
        <div class="flex gap-1 overflow-x-auto p-2 sm:flex-col sm:overflow-y-auto">
          <button
            v-for="(ep, i) in endpoints"
            :key="ep.id"
            type="button"
            class="flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors sm:min-w-0"
            :class="activeIdx === i ? 'bg-card text-text shadow-card' : 'text-text-secondary hover:bg-card/60 hover:text-text'"
            @click="selectEndpoint(i)"
          >
            <span
              class="w-10 shrink-0 rounded px-1 py-0.5 text-center text-[9px] font-bold text-white"
              :style="{ backgroundColor: methodColor[ep.method] }"
            >
              {{ ep.method }}
            </span>
            <span class="hidden truncate font-mono text-[11px] sm:block">{{ ep.path.replace('/api/v1', '') }}</span>
            <Lock v-if="ep.auth" :size="10" :stroke-width="2" class="shrink-0 text-amber-400" />
          </button>
        </div>
      </div>

      <!-- Panel request & response -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="rounded-card border border-border bg-card p-4">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{{ active.desc }}</p>
          <div class="mt-2 flex items-center gap-2">
            <span
              class="rounded-md px-2 py-1 text-[10px] font-bold text-white"
              :style="{ backgroundColor: methodColor[active.method] }"
            >
              {{ active.method }}
            </span>
            <code class="min-w-0 flex-1 truncate rounded-md bg-bg px-3 py-1.5 font-mono text-[11px] text-text-secondary">
              {{ displayUrl }}
            </code>
          </div>

          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            <div v-for="p in active.params" :key="p.key">
              <label :for="`demo-api-${active.id}-${p.key}`" class="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">{{ p.key }}</label>
              <input
                :id="`demo-api-${active.id}-${p.key}`"
                v-model="params[p.key]"
                type="text"
                class="input-field !py-2 font-mono !text-[11px]"
                :placeholder="p.def"
              />
            </div>
          </div>

          <div v-if="bodyText" class="mt-3">
            <p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">Request Body</p>
            <pre class="overflow-x-auto rounded-md bg-bg p-3 font-mono text-[10px] leading-relaxed text-text-secondary">{{ bodyText }}</pre>
          </div>

          <button type="button" class="btn-primary mt-4 !px-5 !py-2.5 text-xs" :disabled="sending" @click="send">
            <Send :size="14" :stroke-width="2" class="rotate-180" />
            {{ sending ? 'Mengirim...' : 'Send Request' }}
          </button>
        </div>

        <div class="mt-3 rounded-card border border-border bg-card p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="flex items-center gap-2 text-xs font-bold text-text">
              <Terminal :size="14" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              Response
            </p>
            <div v-if="status" class="flex items-center gap-2 text-[10px]">
              <span
                class="rounded px-1.5 py-0.5 font-bold"
                :style="{ backgroundColor: status < 400 ? '#22C55E22' : '#F43F5E22', color: status < 400 ? '#22C55E' : '#F43F5E' }"
              >
                {{ status }}
              </span>
              <span v-if="latency" class="font-mono text-text-muted">{{ latency }}ms</span>
            </div>
          </div>
          <pre
            v-if="responseText"
            class="mt-2 overflow-x-auto rounded-md bg-bg p-3 font-mono text-[10px] leading-relaxed text-text-secondary"
            :class="status && status >= 400 ? '!text-red-400' : ''"
          >{{ responseText }}</pre>
          <p v-else class="mt-2 rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-text-muted">
            Kirim request untuk melihat respons.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
