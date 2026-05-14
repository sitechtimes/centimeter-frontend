function accessTokenExpirySec(token: string): number | null {
  try {
    const p = token.split(".")[1]
    if (!p) return null
    let b64 = p.replace(/-/g, "+").replace(/_/g, "/")
    while (b64.length % 4) b64 += "="
    const exp = (JSON.parse(atob(b64)) as { exp?: unknown }).exp
    return typeof exp === "number" && Number.isFinite(exp) ? exp : null
  } catch {
    return null
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const userStore = useUserStore()
  if (!userStore.isAuth) return

  const token = userStore.user?.access
  const exp = token ? accessTokenExpirySec(token) : null
  const expired = exp == null || Date.now() >= exp * 1000
  if (!expired) return

  await userStore.logOut()
  if (to.path.startsWith("/auth")) return
  return navigateTo("/auth/login")
})
