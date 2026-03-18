import type { EditPanel } from "../utils/types"

export const slideOption = ref("")
export const slides = ref<Slide[]>([])
export const textEditPanel = ref(false)
export const optionsEditPanel = ref(false)

export const multipleChoiceEditPanel = defineStore(
    
)

export const openSlide = () => {
    slides.value.forEach((slide) => {
        if (slide.on_slide) {
            return slide.components 
        } else return ""
    });
}