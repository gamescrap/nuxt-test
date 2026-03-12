export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    // LOG TEMPORAIRE
    console.log('apiBaseUrl:', config.apiBaseUrl)
    console.log('URL appelée:', `${config.apiBaseUrl}/login`)

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