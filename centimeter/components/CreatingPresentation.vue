<template>
    <div>
        <main class="bg-[color:var(--bg-color)]">
            <div class="fixed right-0 w-35 overflow-y-auto">
            <div v-for="component in RightSBComponent" :key="component.name" class="">
                <button @click="toggleOwnComponent(component.name)" class="no-underline color-[color:var(--text-color)] font-bold px-4 py-2 text-[color:var(--text-color)] rounded hover:bg-[color:var(--primary-light)] transition border-2 border-[color:var(--bg-color-contrast)] w-30 m-2 p-6 ">
                    {{ component.name }}
                </button>
            </div>
        </div>

        <div class="max-h-130"> <!--left part of screen SLIDES  -->
        <button @click="slidesClicker"
            class="o-underline 
                font-bold px-4 py-2 text-[color:var(--bg-color-contrast)] rounded border-2 border-[color:var(--text-color)] w-35 h-max m-2 p-6">
            <h1>+ New Slides</h1>
         </button>

        <div v-if="isSlidesClicked" class="fixed border-2 border-[color:var(--text-color)] h-150 w-80">
            <div v-for="slides in makingSlidesDropdown" :key="slides.typeOfSlide"
            class="w-40 overflow-y-auto text-[color:var(--bg-color-contrast)]">
                <button >
                    {{ slides.dropdown }}
            </button>
            </div>

        </div>
        </div>
        
<!-- Almost there read the tailwind layout position -->
        <div class="aspect-video border-2 border-[color:var(--text-color)] flex justify-center h-fit w-screen ml-40 mr-40">
            <div class="relative text-[color:var(--bg-color-contrast)]">
                Presentations
            </div>
            <div class="fixed right-20 w-35 overflow-y-auto" v-if="clickedSidebar.length > 0">
                <div v-if="clickedSidebar.length > 0" class="border-2 border-[color:var(--bg-color-contrast)] m-2 p-6 text-[color:var(--text-color)]">
                    {{ clickedSidebar[0] }}
                </div>
            </div>
            
        </div>
        
    </main>
        
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SlidesDropdown, MakePresentationSideBar } from "../pages/utils/types.ts"

const clickedButton = ref<string|null>(null)
const clickedSidebar = ref<string[]>([])
const isSlidesClicked = ref(false)

/* SB = SideBar */
const RightSBComponent = [
    {
        name: "Edit",
        ownComponents: ['Edit']
    },
    {
        name: "Comments",
        ownComponents: ['Comments']
    },
    {
        name: "Interactivity",
        ownComponents: ['Interactivity']
    },
    {
        name: "Templates",
        ownComponents: ['Bam']
    },

]as const satisfies MakePresentationSideBar[];


function toggleOwnComponent(componentName: string) {
    clickedButton.value = clickedButton.value === componentName ? null: componentName
    if (clickedButton.value !== null){
        clickedSidebar.value.push(clickedButton.value)
    } else {
        clickedSidebar.value = []
    }
}

function slidesClicker(){
    isSlidesClicked.value = !isSlidesClicked.value
}

/* Do it later */
const makingSlidesDropdown =[
    {
        dropdown: "Multiple Choice",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Word Cloud",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Open Ended",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Scales",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Ranking",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Q&A",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Guess the Number",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "100 points",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "2 x 2 Grid",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Quick Form",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Pin on Image",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Select Answer ",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Type Answer",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Text",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Image",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Video",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Google slides",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Powerpoint",
        typeOfSlide: "There Will Be An Id Here"
    },
    {
        dropdown: "Miro",
        typeOfSlide: "There Will Be An Id Here"
    },
]as const satisfies SlidesDropdown[];

</script>

<style scoped>

</style>