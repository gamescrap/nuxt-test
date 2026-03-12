import {apiFetch} from "#server/utils/api";
import {withTokenRefresh} from "#server/utils/errors";

export default defineEventHandler(async (event): Promise<unknown> => {
    if (event.path.startsWith('/api/auth')) {
        throw createError({ status: 404, message: 'Not found' })
    }

    const token = getCookie(event, 'auth_token')

    if (!token) {
        throw createError({ status: 401, message: 'Non authentifié' })
    }

    const path = event.path.replace('/api', '')
    const body = ['GET', 'HEAD'].includes(event.method) ? undefined : await readBody(event)

    return await withTokenRefresh(event, () =>
        apiFetch(path, {
            method: event.method,
            headers: {
                Authorization: `Bearer ${getCookie(event, 'auth_token')}`,
            },
            body,
        })
    )
})