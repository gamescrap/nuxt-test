<script setup lang="ts">
const { isAuthenticated, handleAuthError } = useAuth()
const { fetchMyTrips } = useTrips()

const { data: myTrips, error, refresh: refreshTrips, pending } = await fetchMyTrips()

const showTrips = ref(true)
const sortedTrips = computed(() => {
  const driver = (myTrips.value?.driver ?? []).map(t => ({
    ...t,
    role: 'driver' as const
  }))

  const passenger = (myTrips.value?.passenger ?? []).map(t => ({
    ...t.trip,
    role: 'passenger' as const
  }))

  return [...driver, ...passenger]
      .filter(t => t.tripStatus === 'PLANNED')
      .sort((a, b) => new Date(a.tripDatetime).getTime() - new Date(b.tripDatetime).getTime())
})


const handleRefresh = async () => {
  showTrips.value = false
  await refreshTrips()
  if (await handleAuthError(error)) return
  await nextTick()
  showTrips.value = true
}
</script>

<template>
  <main v-if="isAuthenticated" class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">

      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">Mes trajets et réservations</h1>
        <button @click="handleRefresh" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          Actualiser
        </button>
      </div>

      <p v-if="pending" class="text-sm text-gray-500 text-center py-8">
        Chargement...
      </p>

      <p v-else-if="error" class="text-sm text-red-500 text-center py-8">
        Erreur lors du chargement des trajets.
      </p>

      <ul v-else-if="sortedTrips.length" class="space-y-3">
        <NuxtLink
            v-for="(trip, index) in sortedTrips"
            :key="trip.id"
            :to="`/reservations/${trip.id}`"
            class="block"
        >
          <TripMinimalCard :trip="trip" :index="index" :role="trip.role" />
        </NuxtLink>
      </ul>

      <p v-else class="text-sm text-gray-500 text-center py-8">
        Aucun trajet à venir.
      </p>

    </div>
  </main>
</template>