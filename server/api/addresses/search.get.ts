// server/api/addresses/search.get.ts
import { apiFetch } from '#server/utils/api'
import { withTokenRefresh } from '#server/utils/errors'

export default defineEventHandler(async (event): Promise<unknown> => {
    const token = getCookie(event, 'auth_token')
    if (!token) throw createError({ status: 401, message: 'Non authentifié' })

    const query = getQuery(event)

    return await withTokenRefresh(event, () =>
        apiFetch('/addresses/search', {
            params: query,
            headers: { Authorization: `Bearer ${getCookie(event, 'auth_token')}` }
        })
    )
})