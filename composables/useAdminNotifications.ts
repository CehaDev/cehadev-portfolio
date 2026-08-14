export interface UnreadChatItem {
  id: string
  visitor: string
  text: string
  at: string
}

export interface UnreadMsgItem {
  id: string
  name: string
  subject: string
  at: string
}

interface AdminNotifState {
  messageUnread: number
  chatUnread: number
  messages: UnreadMsgItem[]
  chats: UnreadChatItem[]
  total: number
}

const state = reactive<AdminNotifState>({
  messageUnread: 0,
  chatUnread: 0,
  messages: [],
  chats: [],
  total: 0
})

let started = false
let prevTotal = 0

async function refresh() {
  try {
    const [unread, messages, conversations] = await Promise.all([
      $fetch<{ count: number }>('/api/admin/messages/unread'),
      $fetch<Array<{ id: string; name: string; subject: string; read: boolean; at: string }>>('/api/admin/messages'),
      $fetch<Array<{ id: string; visitor: { name: string }; unread: number; lastMessage: { text: string } | null; updatedAt: string }>>('/api/admin/chat/conversations')
    ])
    state.messageUnread = unread.count
    state.messages = (messages ?? [])
      .filter((m) => !m.read)
      .slice(0, 5)
      .map((m) => ({ id: m.id, name: m.name, subject: m.subject, at: m.at }))
    state.chats = (conversations ?? [])
      .filter((c) => (c.unread ?? 0) > 0)
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        visitor: c.visitor?.name ?? 'Pengunjung',
        text: c.lastMessage?.text ?? '',
        at: c.updatedAt
      }))
    state.chatUnread = state.chats.length
    state.total = state.messageUnread + state.chatUnread

    if (import.meta.client) {
      const base = document.title.replace(/^\(\d+\)\s*/, '')
      document.title = state.total > 0 ? `(${state.total}) ${base}` : base

      if (state.total > prevTotal && document.hidden && 'Notification' in window && Notification.permission === 'granted') {
        const extra = state.chats[0] ? `Chat baru dari ${state.chats[0].visitor}` : ''
        const msg = state.messages[0] ? `Pesan baru: ${state.messages[0].subject}` : ''
        new Notification('Pesan masuk belum dibaca', { body: [msg, extra].filter(Boolean).join(' · ') })
      }
    }
    prevTotal = state.total
  } catch {
    /* abaikan error polling */
  }
}

export function useAdminNotifications() {
  if (import.meta.client && !started) {
    started = true
    refresh()
    setInterval(refresh, 10000)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refresh()
    })
  }
  return state
}
