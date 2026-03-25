<script setup lang="ts">
const route = useRoute()
const { searchTrips, toggleReservation } = useTrips()
const { userId } = useAuth()

const params = {
  startingCity: route.query.startingCity as string,
  arrivalCity: route.query.arrivalCity as string,
  tripDate: route.query.tripDate as string,
  fromHour: route.query.fromHour as string,
}

const { data: trips, pending } = searchTrips(params)

const toggleLoading = ref<number | null>(null)
const toggleError = ref('')

const handleToggle = async (tripId: number) => {
  toggleLoading.value = tripId
  toggleError.value = ''
  try {
    await toggleReservation(tripId)
    await refreshNuxtData(`search-trips-${JSON.stringify(params)}`)
  } catch (e: any) {
    toggleError.value = getErrorMessage(e)
  } finally {
    toggleLoading.value = null
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">

      <nav class="flex items-center gap-2 text-sm mb-2">
        <NuxtLink to="/search" class="text-gray-400 hover:text-gray-700 transition-colors">
          Recherche
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <span class="text-gray-900 font-medium">Résultats</span>
      </nav>

      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ params.startingCity }} → {{ params.arrivalCity }}
        </h1>
        <span class="text-sm text-gray-500">{{ params.tripDate }} à partir de {{ params.fromHour }}h</span>
      </div>

      <p v-if="pending" class="text-sm text-gray-500 text-center py-8">
        Chargement...
      </p>

      <p v-else-if="!trips?.length" class="text-sm text-gray-500 text-center py-8">
        Aucun trajet trouvé pour ces critères.
      </p>

      <ul v-else class="space-y-3">
        <li
            v-for="(trip, index) in trips"
            :key="trip.id"
            class="space-y-2"
        >
          <TripMinimalCard :trip="trip" :index="index" />

          <div class="flex justify-end px-1">
            <button
                v-if="trip.driver.id !== userId && trip.availableSeats > 0"
                type="button"
                @click="handleToggle(trip.id)"
                :disabled="toggleLoading === trip.id"
                class="text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2 transition-colors"
            >
              {{ toggleLoading === trip.id ? 'En cours...' : 'Réserver' }}
            </button>
            <span v-else-if="trip.availableSeats === 0" class="text-xs text-gray-400 py-2">
              Complet
            </span>
          </div>

          <p v-if="toggleError && toggleLoading === null" class="text-xs text-red-500 px-1">
            {{ toggleError }}
          </p>
        </li>
      </ul>

    </div>
  </main>
</template>