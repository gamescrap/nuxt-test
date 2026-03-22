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

        const parts = data.token.split('.')
        const payload = JSON.parse(Buffer.from(parts[1] ?? '', 'base64').toString('utf-8'))

        return { userId: data.userId, roles: data.roles, exp: payload.exp }

    } catch (e: any) {
        handleSpringError(e, 'Erreur lors du rafraîchissement du token')
    }
})