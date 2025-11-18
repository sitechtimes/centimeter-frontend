<template>
    <div>
        <div class="rounded-full max-h-32 max-w-32">   
            <img class="border-2 object-cover rounded-full h-max w-max" :src="BasicAvatar" v-if="!imageURL" alt="BasicAvatar" @click="changeAvatarDropdown">
            <img  v-if="imageURL" class="border-2 object-cover  rounded-full h-max w-max" :src="imageURL" alt="CustomAcatar" @click="changeAvatarDropdown">            
        </div>
        <div v-if="changeAvatar">
        <label for="uploadAvatar">Upload Picture</label>
        <input type="file" accept="image/*" id="uploadAvatar" hidden @change="getAvatar">
        </div>

        <h1>{{ UserStore.user?.username }}</h1>
        <h2>{{ email }}</h2>
    </div>
    <div>
        <button v-if="!editProfile" @click="editProfileComponent" class="w-20 h-20">Edit Profile</button>
        <div v-if="editProfile">
            <h1>Username</h1>
            <input type="text" placeholder="Username" ref="UsernameInput">
            <br>
            <button @click="saveProfileChanges">Save</button>
            <button @click="cancelProfileChanges">Cancel</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';

const UserStore = useUserStore()
const email = ref("")
const changeAvatar = ref(false)
const editProfile = ref(false)
const BasicAvatar = "/logo/basicProfilePic.svg"
const imageURL = ref<string|null>(null)

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
const getAvatar = async (event) => {
    const picture = event.target.files[0]
    imageURL.value = URL.createObjectURL(picture)
    changeAvatar.value = false

    console.log(picture)
}

</script>

<style scoped>

</style>