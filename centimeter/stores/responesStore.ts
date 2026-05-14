import { defineStore } from 'pinia';

export const useResponsesStore = defineStore("responsesStore", () => {

   function buildVoteWebSocketUrl(poll_id: string | number, join_code: string): string {
      const baseUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
      if (!baseUrl) return "";

      const wsBase = baseUrl.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://");

      return `${wsBase}/ws/submit-vote/${poll_id}/${join_code}/`;
   }

   async function votePolls(poll_id: string | number, join_code: string, nickname: string, option_id: string | number) {
      return new Promise((resolve, reject) => {
         const socketUrl = buildVoteWebSocketUrl(poll_id, join_code);
         if (!socketUrl) {
            reject(new Error("Invalid WebSocket URL"));
            return;
         }

         const socket = new WebSocket(socketUrl);
         let responded = false;

         const timeout = setTimeout(() => {
            if (!responded) {
               responded = true;
               socket.close();
               reject(new Error("Vote submission timeout"));
            }
         }, 10000); // 10 second timeout

         socket.onopen = () => {
            socket.send(JSON.stringify({
               nickname,
               option_id
            }));
         };

         socket.onmessage = (event: MessageEvent) => {
            if (responded) return;
            responded = true;
            clearTimeout(timeout);

            try {
               const payload = JSON.parse(event.data);
               if (payload.event === "vote_submitted") {
                  resolve(payload.data);
               } else if (payload.event === "vote_error") {
                  reject(new Error(payload.data?.detail || "Vote submission failed"));
               }
            } catch (e) {
               reject(e);
            } finally {
               socket.close();
            }
         };

         socket.onerror = () => {
            if (!responded) {
               responded = true;
               clearTimeout(timeout);
               reject(new Error("WebSocket error"));
            }
         };

         socket.onclose = () => {
            if (!responded) {
               responded = true;
               clearTimeout(timeout);
               reject(new Error("WebSocket closed before response"));
            }
         };
      });
   }

   async function voteMultiSelect(poll_id: string | number, join_code: string, nickname: string, option_ids: (string | number)[]) {
      return new Promise((resolve, reject) => {
         const socketUrl = buildVoteWebSocketUrl(poll_id, join_code);
         if (!socketUrl) {
            reject(new Error("Invalid WebSocket URL"));
            return;
         }

         const socket = new WebSocket(socketUrl);
         let responded = false;

         const timeout = setTimeout(() => {
            if (!responded) {
               responded = true;
               socket.close();
               reject(new Error("Vote submission timeout"));
            }
         }, 10000); // 10 second timeout

         socket.onopen = () => {
            socket.send(JSON.stringify({
               nickname,
               option_ids
            }));
         };

         socket.onmessage = (event: MessageEvent) => {
            if (responded) return;
            responded = true;
            clearTimeout(timeout);

            try {
               const payload = JSON.parse(event.data);
               if (payload.event === "vote_submitted") {
                  resolve(payload.data);
               } else if (payload.event === "vote_error") {
                  reject(new Error(payload.data?.detail || "Vote submission failed"));
               }
            } catch (e) {
               reject(e);
            } finally {
               socket.close();
            }
         };

         socket.onerror = () => {
            if (!responded) {
               responded = true;
               clearTimeout(timeout);
               reject(new Error("WebSocket error"));
            }
         };

         socket.onclose = () => {
            if (!responded) {
               responded = true;
               clearTimeout(timeout);
               reject(new Error("WebSocket closed before response"));
            }
         };
      });
   }

   return {
      votePolls,
      voteMultiSelect
   }
});