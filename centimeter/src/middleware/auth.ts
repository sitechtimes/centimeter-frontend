import { useUserStore } from "@/stores/user";

export default defineVueRouteMiddleware((to) =>{
    const userStore = useUserStore()

    if (!to.path.startswith('/auth' || '/'))
        return navigateTo('/auth/signup')
})