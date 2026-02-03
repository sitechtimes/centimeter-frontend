<template>
    <div class="h-screen flex items-start justify-center bg-[#efefef] p-6 pt-12">
        <div
            role="region"
            aria-label="Presentation canvas"
            class="w-[96vw] max-w-[1400px] aspect-video bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden"
        >
    <label for="MultipleChoiceQuestion">{{ yourQuestion }}</label>
    <input id="MultipleChoiceQuestion" class="hidden" type="text" @click="openMultipleChoiceEditPanel">
    </div>
        
    </div>
</template>

<script setup lang="ts">
const yourQuestion = ref("Ask your question here...")

const openMultipleChoiceEditPanel = () =>{
    multipleChoiceEditPanel.value = !multipleChoiceEditPanel.value
}

</script>

<style scoped>

</style>