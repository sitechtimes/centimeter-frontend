export const slideOption = ref("")
export const slides = ref<Slide[]>([])
export const multipleChoiceEditPanel = ref(false)

export const openSlide = () => {
    slides.value.forEach((slide) => {
        if (slide.on_slide) {
            return slide.type
        } else return ""
    });
}