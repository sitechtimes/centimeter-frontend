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
        body: JSON.stringify({}),
      });
    if (!ok) {
      throw new Error("Failed to open session");
    } 
    return (data ?? null) as OpenPollsResponse | null;
  }
})