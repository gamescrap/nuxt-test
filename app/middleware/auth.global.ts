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
        // auth.global.ts
        if (e?.status === 401 && import.meta.client) {
            console.log('[MIDDLEWARE] 401 détecté → début refresh')
            try {
                isRefreshing.value = true
                console.log('[MIDDLEWARE] isRefreshing = true')
                const refreshed = await $fetch<AuthResponse>('/api/auth/refresh', {
                    method: 'POST',
                    ignoreResponseError: true
                })
                if (refreshed?.userId) {
                    console.log('[MIDDLEWARE] refresh OK → storeSession')
                    storeSession(refreshed)
                    void refreshNuxtData()
                    if (isAuthPage) return navigateTo('/')
                    return
                }
                console.log('[MIDDLEWARE] refresh échoué')
            } finally {
                isRefreshing.value = false
                console.log('[MIDDLEWARE] isRefreshing = false')
            }
        }
    }

    if (!isAuthPage) {
        clearSession()
        return navigateTo('/auth/login')
    }
})