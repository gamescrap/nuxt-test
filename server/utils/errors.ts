import type {H3Event} from "h3";

export const handleSpringError = (e: any, fallbackMessage = 'Une erreur est survenue.') => {
    const springError: ErrorResponse = e?.data

    console.error('Erreur Spring Boot:', JSON.stringify(springError, null, 2))

    throw createError({
        statusCode: springError?.status || 500,
        data: {
            message: springError?.message || fallbackMessage,
            validationErrors: springError?.validationErrors || null,
        }
    })
}

export const withTokenRefresh = async (
    event: H3Event,
    request: () => Promise<unknown>
): Promise<unknown> => {
    try {
        return await request()

    } catch (e: any) {
        if (e?.response?.status !== 401) {
            handleSpringError(e)
        }

        const refreshToken = getCookie(event, 'refresh_token')
        if (!refreshToken) {
            throw createError({ status: 401, message: 'Session expirée' })
        }

        try {
            const refreshed = await apiFetch<AuthResponse>('/refresh', {
                method: 'POST',
                body: { refreshToken },
            })

            setAuthCookies(event, refreshed.token, refreshed.refreshToken)
            return await request()

        } catch {
            deleteCookie(event, 'auth_token')
            deleteCookie(event, 'refresh_token')
            throw createError({ status: 401, message: 'Session expirée, veuillez vous reconnecter' })
        }
    }
}