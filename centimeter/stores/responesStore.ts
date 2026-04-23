import { defineStore } from 'pinia';

export const useResponsesStore = defineStore("responsesStore", () => {

   async function votePolls(polls_id?: String, join_code?: String, option?: PollsOption) {

         const { ok, status } = await apiCall<OpenPollsResponse | Record<string, unknown> | string | string[]>(
            import.meta.env.VITE_BACKEND_URL + "/response/vote/",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ polls_id, join_code, option })
            }
      );

      if (!ok) {
         throw new Error(`Failed to change active slide (HTTP ${status})`);
      }
   }

  return {
      votePolls
  }
});