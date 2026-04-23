import { defineStore } from "pinia";

export const usePollsStore = defineStore("pollsStore", () => {
  const activePoll = ref<OpenPollsResponse | null>(null)

  async function createPollsSlide(question: string, options: PollsOption[], is_quiz?: boolean) {
    const userStore = useUserStore();
    const token = userStore.user?.access
    const { ok, data } = await apiCall<OpenPollsResponse>(
      backendBaseUrl() + "/polls/open", 
      { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({question, options, is_quiz}),
      });
    if (!ok) {
      throw new Error("Failed to make slide");
    } 
    return (data ?? null) as OpenPollsResponse | null;
  }

  const voteCounts = ref<Record<string, number>>({})
  const myVotes = ref<Set<string>>(new Set())
  const chosenCount = computed(() => myVotes.value.size)

  const optionsWithCounts = computed(() => {
    if (!activePoll.value) return []
    return activePoll.value.options.map(opt => ({
      ...opt,
      amount_chosen: voteCounts.value[opt.option_text] ?? 0,
      chosen: myVotes.value.has(opt.option_text),
    }))
  })

  function setActivePoll(poll: OpenPollsResponse | null) {
      activePoll.value = poll
      voteCounts.value = {}
      myVotes.value = new Set()
      if (poll) {
        for (const o of poll.options) {
          voteCounts.value[o.option_text] = o.amount_chosen ?? 0
        }
      }
    }

  function applyVoteBroadcast(updates: { option_text: string; delta: 1 | -1 }[]) {
    for (const { option_text, delta } of updates) {
      voteCounts.value[option_text] = Math.max(0, (voteCounts.value[option_text] ?? 0) + delta)
    }
  }

 function toggleOption(
    option: PollsOption,
    limit: number = 1,
    sendFn: (updates: { option_text: string; delta: 1 | -1 }[]) => void
  ) {
    const text = option.option_text
    const isChosen = myVotes.value.has(text)

    if (isChosen) {
      myVotes.value.delete(text)
      voteCounts.value[text] = Math.max(0, (voteCounts.value[text] ?? 0) - 1)
      sendFn([{ option_text: text, delta: -1 }])
      return
    }

    if (chosenCount.value >= limit) {
      if (limit === 1) {
        const [prev] = myVotes.value
        myVotes.value.delete(prev)
        voteCounts.value[prev] = Math.max(0, (voteCounts.value[prev] ?? 0) - 1)
        myVotes.value.add(text)
        voteCounts.value[text] = (voteCounts.value[text] ?? 0) + 1
        sendFn([{ option_text: prev, delta: -1 }, { option_text: text, delta: 1 }])
      }
      return
    }
    myVotes.value.add(text)
    voteCounts.value[text] = (voteCounts.value[text] ?? 0) + 1
    sendFn([{ option_text: text, delta: 1 }])
  }

    return {
      activePoll,
      voteCounts,
      optionsWithCounts,
      chosenCount,
      setActivePoll,
      applyVoteBroadcast,
      toggleOption,
    }
})