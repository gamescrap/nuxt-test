import type { Vehicle, VehicleRequest, Brand } from '#shared/types/vehicle'

export const useVehicle = () => {
    const requestFetch = useRequestFetch()
    const { isAuthenticated, reloadIfUnauthenticated, handleAuthError, refreshSession } = useAuth()

    // ─── State ───────────────────────────────────────────────────────────────
    const { data: vehicle, refresh: refreshVehicle } = useAsyncData(
        'vehicle',
        async () => {
            if (await reloadIfUnauthenticated()) return null
            try {
                return await requestFetch<Vehicle | null>('/api/vehicles/me')
            } catch (e: any) {
                await handleAuthError(e)
                return null
            }
        },
        { watch: [isAuthenticated], lazy: true }
    )

    const { data: brands } = useAsyncData(
        'brands',
        async () => {
            if (await reloadIfUnauthenticated()) return []
            try {
                return await requestFetch<Brand[]>('/api/brands')
            } catch (e: any) {
                await handleAuthError(e)
                return []
            }
        },
        { watch: [isAuthenticated], lazy: true }
    )

    // ─── Actions ────────────────────────────────────────────────────────────
    const saveVehicle = async (body: VehicleRequest, vehicleId?: number) => {
        if (vehicleId) {
            await $fetch(`/api/vehicles/${vehicleId}`, { method: 'PUT', body })
        } else {
            await $fetch('/api/vehicles', { method: 'POST', body })
        }
        await refreshVehicle()
        await refreshSession()
    }

    const deleteVehicle = async (vehicleId: number) => {
        await $fetch(`/api/vehicles/${vehicleId}`, { method: 'DELETE' })
        await refreshVehicle()
        await refreshSession()
    }

    // ─── Expose ─────────────────────────────────────────────────────────────
    return { vehicle, brands, refreshVehicle, saveVehicle, deleteVehicle }
}