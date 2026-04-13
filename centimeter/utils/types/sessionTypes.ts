export interface JoinSessionResponse {
  id?: string;
  join_code: string;
  title: string;
  host?: string;
  created_at?: string;
}

export interface SessionParticipant {
  id: number;
  session: number;
  nickname: string;
  in_session: boolean;
  is_active: boolean;
  date_joined?: string;
  last_active?: string;
}

export interface ParticipantPresencePayload {
  join_code: string;
  nickname: string;
}

export interface SessionStatus {
  id?: string | number;
  join_code?: string;
  title?: string;
  host_name?: string;
  status?: string;
  is_active: boolean;
  participant_count?: number;
  created_at?: string;
  presentation?: {
    id?: string | number;
    presentation_code?: string;
    title?: string;
    slides?: any[];
    active_slide?: string | null;
  } | null;
}
