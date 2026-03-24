export const useTrips = () => {
    const requestFetch = useRequestFetch()
    const { userId, isAuthenticated, handleAuthError, reloadIfUnauthenticated, storeSession } = useAuth()

    // ─── Actions ────────────────────────────────────────────────────────────
    const fetchTrip = (id: string | string[] | undefined) => useAsyncData(
        `trip-${id}`,
        async () => {
            if (!id) return null
            if (await reloadIfUnauthenticated()) return null
            try {
                return await requestFetch<Trip>(`/api/trips/${id}`)
            } catch (e: any) {
                await handleAuthError(e)
                return null
            }
        },
        { watch: [isAuthenticated], lazy: true }
    )

    const fetchTrips = (filters: TripFilters = {}) => useAsyncData(
        `trips-${JSON.stringify(filters)}`,
        () => requestFetch<Trip[]>('/api/trips', { params: filters })
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

    const fetchDriverTrips = () => useAsyncData(
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

    const createTrip = async (body: TripRequest) => {
        try {
            return await $fetch<Trip>('/api/trips', { method: 'POST', body })
        } catch (e: any) {
            if (e?.status === 401) {
                const refreshed = await $fetch<AuthResponse>('/api/auth/refresh', {
                    method: 'POST',
                    ignoreResponseError: true
                })
                if (refreshed?.userId) {
                    storeSession(refreshed)
                    return $fetch<Trip>('/api/trips', { method: 'POST', body })
                }
            }
            throw e
        }
    }

    const cancelReservation = async (tripId: number, personId: number) => {
        await $fetch(`/api/trips/${tripId}/persons/${personId}/reservation`, {
            method: 'DELETE'
        })
    }

    // ─── Expose ─────────────────────────────────────────────────────────────
    return { fetchTrip, fetchTrips, fetchMyTrips, fetchDriverTrips, createTrip, cancelReservation }
}