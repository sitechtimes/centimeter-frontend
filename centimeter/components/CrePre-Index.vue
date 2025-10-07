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
        
        

        <div class="fixed left-0 h-screen w-40 overflow-y-auto">
            <button 
            class="o-underline 
                color-[color:var(--text-color)] font-bold px-4 py-2 rounded hover:bg-
                [color:var(--primary-light)] transition border-2 w-35 m-2 p-6 ">
                <h1>+ New Slides</h1>
            </button>
        </div>


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



</script>

<style scoped>

</style>