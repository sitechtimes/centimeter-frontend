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

        <div v-if="isslidesclicked" class="fixed border-2 h-150 w-80">
            <div v-for="slides in SlidesDropdown" :key="slides.TypeofSlide"
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
            <div class="fixed right-20 w-35 overflow-y-auto" v-if="clickedsidebar.length > 0">
                <div v-if="clickedsidebar.length > 0" class="border-2 m-2 p-6">
                    {{ clickedsidebar[0] }}
                </div>
            </div>
            
        </div>
        
    </main>
        
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type MakePresentationSideBar = {
    name: string;
    owncomponents: any[]
}

const clickedbutton = ref<string|null>(null)
const clickedsidebar = ref<any[]>([])
const isslidesclicked = ref(false)

/* SB = SideBar */
const RightSBComponent = [
    {
        name: "Edit",
        owncomponents: ['Edit']
    },
    {
        name: "Comments",
        owncomponents: ['Comments']
    },
    {
        name: "Interactivity",
        owncomponents: ['Interactivity']
    },
    {
        name: "Templates",
        owncomponents: ['Bam']
    },

]as const as MakePresentationSideBar[];


function toggleOwnComponent(componentname: string) {
    clickedbutton.value = clickedbutton.value === componentname ? null: componentname
    if (clickedbutton.value !== null){
        clickedsidebar.value.push(clickedbutton.value)
    } else {
        clickedsidebar.value = []
    }
}

function slidesclicker(){
    isslidesclicked.value = !isslidesclicked.value
}

type SlidesDropdown ={
    dropdown: string;
    TypeofSlide: string; /* This is going to be an id for the slide and it's gonna put up the type of slide when clicked */
}

/* Do it later */
const SlidesDropdown =[
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Word Cloud",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Open Ended",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    {
        dropdown: "Multiple Choice",
        TypeofSlide: "Multiple Choice"
    },
    
]as const as SlidesDropdown[];







</script>

<style scoped>

</style>