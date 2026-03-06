import {apiFetch} from "#server/utils/api";

export default defineEventHandler(async (event): Promise<unknown> => {
    const token = getCookie(event, 'auth_token')

    if (!token) {
        throw createError({ status: 401, message: 'Non authentifié' })
    }

    const path = event.path.replace('/api', '')

    return await apiFetch(path, {
        method: event.method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: ['GET', 'HEAD'].includes(event.method) ? undefined : await readBody(event),
    })
})