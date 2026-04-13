export interface PollsOption {
  image?: string;
  color: string;
  option_text: string;
  position?: number;
  amount_chosen: number;
  is_correct?: boolean;
}

export interface OpenPollsResponse{
  session_id: string;
  question?: string;
  is_quiz?: boolean;
  show_results?: boolean;
  created_at?: string;
  options: PollsOption[];
}