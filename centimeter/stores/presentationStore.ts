export const usePresentationStore = defineStore("presentationStore", () => {
  const presentations = ref<Presentation[]>([])

  function getAuthToken(): string {
    const userStore = useUserStore();
    const token = userStore.user?.access
    if (!token) {
      throw new Error("You are not authenticated. Please log in again.")
    }
    return token
  }

  async function createPresentation(title: string, description?: string) {
    try {
      const token = getAuthToken()

      const { ok, status, data } = await apiCall<Presentation | Record<string, unknown> | string | string[]>(
        backendBaseUrl() + "/presentations/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ title, description })
        }
      );

      if (ok && data && typeof data === "object" && "id" in data) {
        const presentation = data as Presentation
        presentations.value = [presentation, ...presentations.value]
        return presentation;
      } else {
        throw new Error(`Failed to create presentation (HTTP ${status})`);
      }
    } catch (err) {
      throw err;
    }
  }

  async function listPresentations() {
    const token = getAuthToken()

    const { ok, status, data } = await apiCall<Presentation[] | Record<string, unknown> | string | string[]>(
      backendBaseUrl() + "/presentations/list/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )

    if (!ok) throw new Error(`Failed to fetch presentations (HTTP ${status})`)

    const isPresentationArray = Array.isArray(data) && data.every((item) => {
      return typeof item === "object" && item !== null && "id" in item
    })

    presentations.value = isPresentationArray ? (data as Presentation[]) : []
    return presentations.value
  }

  async function getPresentation(code: string): Promise<any> {
    const token = getAuthToken()
    const { ok, status, data } = await apiCall<any>(
      backendBaseUrl() + `/presentations/${code}/get/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )

    if (!ok || !data) throw new Error(`Failed to fetch presentation (HTTP ${status})`)

    return data
  }

  async function attachPresentationToSession(presentationCode: string, sessionId: string | number): Promise<void> {
    const token = getAuthToken()
    const { ok, status } = await apiCall<Record<string, unknown> | string | string[]>(
      backendBaseUrl() + `/presentations/${presentationCode}/attach/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId })
      }
    )

    if (!ok) throw new Error(`Failed to attach presentation to session (HTTP ${status})`)
  }

  async function changeActiveSlide(presentationCode: string, slideId: string): Promise<void> {
    const token = getAuthToken()
    const { ok, status } = await apiCall<Record<string, unknown> | string | string[]>(
      backendBaseUrl() + `/presentations/${presentationCode}/slide/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ slide_id: slideId })
      }
    )

    if (!ok) throw new Error(`Failed to change active slide (HTTP ${status})`)
  }

  return {
    presentations,
    createPresentation,
    listPresentations,
    getPresentation,
    attachPresentationToSession,
    changeActiveSlide
  };
});