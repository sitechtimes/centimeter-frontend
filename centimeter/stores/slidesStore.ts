import { defineStore } from "pinia"
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export const slideOption = ref("")
export const slides = ref<Slide[]>([])

export const useMultipleChoiceStore = defineStore( "multipleChoiceStore", () => {
    const options = ref<PollsOption[]>([
        {
        color: "#27F5EB",
        option_text: "option 1",
        position: 1,
        amount_chosen: 67
    },
    {
        color: "#F54927" ,
        option_text: "option 2",
        position: 2,
        amount_chosen: 23
    },
    {
        color: "#000000",
        option_text: "option 3",
        position: 3,
        amount_chosen: 47
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
        label: 'Votes',
        data: options.value.map((option: PollsOption) => option.amount_chosen),
        backgroundColor: options.value.map((option: PollsOption) => option.color),
        borderWidth: 1,
        }
    ]
    })

    const chartOptions = {
    scales: {
        y: {
            ticks: {
                display: false
            }
        },
        x:{
            ticks: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
    }

    return { options, addOption, removeOption, textEditPanel, optionEditPanel, multipleChoiceEditPanel, chartType, chartData, chartOptions }
})
