<template>
    <div class="relative bg-[var(--bg-color)] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[var(--faded-bg-color)] hover:border-slate-800 transition-colors duration-200">
        <div
            role="region"
            aria-label="Presentation canvas"
            class="w-[96vw] max-w-[1400px] aspect-video bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden p-10"
        >
            <input id="MultipleChoiceQuestion" type="text" @click="changeText(yourQuestion, 'Ask your question here...', textEditPanel)" v-model="yourQuestion" class="h-[15%] p-5">
        <div @click="openOptionEditPanel" class="flex flex-wrap gap-4 h-[60%] p-10 border-2 border-transparent hover:border-slate-800 transition-colors duration-200"> 
            <div v-for="choice in placeHolderOptions">
                <ol>{{ choice.position }} + {{ choice.option_text }}</ol>
            </div>

            <button @click="addOption">add option</button>
        </div>
    </div>
        
    </div>
</template>

<script setup lang="ts">
import type { EditPanel, PollsOption } from '~/utils/types'

const yourQuestion = ref("Ask your question here...")
const textEditPanel = multipleChoiceEditPanel.value[1].open


const openOptionEditPanel = () => {
    optionsEditPanel.value = true
}

const emit = defineEmits({

    open: (editPanel: EditPanel) => {
        if (!editPanel.open){
            editPanel.open = true
            return editPanel.open
        }
    },

    text: (text: string, originalText: string, isOpen: boolean) => {
        if ((text == originalText) && isOpen){
            text = ""
            console.log(text, originalText, isOpen)
            return text
        } else if ((text !== originalText) && !isOpen) {
            text = originalText
            return text
        }
    }

})

const openEditPanel = (editPanel: EditPanel) => {
    emit('open', editPanel)
}

const changeText = (text: string, originalText: string, isOpen: boolean) => {
    emit('text', text, originalText, isOpen)
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
    console.log(textEditPanel)
    placeHolderOptions.value.push(defaultOptionName.value)
}

</script>

<style scoped>

</style>