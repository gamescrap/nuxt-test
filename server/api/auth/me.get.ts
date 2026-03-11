export default defineEventHandler((event) => {
    const token = getCookie(event, 'auth_token')

    if (!token) {
        throw createError({ status: 401, message: 'Non authentifié' })
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
        throw createError({ status: 401, message: 'Token invalide' })
    }

    let decoded: any
    try {
        const payload = parts[1] as string
        decoded = JSON.parse(
            Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
        )
    } catch {
        throw createError({ status: 401, message: 'Token invalide' })
    }

    return {
        userId: parseInt(decoded.sub),
        roles: decoded.roles,
    }
})