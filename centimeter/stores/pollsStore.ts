import { defineStore } from "pinia";

export const usePollsStore = defineStore("pollsStore", () => {

  async function createPollsSlide(payload: CreatePollPayload) {
    const userStore = useUserStore();
    const token = userStore.user?.access;
 
    const body = {
      session_id:    payload.session_id,
      question:      payload.question,
      type:          payload.type ?? "single",
      options:       payload.options ?? [],
      is_quiz:       payload.is_quiz ?? false,
      points:        payload.points ?? 1,
      correct_option_indices: payload.correct_option_indices ?? [],
      show_results:  payload.show_results ?? true,
      ...(payload.duration_seconds != null && { duration_seconds: payload.duration_seconds }),
      ...(payload.scale_min != null && { scale_min: payload.scale_min }),
      ...(payload.scale_max != null && { scale_max: payload.scale_max }),
    };

  const bang = JSON.stringify(body)
  console.log('creating poll with:', bang)
 
  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/polls/open/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error('Poll creation failed:', response.status, errorBody); 
    throw new Error(JSON.stringify(errorBody) ?? "Failed to create poll slide");
  }

  return await response.json()
  }

  async function closePoll(pollId: number) {
  const userStore = useUserStore();
  const token = userStore.user?.access;

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "/polls/close/",  
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ poll_id: pollId }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(JSON.stringify(errorBody) ?? "Failed to close poll");
  }
}

  return {
    createPollsSlide,
    closePoll
  }
})