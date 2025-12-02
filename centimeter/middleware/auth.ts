import type { RouteLocationNormalizedGeneric } from "vue-router";

let previousRoute: RouteLocationNormalizedGeneric | undefined = undefined;

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const isAuth = storeToRefs(userStore).isAuth;
  const router = useRouter();

  if (
    !isAuth.value &&
    router
      .getRoutes()
      .filter((route) => route.meta.requiresAuth == true)
      .flatMap((route) => route.path)
      .includes(to.path)
  )
    return navigateTo("/auth/login");

  previousRoute = from;
});

export function getPreviousRoute() {
  return previousRoute;
}
