import type { AuthResponse } from '#shared/types/auth'

export default defineEventHandler(async (event) => {
    const currentRefreshToken = getCookie(event, 'refresh_token')

    if (!currentRefreshToken) {
        throw createError({ status: 401, message: 'Refresh token manquant' })
    }

    try {
        const data = await apiFetch<AuthResponse>('/refresh', {
            method: 'POST',
            body: { refreshToken: currentRefreshToken },
        })

        setAuthCookies(event, data.token, data.refreshToken)

        return { userId: data.userId, roles: data.roles }

    } catch (e: any) {
        handleSpringError(e, 'Erreur lors du rafraîchissement du token')
    }
})