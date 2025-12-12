import type { Component } from 'vue'
export interface User {
  id?: string;
  email?: string;
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

export interface JoinSessionRequest {
  join_code: string;
  nickname: string;
}

export interface JoinSessionResponse {
  sessionId: string;
  userId: string;
  nickname: string;
  status: 'waiting' | 'active';
}

export interface Session {
  id: string;
  code: string;
  allowsWaitingRoom: boolean;
  isActive: boolean;
}

export interface SessionStatus {
  is_active: boolean;
  status: 'waiting' | 'active' | string;
}

export interface Slide {
  type: string;
  id?: string;
  content?: any;
}

export interface Presentation {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  slides?: Slide[];
}
