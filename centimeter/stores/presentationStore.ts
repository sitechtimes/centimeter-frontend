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

import type { Presentation } from "../utils/presentationTypes";

export const usePresentationStore = defineStore("presentationStore", () => {
  async function createPresentation(title: string, description?: string) {
    try {
      const userStore = useUserStore();
      const token = userStore.user?.access

      const { ok, data } = await apiCall<Presentation>(
        import.meta.env.VITE_BACKEND_URL + "/presentations/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({ title, description })
        }
      );

      if (ok && data) {
        return data;
      } else {
        throw new Error("Failed to create presentation");
      }
    } catch (err) {
      throw err;
    }
  }

  return {
    createPresentation
  };
});
