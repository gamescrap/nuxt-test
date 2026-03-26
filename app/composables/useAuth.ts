// ─── State (global) ─────────────────────────────
const useUserId = () => useState<number | null>('userId', () => null)
const useRoles = () => useState<string[]>('roles', () => [])
const useAuthRefreshing = () => useState<boolean>('authRefreshing', () => false)
const useTokenExp = () => useState<number | null>('tokenExp', () => null)
const useNeedsRefresh = () => useState<boolean>('needsRefresh', () => false)

export const useAuth = () => {
    // ─── State ──────────────────────────────────────────────────────────────
    const userId = useUserId()
    const roles = useRoles()
    const isRefreshing = useAuthRefreshing()
    const tokenExp = useTokenExp()
    const needsRefresh = useNeedsRefresh()

    // ─── Getters ────────────────────────────────────────────────────────────
    const isAuthenticated = computed(() => {
        if (!userId.value) return false
        if (!tokenExp.value) return false
        const now = Math.floor(Date.now() / 1000)
        return tokenExp.value > now
    })

    // ─── Actions ────────────────────────────────────────────────────────────
    const authFetch = $fetch.create({ credentials: 'include' })

    const _storeSession = (data: AuthResponse) => {
        userId.value = data.userId
        roles.value = data.roles
        tokenExp.value = data.exp ?? null
    }

    const storeSession = (data: AuthResponse) => _storeSession(data)

    const clearSession = () => {
        userId.value = null
        roles.value = []
        tokenExp.value = null
    }

    const register = async (email: string, password: string) => {
        const data = await authFetch<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: { email, password },
        })
        isRefreshing.value = true
        _storeSession(data)
    }

    const login = async (email: string, password: string) => {
        const data = await authFetch<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        })
        isRefreshing.value = true
        _storeSession(data)
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        clearSession()
    }

    const resetPassword = async (token: string, newPassword: string) => {
        await $fetch('/api/auth/reset-password', {
            method: 'POST',
            body: { token, newPassword }
        })
    }

    const reloadIfUnauthenticated = async () => {
        if (!isAuthenticated.value) {
            await navigateTo(useRoute().fullPath, { replace: true, external: true })
            return true
        }
        return false
    }

    const handleAuthError = async (e: any) => {
        if (e?.status === 401) {
            await navigateTo(useRoute().fullPath, { replace: true, external: true })
            return true
        }
        return false
    }

    const forgotPassword = async (email: string) => {
        await $fetch('/api/auth/forgot-password', {
            method: 'POST',
            body: { email }
        })
    }

    const refreshAndRetry = async <T>(request: () => Promise<T>): Promise<T> => {
        try {
            return await request()
        } catch (e: any) {
            if (e?.status !== 401) throw e

            const refreshed = await ($fetch as any)('/api/auth/refresh', {
                method: 'POST',
                ignoreResponseError: true
            }) as AuthResponse

            if (!refreshed?.userId) {
                await navigateTo(useRoute().fullPath, { replace: true, external: true })
                throw e
            }

            storeSession(refreshed)
            return await request()
        }
    }

    const refreshSession = async () => {
        const refreshed = await ($fetch as any)('/api/auth/refresh', {
            method: 'POST',
            ignoreResponseError: true
        }) as AuthResponse

        if (refreshed?.userId) {
            _storeSession(refreshed)
        }
    }

    // ─── Expose ─────────────────────────────────────────────────────────────
    return {
        isAuthenticated, isRefreshing, userId, roles, needsRefresh,
        storeSession, clearSession, forgotPassword,
        register, login, logout, resetPassword,
        reloadIfUnauthenticated, handleAuthError, refreshAndRetry, refreshSession
    }
}