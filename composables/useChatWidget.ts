export function useChatWidget() {
  const trigger = useState<{ nonce: number; prefill: string }>('chat-widget-trigger', () => ({ nonce: 0, prefill: '' }))

  function openChat(prefill = '') {
    trigger.value = { nonce: trigger.value.nonce + 1, prefill }
  }

  return { trigger, openChat }
}
