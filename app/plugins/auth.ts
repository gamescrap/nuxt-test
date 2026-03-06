export default defineNuxtPlugin(async () => {
    const { userId, roles } = useAuth()

    if (userId.value) return

    const data = await $fetch<AuthResponse | null>('/api/auth/me', {
        ignoreResponseError: true
    }).catch(() => null)

    if (data?.userId) {
        userId.value = data.userId
        roles.value = data.roles
    }
})