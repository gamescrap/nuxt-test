export default defineEventHandler(async (event) => {
    const path = event.path
    if (path.startsWith('/api') || path.includes('.')) return

    const token = getCookie(event, 'auth_token')
    const refreshToken = getCookie(event, 'refresh_token')

    if (!token && !refreshToken) return

    if (token) {
        try {
            const parts = token.split('.')
            const payload = JSON.parse(Buffer.from(parts[1] ?? '', 'base64').toString('utf-8'))
            const now = Math.floor(Date.now() / 1000)
            if (payload.exp > now) return
        } catch { }
    }

    if (!refreshToken) return

    try {
        const data = await apiFetch<AuthResponse>('/refresh', {
            method: 'POST',
            body: { refreshToken },
        })

        setAuthCookies(event, data.token, data.refreshToken)

        // Si on est sur une page auth → rediriger vers index
        if (path.startsWith('/auth/')) {
            return sendRedirect(event, '/', 302)
        }

    } catch {
        deleteCookie(event, 'auth_token')
        deleteCookie(event, 'refresh_token')
    }
})