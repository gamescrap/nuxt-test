export default defineNuxtRouteMiddleware(async () => {
    const { isAuthenticated, userId, roles } = useAuth()

    if (isAuthenticated.value) return

    try {
        const fetchWithRequest = useRequestFetch()
        const data = await fetchWithRequest<AuthResponse>('/api/auth/me')

        if (data?.userId) {
            userId.value = data.userId
            roles.value = data.roles
            return
        }
    } catch {
        // Pas de session valide
    }

    return navigateTo('/auth/login')
})