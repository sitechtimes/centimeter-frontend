<template>
    <h1>Name & Image</h1>
    <ChevronDown @click="changeProfileDropdown"/>
    <div>
        <div class="rounded-full max-h-16 max-w-16 border-2 object-cover">   
            <img class="rounded-full h-16 w-16 object-contain":src="BasicAvatar" alt="BasicAvatar" v-if="!isImportedAvatar">
            <img v-if="isImportedAvatar" :src="imageURL" alt="CustomAvatar" class="h-16 w-16 rounded-full object-contain">            
        </div>
        <div v-if="changeAvatar">
        <label class="border-2" for="uploadAvatar">Upload Picture</label>
        <input type="file" accept="image/*" id="uploadAvatar" hidden @change="getAvatar">
        <h1>Username</h1>
            <input type="text" placeholder="Username" ref="UsernameInput">
            <br>
            <button @click="saveProfileChanges">Save</button>
            <button @click="cancelProfileChanges">Cancel</button>
        </div>

        <h1>{{ userStore.user?.username }}</h1>
        <h2>{{ email }}</h2>
    </div>
    <div>
        </div>
        <br>
        <theme-toggle/>
</template>

<script setup lang="ts">
    import { ChevronDown } from 'lucide-vue-next'
const userStore = useUserStore()
const email = ref("")
const changeAvatar = ref(false)
const editProfile = ref(false)
const isImportedAvatar = ref(false)
const BasicAvatar = "/logo/basicProfilePic.svg"
const imageURL = ref<string|null>(null)

const UsernameInput = ref("")

const changeProfileDropdown = () => {
    changeAvatar.value = !changeAvatar.value
}
const saveProfileChanges = () => {
    userStore.user?.username == UsernameInput.value
    editProfile.value = false
}
const cancelProfileChanges = () => {
    editProfile.value = false
}
const getAvatar = async (event) => {
    const picture = event.target.files[0]
    imageURL.value = URL.createObjectURL(picture)
    changeAvatar.value = false
    isImportedAvatar.value = true

    console.log(picture)
}

</script>

<style scoped>

</style>