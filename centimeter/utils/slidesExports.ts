export const slideOption = ref("")
export const slides = ref<Slide[]>([])
export const textEditPanel = ref(false)
export const optionsEditPanel = ref(false)

export const MultipleChoiceEditPanel = computed(() => (
    [
    text: {
        open: false
    },
    options: {
        open: false
    }
]

))

export const openSlide = () => {
    slides.value.forEach((slide) => {
        if (slide.on_slide) {
            return slide.components 
        } else return ""
    });
}