const useUserId = () => useState<number | null>('userId', () => null)
const useRoles = () => useState<string[]>('roles', () => [])
const useAuthRefreshing = () => useState<boolean>('authRefreshing', () => false)
const useTokenExp = () => useState<number | null>('tokenExp', () => null)
const useNeedsRefresh = () => useState<boolean>('needsRefresh', () => false)

export const useAuth = () => {
    const userId = useUserId()
    const roles = useRoles()
    const isRefreshing = useAuthRefreshing()
    const tokenExp = useTokenExp()
    const needsRefresh = useNeedsRefresh()

    const isAuthenticated = computed(() => {
        if (!userId.value) return false
        if (!tokenExp.value) return false
        const now = Math.floor(Date.now() / 1000)
        return tokenExp.value > now
    })

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

    const authFetch = $fetch.create({ credentials: 'include' })

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

    const handleAuthError = (error: Ref<any>) => {
        if (error.value?.status === 401) {
            window.location.reload()
            return true
        }
        return false
    }

    return { isAuthenticated, isRefreshing,  userId, roles, tokenExp, needsRefresh,
        handleAuthError, storeSession, clearSession, register, login, logout }
}