import { defineStore } from "pinia";
const userStore = useUserStore();
const token = userStore.user?.access;

export const usePollsStore = defineStore("pollsStore", () => {

  async function createPollsSlide(payload: CreatePollPayload) {
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

  async function fetchPollsData(pollId: string) {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + `/polls/${pollId}/active/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(JSON.stringify(errorBody) ?? "Failed to fetch poll results");
    }

    return await response.json();
  }


  return {
    createPollsSlide,
    closePoll,
    fetchPollsData
  }
})