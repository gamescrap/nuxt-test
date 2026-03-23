export const useTrips = (filters: TripFilters = {}) => {
    const requestFetch = useRequestFetch()
    const { userId, isAuthenticated,
        handleAuthError, reloadIfUnauthenticated  } = useAuth()

    const fetchTrips = (filters: TripFilters = {}) => useAsyncData(
        `trips-${JSON.stringify(filters)}`,
        () => requestFetch<Trip[]>('/api/trips', {
            params: filters
        })
    )

    const fetchMyTrips = () => useAsyncData(
        'my-trips',
        async () => {
            if (!userId.value) return null
            if (await reloadIfUnauthenticated()) return null

            try {
                const [passenger, driver] = await Promise.all([
                    requestFetch<TripMinimal[]>(`/api/persons/${userId.value}/trips-passenger`),
                    requestFetch<TripMinimal[]>(`/api/persons/${userId.value}/trips-driver`),
                ])
                return { passenger, driver }
            } catch (e: any) {
                await handleAuthError(e)
                return null
            }
        },
        { watch: [isAuthenticated], lazy: true }
    )

    const fetchDriverTrips = () => {
        const { userId, isAuthenticated, reloadIfUnauthenticated, handleAuthError } = useAuth()
        const requestFetch = useRequestFetch()

        return useAsyncData(
            'driver-trips',
            async () => {
                if (!userId.value) return []
                if (await reloadIfUnauthenticated()) return null

                try {
                    return await requestFetch<TripMinimal[]>(`/api/persons/${userId.value}/trips-driver`)
                } catch (e: any) {
                    await handleAuthError(e)
                    return null
                }
            },
            { watch: [isAuthenticated], lazy: true }
        )
    }

    const createTrip = async (body: TripRequest) => {
        try {
            return await $fetch<Trip>('/api/trips', {
                method: 'POST',
                body,
            })
        } catch (e: any) {
            if (e?.status === 401) {
                const refreshed = await $fetch<AuthResponse>('/api/auth/refresh', {
                    method: 'POST',
                    ignoreResponseError: true
                })
                if (refreshed?.userId) {
                    const { storeSession } = useAuth()
                    storeSession(refreshed)
                    return await $fetch<Trip>('/api/trips', {
                        method: 'POST',
                        body,
                    })
                }
            }
            throw e
        }
    }

    return { fetchTrips, fetchMyTrips, fetchDriverTrips, createTrip }
}