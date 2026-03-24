import { apiFetch } from '#server/utils/api'
import { withTokenRefresh } from '#server/utils/errors'

export default defineEventHandler(async (event): Promise<unknown> => {
    const token = getCookie(event, 'auth_token')
    if (!token) throw createError({ status: 401, message: 'Non authentifié' })

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    return await withTokenRefresh(event, () =>
        apiFetch(`/trips/${id}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getCookie(event, 'auth_token')}` },
            body,
        })
    )
})