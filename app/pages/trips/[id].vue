<script setup lang="ts">
const route = useRoute()
const { fetchTrip } = useTrips()
const { data: trip, pending, refresh } = fetchTrip(route.params.id)
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">

      <nav class="flex items-center gap-2 text-sm mb-2">
        <NuxtLink to="/trips" class="text-gray-400 hover:text-gray-700 transition-colors">
          Mes trajets
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <span class="text-gray-900 font-medium">Détail du trajet</span>
      </nav>

      <template v-if="pending">
        <div class="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3">
          <div class="h-5 bg-gray-200 rounded w-48"></div>
          <div class="h-4 bg-gray-200 rounded w-32"></div>
          <div class="flex gap-2">
            <div class="h-5 bg-gray-200 rounded-full w-20"></div>
            <div class="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
      </template>

      <template v-else-if="trip">

        <!-- Infos trajet -->
        <TripCard v-if="trip" :trip="trip" />

        <!-- Passagers -->
        <div class="space-y-3">
          <h2 class="text-base font-semibold text-gray-900">
            Passagers ({{ trip.reservations.length }})
          </h2>

          <p v-if="!trip.reservations.length" class="text-sm text-gray-500 text-center py-4">
            Aucun passager pour ce trajet.
          </p>

          <PassengerCard
              v-for="reservation in trip.reservations"
              :key="reservation.id"
              :reservation="reservation"
              :trip-id="trip.id"
              @cancelled="refresh()"
          />
        </div>

      </template>

    </div>
  </main>
</template>