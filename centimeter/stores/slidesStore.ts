import type { EditPanel, PollsOption } from "../utils/pollsTypes"
import { defineStore } from "pinia"

export const slideOption = ref("")
export const slides = ref<Slide[]>([])

export const useMultipleChoiceStore = defineStore( "multipleChoiceStore", () => {
    const options = ref<PollsOption[]>([
        {
        color: "#27F5EB",
        option_text: "option 1",
        position: 1,
        amount_chosen: 0
    },
    {
        color: "#F54927" ,
        option_text: "option 2",
        position: 2,
        amount_chosen: 0
    },
    {
        color: "#000000",
        option_text: "option 3",
        position: 3,
        amount_chosen: 0
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

    const chartType = ref<'bar' | 'doughnut' | 'pie'>('bar')

    const chartData = ref({
        labels: options.value.map((option: PollsOption) => option.option_text),
        datasets: [
            {
                data: options.value.map((option: PollsOption) => option.amount_chosen),
                backgroundColor: options.value.map((option: PollsOption) => option.color),
            }
        ]
    })

    return { options, addOption, removeOption, textEditPanel, optionEditPanel, multipleChoiceEditPanel, chartType, chartData }
})
