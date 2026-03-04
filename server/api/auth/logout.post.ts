import {apiFetch} from "#server/utils/api";
import type {ErrorResponse} from "#shared/types/auth";

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
        const springError: ErrorResponse = e?.data
        console.error('Erreur Spring Boot:', JSON.stringify(springError, null, 2))

        throw createError({
            statusCode: springError?.status || 500,
            data: {
                message: springError?.message || 'Erreur lors de la déconnexion',
                validationErrors: springError?.validationErrors || null,
            }
        })
    } finally {
        deleteCookie(event, 'auth_token')
        deleteCookie(event, 'refresh_token')
    }
})