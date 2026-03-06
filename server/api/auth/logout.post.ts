import {apiFetch} from "#server/utils/api";
import {handleSpringError} from "#server/utils/errors";

export default defineEventHandler(async (event) => {
    try {
        await apiFetch('/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getCookie(event, 'auth_token')}`
            },
            body: {
                refreshToken: getCookie(event, 'refresh_token')
            }
        })

        return { success: true }

    } catch (e: any) {
        handleSpringError(e, 'Erreur lors de la déconnexion')
    } finally {
        deleteCookie(event, 'auth_token')
        deleteCookie(event, 'refresh_token')
    }
})