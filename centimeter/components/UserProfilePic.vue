<template>
    <div>
        <img src="" alt="ProfilePicture" @click="changeProfileDropdown">
        <h3 v-if="editProfile">
            Change Avatar
        </h3>
        <h1>{{ email }}</h1>    
    </div>
    <div>
        <button>Edit Profile</button>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { ref } from 'vue';

const UserStore = useUserStore()
const email = ref("")
const editProfile = ref(false)

const changeProfileDropdown = () => {
    editProfile.value = !editProfile.value
}

</script>

<style scoped>

</style>