export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    try {
        const data = await apiFetch<AuthResponse>('/login', {
            method: 'POST',
            body,
        })
        setAuthCookies(event, data.token, data.refreshToken)
        return { userId: data.userId, roles: data.roles }
    } catch (e: any) {
        console.log('Erreur brute:', JSON.stringify(e))
        handleSpringError(e, 'Erreur lors de la connexion')
    }
})