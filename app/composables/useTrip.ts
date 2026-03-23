export const useTrips = (filters: TripFilters = {}) => {
    const requestFetch = useRequestFetch()
    const { userId, isRefreshing } = useAuth()

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
            if (isRefreshing.value) return null

            const [passenger, driver] = await Promise.all([
                requestFetch<TripMinimal[]>(`/api/persons/${userId.value}/trips-passenger`),
                requestFetch<TripMinimal[]>(`/api/persons/${userId.value}/trips-driver`),
            ])
            return { passenger, driver }
        },
        { watch: [isRefreshing], lazy: true }
    )

    const createTrip = async (body: TripRequest) => {
        return await $fetch<Trip>('/api/trips', {
            method: 'POST',
            body,
        })
    }

    return { fetchTrips, fetchMyTrips, createTrip }
}