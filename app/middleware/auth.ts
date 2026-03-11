export default defineNuxtRouteMiddleware(async () => {
    const { storeSession, clearSession, isAuthenticated } = useAuth()

    if (isAuthenticated.value) return
    const fetch = useRequestFetch()

    try {
        const data = await fetch<AuthResponse>('/api/auth/me')
        if (data?.userId) {
            storeSession(data)
            return
        }
    } catch (e: any) {
        if (e?.status === 401) {
            const refreshToken = useCookie('refresh_token')
            if (refreshToken.value) return
        }
        clearSession()
    }

    return navigateTo('/auth/login')
})