<template>
    <div>
        <main class="flex">
            <div class="fixed right-0 w-35 overflow-y-auto">
            <div v-for="Component in RightSBComponent" :key="Component.name" class="">
                <button @click="toggleOwnComponent(Component.name)" class="no-underline 
                color-[color:var(--text-color)] font-bold px-4 py-2 rounded hover:bg-
                [color:var(--primary-light)] transition border-2 w-30 m-2 p-6 ">
                    {{ Component.name }}
                </button>
            </div>
        </div>

        <div> <!--left part of screen SLIDES  -->
        <button @click="slidesclicker"
            class="o-underline 
                font-bold px-4 py-2 rounded
                 border-2 w-35 m-2 p-6">
            <h1>+ New Slides</h1>
         </button>

        <div v-if="isSlidesClicked" class="fixed border-2 h-150 w-80">
            <div v-for="slides in makingSlidesDropdown" :key="slides.typeOfSlide"
            class="w-40 overflow-y-auto">
                <button >
                    {{ slides.dropdown }}
            </button>
            </div>

        </div>
        </div>
        
<!-- Almost there read the tailwind layout position -->
        <div class="aspect-video border-2 flex justify-center h-fit w-screen ml-40 mr-40">
            <div class="relative">
                Presentations
            </div>
            <div class="fixed right-20 w-35 overflow-y-auto" v-if="clickedSidebar.length > 0">
                <div v-if="clickedSidebar.length > 0" class="border-2 m-2 p-6">
                    {{ clickedSidebar[0] }}
                </div>
            </div>
            
        </div>
        
    </main>
        
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SlidesDropdown, makePresentationSideBar } from "/src/utils/types.ts"

const clickedButton = ref<string|null>(null)
const clickedSidebar = ref<any[]>([])
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

]as const satisfies makePresentationSideBar[];


function toggleOwnComponent(componentname: string) {
    clickedButton.value = clickedButton.value === componentname ? null: componentname
    if (clickedButton.value !== null){
        clickedSidebar.value.push(clickedButton.value)
    } else {
        clickedSidebar.value = []
    }
}

function slidesclicker(){
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