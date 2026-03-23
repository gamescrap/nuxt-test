export default defineNuxtRouteMiddleware(async (to) => {
    const { storeSession, clearSession, isAuthenticated, isRefreshing } = useAuth()
    const isAuthPage = to.path.startsWith('/auth/')

    if (isAuthenticated.value) {
        if (isAuthPage) return navigateTo('/')
        return
    }

    if (isRefreshing.value) return

    const fetch = useRequestFetch()
    try {
        const data = await fetch<AuthResponse>('/api/auth/me')
        if (data?.userId) {
            storeSession(data)
            if (isAuthPage) return navigateTo('/')
            return
        }
    } catch (e: any) {
        if (e?.status === 401 && import.meta.client) {
            try {
                isRefreshing.value = true
                const refreshed = await $fetch<AuthResponse>('/api/auth/refresh', {
                    method: 'POST',
                    ignoreResponseError: true
                })
                if (refreshed?.userId) {
                    storeSession(refreshed)
                    void refreshNuxtData()
                    if (isAuthPage) return navigateTo('/')
                    return
                }
            } finally {
                isRefreshing.value = false
            }
        }
    }

    if (!isAuthPage) {
        clearSession()
        return navigateTo('/auth/login')
    }
})