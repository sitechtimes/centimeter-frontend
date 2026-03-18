<template>
    <div class="relative bg-[var(--bg-color)] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[var(--faded-bg-color)] hover:border-slate-800 transition-colors duration-200">
        <div
            role="region"
            aria-label="Presentation canvas"
            class="w-[96vw] max-w-[1400px] aspect-video bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden p-10"
        >
            <input id="MultipleChoiceQuestion" type="text" @click="changeText()" v-model="changedQuestion" class="h-[15%] p-5">
        <div class="flex flex-wrap gap-4 h-[60%] p-10 border-2 border-transparent hover:border-slate-800 transition-colors duration-200"> 
            <div v-for="choice in placeHolderOptions">
                <ol>{{ choice.position }}  {{ choice.option_text }}</ol>
            </div>

            <button @click="addOption">add option</button>
        </div>
    </div>
        
    </div>
</template>

<script setup lang="ts">
import type { EditPanel, PollsOption } from '~/utils/types'

const changedQuestion = ref("Ask your question here...")
const textEditPanel = multipleChoiceEditPanel.value[1].open
const optionEditPanel = multipleChoiceEditPanel.value[2].open



const emit = defineEmits({

    open: (editPanel: EditPanel) => {
        if (!editPanel.open){
            editPanel.open = true
            console.log(editPanel)
            return editPanel.open
        }
    },

})

const openEditPanel = (editPanel: EditPanel) => {
    emit('open', editPanel)
}

const changeText = () => {
    if (changedQuestion.value === "Ask your question here...") {
        changedQuestion.value = " "
    } else if (changedQuestion.value === " ") {
        changedQuestion.value = "Ask your question here..."
    }
}

const placeHolderOptions = ref<PollsOption[]>([
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

const defaultOptionName = computed(()=> <PollsOption>{
    color: "black",
    option_text: "option " + (placeHolderOptions.value.length + 1),
    position: 1,
}
)


const addOption = () =>{
    openEditPanel(multipleChoiceEditPanel.value[2])
    placeHolderOptions.value.push(defaultOptionName.value)
    console.log(optionEditPanel)
}

</script>

<style scoped>

</style>