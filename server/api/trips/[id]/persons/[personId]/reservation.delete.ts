import { apiFetch } from '#server/utils/api'
import { withTokenRefresh } from '#server/utils/errors'

export default defineEventHandler(async (event): Promise<unknown> => {
    const token = getCookie(event, 'auth_token')
    if (!token) throw createError({ status: 401, message: 'Non authentifié' })

    const tripId = getRouterParam(event, 'id')
    const personId = getRouterParam(event, 'personId')

    return await withTokenRefresh(event, () =>
        apiFetch(`/trips/${tripId}/persons/${personId}/reservation`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getCookie(event, 'auth_token')}` },
        })
    )
})