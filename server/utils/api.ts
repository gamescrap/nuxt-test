export const apiFetch = <T = unknown>(path: string, options: Parameters<typeof $fetch>[1] = {}) => {
    const config = useRuntimeConfig()
    return $fetch<T>(`${config.apiBaseUrl}${path}`, options)
}