export interface TripFilters {
    arrivalCity?: string
    startingCity?: string
    tripDate?: string
    isUpcoming?: boolean
}

export const useTrips = (filters: TripFilters = {}) => {
    const requestFetch = useRequestFetch()

    const fetchTrips = (filters: TripFilters = {}) => useAsyncData(
        `trips-${JSON.stringify(filters)}`,
        () => requestFetch<Trip[]>('/api/protected/trips', {
            params: filters
        })
    )

    return { fetchTrips }
}