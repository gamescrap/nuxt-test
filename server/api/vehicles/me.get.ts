import { apiFetch } from '#server/utils/api'
import { withTokenRefresh } from '#server/utils/errors'

export default defineEventHandler(async (event): Promise<unknown> => {
    const token = getCookie(event, 'auth_token')
    if (!token) throw createError({ status: 401, message: 'Non authentifié' })

    try {
        return await withTokenRefresh(event, () =>
            apiFetch('/vehicles/me', {
                headers: { Authorization: `Bearer ${getCookie(event, 'auth_token')}` },
            })
        )
    } catch (e: any) {
        if (e?.response?.status === 204 || e?.response?.status === 404) return null
        throw e
    }
})