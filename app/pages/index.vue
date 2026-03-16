<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { fetchTrips } = useTrips()
const { data: trips, error, refresh: refreshTrips } = await fetchTrips({ isUpcoming: true })
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6">

      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-900">Trajets disponibles</h2>
        <button
            @click="refreshTrips()"
            class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Actualiser
        </button>
      </div>

      <p v-if="error" class="text-sm text-red-500 text-center py-8">
        Erreur lors du chargement des trajets.
      </p>

      <ul v-else-if="trips?.length" class="space-y-3">
        <TripCard
            v-for="(trip, index) in trips"
            :key="trip.id"
            :trip="trip"
            :index="index"
        />
      </ul>

      <p v-else class="text-sm text-gray-500 text-center py-8">
        Aucun trajet disponible.
      </p>

    </div>
  </main>
</template>