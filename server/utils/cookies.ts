import type { H3Event } from 'h3'

const isProduction = process.env.NODE_ENV === 'production'

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
}

export const setAuthCookies = (event: H3Event, token: string, refreshToken: string) => {
    const config = useRuntimeConfig()

    setCookie(event, 'auth_token', token, {
        ...cookieOptions,
        maxAge: config.accessTokenMaxAge,
    })

    setCookie(event, 'refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: config.accessTokenMinAge,
    })
}