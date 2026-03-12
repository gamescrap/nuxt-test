export default defineNuxtPlugin(async () => {
    const { storeSession, clearSession, isAuthenticated, isRefreshing } = useAuth()

    if (isAuthenticated.value) return

    const meData = await $fetch<AuthResponse | null>('/api/auth/me', {
        ignoreResponseError: true
    })

    if (meData?.userId) {

        storeSession(meData)
        return
    }

    try {
        isRefreshing.value = true
        const refreshed = await $fetch<AuthResponse | null>('/api/auth/refresh', {
            method: 'POST',
            ignoreResponseError: true
        })
        if (refreshed?.userId) {
            storeSession(refreshed)
            return
        }
    } finally {
        isRefreshing.value = false
    }

    clearSession()
    await navigateTo('/auth/login')
})