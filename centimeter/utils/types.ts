// Re-export all types from organized domain-specific files
export type { User } from './userTypes'
export type { Presentation, Slide, SlideComponent } from './presentationTypes'
export type { JoinSessionResponse, SessionStatus } from './sessionTypes'
export type { ToastItem, ToastPayload, Option, NavButtons, ShowButtons } from './uiTypes'
export type { SlidesDropdown, MakePresentationSideBar } from './editorTypes'

// Re-export the presentation code generation utility
export { generatePresentationCode } from './presentation'
