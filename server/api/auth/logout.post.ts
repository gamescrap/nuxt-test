import {apiFetch} from "#server/utils/api";

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
        console.warn(e, 'Erreur lors de la déconnexion')
    } finally {
        deleteCookie(event, 'auth_token')
        deleteCookie(event, 'refresh_token')
    }
})