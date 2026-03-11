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
  id: string;
  presentation_code?: string;
  title: string;
  slides: Slide[];
  host?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Slide {
  id?: string;
  title?: string;
  components?: SlideComponent[];
  backgroundColor?: string;
  backgroundImage?: string;
}

export interface SlideComponent {
  id: string;
  type: string,
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  src?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  rotation?: number; 
  zIndex?: number;
}

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
export interface Option{
  icon: Component
  label: string
  color: string
}
