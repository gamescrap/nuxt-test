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