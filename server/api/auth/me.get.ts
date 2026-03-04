export default defineEventHandler((event) => {
    const token = getCookie(event, 'auth_token')

    if (!token) {
        throw createError({ statusCode: 401, message: 'Non authentifié' })
    }

    try {
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Format JWT invalide')
        }

        const payload = parts[1] as string
        const decoded = JSON.parse(
            Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
        )

        const now = Math.floor(Date.now() / 1000)
        if (decoded.exp < now) {
            throw createError({ statusCode: 401, message: 'Token expiré' })
        }

        return {
            userId: parseInt(decoded.sub),
            roles: decoded.roles,
        }

    } catch (e: any) {
        throw createError({ statusCode: 401, message: 'Token invalide' })
    }
})