import {apiFetch} from "#server/utils/api";
import {handleSpringError} from "#server/utils/errors";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        const data = await apiFetch<AuthResponse>('/register', {
            method: 'POST',
            body,
        })

        setAuthCookies(event, data.token, data.refreshToken)
        return { userId: data.userId, roles: data.roles }
    } catch (e: any) {
        handleSpringError(e, 'Erreur lors de la déconnexion')
    }
})