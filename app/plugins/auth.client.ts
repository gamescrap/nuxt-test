export default defineNuxtPlugin(async () => {
    const { storeSession, clearSession, isAuthenticated } = useAuth()

    if (isAuthenticated.value) return

    const userData = await $fetch<AuthResponse | null>('/api/auth/me', {
        ignoreResponseError: true
    })

    if (userData?.userId) {
        storeSession(userData)
        return
    }

    clearSession()
    await navigateTo('/auth/login')
})