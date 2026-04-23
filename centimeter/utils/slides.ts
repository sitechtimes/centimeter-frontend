export const slideOption = ref("")
export const openEditPanel = ref(true)
export const slides = ref<Slide[]>([])
export const chartType = ref<'bar' | 'doughnut' | 'pie'>('bar')

const sessionSocket = ref<WebSocket | null>(null)

export function useSessionSocket() {
  function send(event: string, data: object) {
    sessionSocket.value?.send(JSON.stringify({ event, data }))
  }

  return { sessionSocket, send }
}

