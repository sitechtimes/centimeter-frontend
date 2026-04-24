export interface PollsOption {
  image?: string;
  color: string;
  option_text: string;
  position?: number;
  amount_chosen: number;
  is_correct?: boolean;
  chosen: boolean;
  backendId?: number;
}

export interface OpenPollsResponse{
  session_id: string;
  question?: string;
  is_quiz?: boolean;
  show_results?: boolean;
  created_at?: string;
  options: PollsOption[];
}

export type PollType = "single" | "multi" | "text" | "scale";
 
export interface CreatePollPayload {
  session_id: string | number;
  question: string;
  type?: PollType;
  options?: string[];        
  is_quiz?: boolean;
  points?: number;
  correct_option_indices?: number[]; 
  scale_min?: number;
  scale_max?: number;
  show_results?: boolean;
  duration_seconds?: number;
}