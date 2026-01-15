import type { LucideProps } from 'lucide-vue-next';
import type { FunctionalComponent, Component } from 'vue'
export interface User {
  id?: string;
  email?: string;
  username?: string;
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
  type?: string;
  title?: string;
}

export interface Option {
  icon: FunctionalComponent<LucideProps>;
  label: string;
  color: string;
  slides: Component;
}