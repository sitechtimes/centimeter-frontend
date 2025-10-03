<template>
    <div>
        <main >
            <aside class="sidebar h-screen p-0">
            <div v-for="Component in RightSBComponent" :key="Component.name" class="">
                <button @click="toggleOwnComponent(Component.o)" class="no-underline text-[color:var(--text-color)] font-bold px-4 py-2 rounded hover:bg-[color:var(--primary-light)] transition border-2 w-50 m-2 p-6 ">
                    {{ Component.name }}
                </button>
                
                <div v-if="owncomponent">
                    {{ Component.owncomponents }}
                </div>
                
            </div>
        </aside>
    </main>
        
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type MakePresentationSideBar = {
    name: string;
    owncomponents: unknown[]
}

const owncomponent = ref(false)

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

function toggleOwnComponent(components: []) {
    owncomponent.value = !owncomponent.value
    console.log(components)
}
</script>

<style scoped>

</style>