<script setup lang="ts">
const route = useRoute()
const { fetchTrips } = useTrips()
const { userId } = useAuth()

const params: TripFilters = {
  startingCity: route.query.startingCity as string,
  arrivalCity: route.query.arrivalCity as string,
  tripDate: route.query.tripDate as string,
  fromHour: route.query.fromHour as string,
  isUpcoming: true,
}

const { data: trips, pending } = fetchTrips(params)

const toggleLoading = ref<number | null>(null)
const toggleError = ref('')
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
        <NuxtLink
            v-for="(trip, index) in trips"
            :key="trip.id"
            :to="`/search/${trip.id}`"
            class="block"
        >
          <TripMinimalCard :trip="trip" :index="index" />
        </NuxtLink>
      </ul>

    </div>
  </main>
</template>