<template>
    <div class="relative bg-[var(--bg-color)] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[var(--faded-bg-color)] hover:border-slate-800 transition-colors duration-200">
        <div
            role="region"
            aria-label="Presentation canvas"
            class="w-[96vw] max-w-[1400px] aspect-video bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden p-10"
        >
            <input id="MultipleChoiceQuestion" type="text" @click="openTextEditPanel" v-model="yourQuestion" class="h-[15%] p-5">
        <div @click="openOptionEditPanel" class="flex flex-wrap gap-4 h-[60%] p-10 border-2 border-transparent hover:border-slate-800 transition-colors duration-200"> 
            <div v-for="choice in placeHolderOptions">
                <ol>{{ choice.amount_chosen }} {{ choice.option }}</ol>
            </div>

            <button @click="addOption">add option</button>
        </div>
    </div>
        
    </div>
</template>

<script setup lang="ts">
import type { EditPanel } from '~/utils/types'

const yourQuestion = ref("Ask your question here...")


const openTextEditPanel = () =>{
    textEditPanel.value = true
    yourQuestion.value = ""
}

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

    text: (text:string, originalText: boolean) => {

    }

})

const openEditPanel = (editPanel: EditPanel) => {
    emit('open', editPanel)
}

const placeHolderOptions = ref<MultipleChoiceOption[]>([
    {
        color: "blue" /* supposed to be rgb */,
        option: "option 1",
        amount_chosen: 0   
    },
    {
        color: "orange" /* supposed to be rgb */,
        option: "option 2",
        amount_chosen: 0   
    },
    {
        color: "black" /* supposed to be rgb */,
        option: "option 3",
        amount_chosen: 0   
    }
])

const defaultOptionName = computed(()=>(
    {
        color: "black",
        option: "option " + (placeHolderOptions.value.length + 1),
        amount_chosen: 0,
    }
)
)

const addOption = () =>{
    placeHolderOptions.value.push(defaultOptionName.value)
}

</script>

<style scoped>

</style>