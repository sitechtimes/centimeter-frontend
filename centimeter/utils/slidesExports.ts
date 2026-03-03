import type { EditPanel } from "./types"

export const slideOption = ref("")
export const slides = ref<Slide[]>([])
export const textEditPanel = ref(false)
export const optionsEditPanel = ref(false)

export const MultipleChoiceEditPanel = computed(() => <EditPanel[]>([
    {
        component: "Slide",
        open: true,
    },
    {
        component: "Text",
        open: true,
    },
    {
        component: "Option",
        open: true,
    }
]))

export const openSlide = () => {
    slides.value.forEach((slide) => {
        if (slide.on_slide) {
            return slide.components 
        } else return ""
    });
}