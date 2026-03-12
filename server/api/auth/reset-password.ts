export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await apiFetch('/reset-password', { method: 'POST', body })
})