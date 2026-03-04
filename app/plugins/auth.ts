export default defineNuxtPlugin(async () => {
    const { userId, roles } = useAuth()

    if (userId.value) return

    const data = await $fetch<AuthResponse>('/api/auth/me', {
        ignoreResponseError: true
    })

    if (data?.userId) {
        userId.value = data.userId
        roles.value = data.roles
    }
})