import type {H3Event} from "h3";

export const handleSpringError = (e: any, fallbackMessage = 'Une erreur est survenue.') => {
    const springError: ErrorResponse = e?.data

    throw createError({
        statusCode: springError?.status || 500,
        data: {
            message: springError?.message || fallbackMessage,
            validationErrors: springError?.validationErrors || null,
        }
    })
}

export const withTokenRefresh = async (event: H3Event, request: () => Promise<unknown>): Promise<unknown> => {
    try {
        return await request()
    } catch (e: any) {
        if (e?.response?.status === 401) {
            throw createError({ status: 401, message: 'Session expirée' })
        }
        handleSpringError(e)
    }
}