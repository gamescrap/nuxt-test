export const useTrips = (filters: TripFilters = {}) => {
    const requestFetch = useRequestFetch()
    const { userId, isRefreshing } = useAuth()

    const fetchTrips = (filters: TripFilters = {}) => useAsyncData(
        `trips-${JSON.stringify(filters)}`,
        () => requestFetch<Trip[]>('/api/trips', {
            params: filters
        })
    )

    // app/composables/useTrips.ts
    const fetchMyTrips = () => useAsyncData(
        'my-trips',
        async () => {
            if (!userId.value) return null
            if (isRefreshing.value) return null  // ← attend la fin du refresh

            const [passenger, driver] = await Promise.all([
                requestFetch<TripMinimal[]>(`/api/persons/${userId.value}/trips-passenger`),
                requestFetch<TripMinimal[]>(`/api/persons/${userId.value}/trips-driver`),
            ])
            return { passenger, driver }
        },
        { watch: [isRefreshing] }  // ← relance quand isRefreshing change
    )

    return { fetchTrips, fetchMyTrips }
}