import { defineStore } from "pinia";

export const usePollsStore = defineStore("pollsStore", () => {

  async function createPollsSlide(question: string, options: PollsOption[], is_quiz?: boolean) {
    const userStore = useUserStore();
    const token = userStore.user?.access
    const { ok, data } = await apiCall<OpenPollsResponse>(
      import.meta.env.VITE_BACKEND_URL + "polls/open", 
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


  return {
    createPollsSlide
  }
})