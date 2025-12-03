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

export interface Slide {
  id?: string;
  type?: string;
  // arbitrary payload for different slide types
  [key: string]: any;
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
