<template>
    <div v-if="!isSlide" class="h-screen flex items-start justify-center bg-[#efefef] p-6 pt-12">
        <div
            role="region"
            aria-label="Presentation canvas"
            class="w-[96vw] max-w-[1400px] aspect-video bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden"
        ></div>
    </div>
    <div>
        <MultipleChoiceSlides v-if=""/>
    </div>
    
    
</template>

<script setup lang="ts">
import MultipleChoiceSlides from './SlidesOptions/MultipleChoiceSlides.vue';
const slideLabel = (slideOption:string, ) => {
    const slideLabel = ref("")
    const isChosenAction = ref(slideLabel.value === slideOption)
    return {slideLabel, isChosenAction}
}
const isSlide = ref(slideLabel.value !== "")

</script>
