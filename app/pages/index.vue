<script setup lang="ts">
import TripCardSkeleton from "~/components/TripCardSkeleton.vue";

const { isAuthenticated, handleAuthError } = useAuth()
const { fetchMyTrips } = useTrips()

const { data: myTrips, error, refresh: refreshTrips, pending } = await fetchMyTrips()

const showTrips = ref(true)
const sortedTrips = computed(() => {
  const driver = (myTrips.value?.driver ?? []).map(t => ({ ...t, role: 'driver' as const }))
  const passenger = (myTrips.value?.passenger ?? []).map(t => ({ ...t, role: 'passenger' as const }))

  return [...driver, ...passenger].sort(
      (a, b) => new Date(a.tripDatetime).getTime() - new Date(b.tripDatetime).getTime()
  )
})

const handleRefresh = async () => {
  showTrips.value = false
  await refreshTrips()
  if (handleAuthError(error)) return
  await nextTick()
  showTrips.value = true
}
</script>

<template>
  <main v-if="isAuthenticated" class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">

      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900">Mes trajets</h2>
        <button @click="handleRefresh" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          Actualiser
        </button>
      </div>

      <!-- Skeletons pendant le chargement -->
      <ul v-if="pending || !showTrips" class="space-y-3">
        <TripCardSkeleton v-for="i in 3" :key="i" />
      </ul>

      <p v-else-if="error" class="text-sm text-red-500 text-center py-8">
        Erreur lors du chargement des trajets.
      </p>

      <ul v-else-if="sortedTrips.length" class="space-y-3">
        <TripCard
            v-for="(trip, index) in sortedTrips"
            :key="`${trip.role}-${trip.id}`"
            :trip="trip"
            :index="index"
            :role="trip.role"
        />
      </ul>

      <p v-else class="text-sm text-gray-500 text-center py-8">
        Aucun trajet à venir.
      </p>

    </div>
  </main>
</template>