import { apiFetch } from "#server/utils/api"
import { handleSpringError } from "#server/utils/errors"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        const data = await apiFetch<AuthResponse>('/register', {
            method: 'POST',
            body,
        })

        setAuthCookies(event, data.token, data.refreshToken)

        const parts = data.token.split('.')
        const payload = JSON.parse(Buffer.from(parts[1] ?? '', 'base64').toString('utf-8'))

        return { userId: data.userId, roles: data.roles, exp: payload.exp }
    } catch (e: any) {
        handleSpringError(e, 'Erreur lors de l\'inscription')
    }
})