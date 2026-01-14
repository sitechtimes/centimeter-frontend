export default defineNuxtRouteMiddleware(async (to) => {
  const sessionStore = useSessionStore();
  const sessionCode = to.query.code as string;

  if (!sessionCode) {
    return navigateTo('/', {
      replace: true
    });
  }

  try {
    const sessionStatus = await sessionStore.checkSessionStatus(sessionCode);
    
    if (!sessionStatus) {
      return navigateTo('/', {
        replace: true
      });
    }

    if (!sessionStatus.is_active) {
      return navigateTo('/', {
        replace: true
      });
    }
    return;
  } catch (error) {
    console.error('Session validation failed:', error);
    return navigateTo('/', {
      replace: true
    });
  }
});