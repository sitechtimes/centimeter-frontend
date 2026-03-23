import type { EditPanel, PollsOption } from "../utils/types"
import { defineStore } from "pinia"

export const slideOption = ref("")
export const slides = ref<Slide[]>([])

export const useMultipleChoiceStore = defineStore( "multipleChoiceStore", () => {
    const options = ref<PollsOption[]>([
        {
        color: "blue" /* supposed to be rgb */,
        option_text: "option 1",
        position: 1   
    },
    {
        color: "orange" /* supposed to be rgb */,
        option_text: "option 2",
        position: 2
    },
    {
        color: "black" /* supposed to be rgb */,
        option_text: "option 3",
        position: 3
    }
    ])

    const addOption = (option: PollsOption) => {
        options.value.push(option)
    }

    const removeOption = (index: number) => {
        options.value.splice(index, 1)
    }

    const textEditPanel = reactive<EditPanel>({
    component: "Text",
    open: false,
    })

    const optionEditPanel = reactive<EditPanel>({
    component: "Options",
    open: false,
    })

    const multipleChoiceEditPanel = reactive<EditPanel>({
    component: "MultipleChoice",
    open: false,
    })

    return { options, addOption, removeOption, textEditPanel, optionEditPanel, multipleChoiceEditPanel}
}   
)
