import { defineStore } from 'pinia';

export const useResponsesStore = defineStore("responsesStore", () => {

   async function votePolls(poll_id: string | number, join_code: string, nickname: string, option_id: string | number) {
      const response  = await fetch(
         import.meta.env.VITE_BACKEND_URL + "/responses/vote/",
         {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ poll_id, join_code, nickname, option_id }),
         }
      );
      
      const errorBody = await response.json().catch(() => null)
   
      if (!response.ok) {
         console.error('Vote failed:', response.status, errorBody);
         throw new Error(`Failed to submit vote (HTTP ${response.status})`);
      }
   }

   async function voteMultiSelect(poll_id: string | number, join_code: string, nickname: string, option_ids: (string | number)[]) {
      const { ok, status } = await apiCall<Record<string, unknown>>(
         import.meta.env.VITE_BACKEND_URL + "/responses/vote/",
         {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ poll_id, join_code, nickname, option_ids }),
         }
      );
   
      if (!ok) {
         throw new Error(`Failed to submit multi-select vote (HTTP ${status})`);
      }
   }

   return {
      votePolls,
      voteMultiSelect
   }
});