<template>
    <div>
        <img src="" alt="ProfilePicture" @click="changeAvatarDropdown">
        <h3 v-if="changeAvatar">
            Change Avatar
        </h3>
        <h1>{{ UserStore.user?.username }}</h1>
        <h2>{{ email }}</h2>
    </div>
    <div>
        <button v-if="!editProfile" @click="editProfileComponent">Edit Profile</button>
        <div v-if="editProfile">
            <h1>Username</h1>
            <input type="text" placeholder="Username" ref="UsernameInput">
            <br>
            <button>Save</button>
            <button @click="cancelProfileChanges">Cancel</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { ref } from 'vue';

const UserStore = useUserStore()
const email = ref("")
const changeAvatar = ref(false)
const editProfile = ref(false)

const UsernameInput = ref("")

const changeAvatarDropdown = () => {
    changeAvatar.value = !changeAvatar.value
}
/* pretty sure theres a better name for this */
const editProfileComponent = () => {
    editProfile.value = !editProfile.value
}
const saveProfileChanges = () => {
    UserStore.user?.username == UsernameInput.value
    editProfile.value = false
}
const cancelProfileChanges = () => {
    editProfile.value = false
}

</script>

<style scoped>

</style>