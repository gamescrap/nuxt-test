const useUserId = () => useState<number | null>('userId', () => null)
const useRoles = () => useState<string[]>('roles', () => [])

export const useAuth = () => {
    const userId = useUserId()
    const roles = useRoles()

    const isAuthenticated = computed(() => !!userId.value)

    const register = async (email: string, password: string) => {
        const data = await $fetch<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: { email, password },
            credentials: 'include',
        })
        userId.value = data.userId
        roles.value = data.roles
    }

    const login = async (email: string, password: string) => {
        const data = await $fetch<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
            credentials: 'include',
        })
        userId.value = data.userId
        roles.value = data.roles
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        userId.value = null
        roles.value = []
    }

    return { isAuthenticated, userId, roles, register, login, logout }
}