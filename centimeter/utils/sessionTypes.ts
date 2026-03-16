export interface JoinSessionResponse {
  id?: string;
  join_code: string;
  title: string;
  host?: string;
  created_at?: string;
}

export interface SessionStatus {
  status: string;
  is_active: boolean;
  participant_count?: number;
}
