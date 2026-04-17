export interface PollsOption {
  image?: string;
  color: string;
  option_text: string;
  position?: number;
  amount_chosen: number;
  is_correct?: boolean;
  chosen: boolean;
}

export interface OpenPollsResponse{
  session_id: string;
  question?: string;
  is_quiz?: boolean;
  show_results?: boolean;
  created_at?: string;
  options: PollsOption[];
}

export interface LimitPollsChoices {
  slide_id: string;
  limit: number;
}