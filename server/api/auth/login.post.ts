import type { AuthResponse, ErrorResponse } from '#shared/types/auth'
import {apiFetch} from "#server/utils/api";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        const data = await apiFetch<AuthResponse>('/login', {
            method: 'POST',
            body,
        })

        setCookie(event, 'auth_token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 15,
            path: '/',
        })

        setCookie(event, 'refresh_token', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return { userId: data.userId, roles: data.roles }

    } catch (e: any) {
        const springError: ErrorResponse = e?.data
        console.error('Erreur Spring Boot:', JSON.stringify(springError, null, 2))
        throw createError({
            statusCode: springError?.status || 500,
            data: {
                message: springError?.message || 'Erreur lors de l\'inscription',
                validationErrors: springError?.validationErrors || null,
            }
        })
    }
})