<template>
    <div>
        <main >
            <aside class="sidebar h-screen">
            <div v-for="Component in RightSBComponent" :key="Component.name" class="">
                <button class="no-underline text-[color:var(--text-color)] font-bold px-4 py-2 rounded hover:bg-[color:var(--primary-light)] transition border-2 w-50 m-2 p-6 ">
                    {{ Component.name }}
                </button>
            </div>
        </aside>
    </main>
        
    </div>
</template>

<script setup lang="ts">
type MakePresentationSideBar = {
    name: string;
    owncomponents: []
}
/* SB = SideBar */
const RightSBComponent = [
    {
        name: "Edit",
        owncomponents: []
    },
    {
        name: "Comments",
        owncomponents: []
    },
    {
        name: "Interactivity",
        owncomponents: []
    },
    {
        name: "Templates",
        owncomponents: []
    },

]as const as MakePresentationSideBar[];
</script>

<style scoped>

</style>