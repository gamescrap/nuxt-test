const useUserId = () => useState<number | null>('userId', () => null)
const useRoles = () => useState<string[]>('roles', () => [])

export const useAuth = () => {
    const userId = useUserId()
    const roles = useRoles()
    const isAuthenticated = computed(() => !!userId.value)

    //region Utils
    const _storeSession = (data: AuthResponse) => {
        userId.value = data.userId
        roles.value = data.roles
    }

    const _clearSession = () => {
        userId.value = null
        roles.value = []
    }
    //endregion

    //region Actions
    const register = async (email: string, password: string) => {
        const data = await $fetch<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: { email, password },
            credentials: 'include',
        })
        _storeSession(data)
    }

    const login = async (email: string, password: string) => {
        const data = await $fetch<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
            credentials: 'include',
        })
        _storeSession(data)
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        _clearSession()
    }
    //endregion

    return { isAuthenticated, userId, roles, register, login, logout }
}