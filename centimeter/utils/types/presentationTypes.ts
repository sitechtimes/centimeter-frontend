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
  type?: string;
  title?: string;
  components?: SlideComponent[];
  options?: PollsOption[];
  question?: string;
  backgroundColor?: string;
  backgroundImage?: string;
}

export interface SlideComponent {
  id: string;
  type: string;
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
