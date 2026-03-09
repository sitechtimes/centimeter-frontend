async function apiCall<ApiResponse>(url: string, options: RequestInit): Promise<{ ok: boolean; data?: ApiResponse }> {
  const res = await fetch(url, options);
  let data: ApiResponse | undefined = undefined;
  try {
    data = await res.json();
  } catch (e){
    console.log(`Response is not JSON: ${e}`);
  }
  return { ok: res.ok, data };
}

import { defineStore } from "pinia";
import type { OpenPollsResponse } from "~/utils/types";

export const usePollsStore = defineStore("pollsStore", () => {

  async function openPolls() {
    const userStore = useUserStore();
    const token = userStore.user?.access
    const { ok, data } = await apiCall<OpenPollsResponse>(
      import.meta.env.VITE_BACKEND_URL + "polls/open", 
      { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ''
        },
        /* body: JSON.stringify({ title }) */ 
      });
    if (ok) {
      // Handle successful response
    } else {
      // Handle error
    }
  }
})