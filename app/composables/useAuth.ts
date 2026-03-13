const useUserId = () => useState<number | null>('userId', () => null)
const useRoles = () => useState<string[]>('roles', () => [])
const useAuthRefreshing = () => useState<boolean>('authRefreshing', () => false)

export const useAuth = () => {
    const userId = useUserId()
    const roles = useRoles()
    const isAuthenticated = computed(() => !!userId.value)
    const isRefreshing = useAuthRefreshing()

    const _storeSession = (data: AuthResponse) => {
        userId.value = data.userId
        roles.value = data.roles
    }

    const storeSession = (data: AuthResponse) => _storeSession(data)

    const clearSession = () => {
        userId.value = null
        roles.value = []
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

    return { isAuthenticated, isRefreshing,  userId, roles, storeSession, clearSession, register, login, logout }
}