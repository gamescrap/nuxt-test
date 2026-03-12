export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await apiFetch('/forgot-password', { method: 'POST', body })
})