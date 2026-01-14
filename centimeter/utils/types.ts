import type { Component } from 'vue'
export interface User {
  id?: string;
  email?: string;
  username?: string;
  access?: string;
  refresh?: string;
}
export interface NavButtons {
  name: string;
  path: string;
  dropdown?: { name: string; path: string }[];
};
export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  duration?: number;
};
export interface ToastPayload {
  title: string;
  message?: string;
  duration?: number;
};

export interface SlidesDropdown {
    dropdown: string;
    typeOfSlide: string;
}

export interface MakePresentationSideBar {
    name: string;
    ownComponents: string[]
}

export interface ShowButtons {
  name: string;
  path: string;
  dropdown?: { name: string;}[];
};

export interface Presentation {
  presentation_name: string
  host: string
  last_interacted: string
}

export interface Slide {
  id?: string;
  type: string;
  title?: string;
}

export interface SessionStatus {
  is_active: boolean;
  session_code?: string;
  participants_count?: number;
}

export interface JoinSessionResponse {
  session_id: string;
  session_code: string;
  participant_id: string;
  nickname: string;
  joined_at?: string;
}