<script setup lang="ts">
import { formatTripDate } from '#shared/utils/date'
import { Cigarette, CigaretteOff } from 'lucide-vue-next'

defineProps<{
  trip: Trip
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

    <!-- Trajet -->
    <div class="flex items-center gap-2">
      <span class="font-semibold text-gray-900 text-lg">{{ trip.departureAddress.city.name }}</span>
      <span class="text-gray-400">→</span>
      <span class="font-semibold text-gray-900 text-lg">{{ trip.arrivingAddress.city.name }}</span>
    </div>

    <!-- Date -->
    <p class="text-sm">
      <span class="font-semibold text-gray-700">Date de départ : </span>
      <span class="text-gray-500">{{ formatTripDate(trip.tripDatetime) }}</span>
    </p>

    <!-- Adresses complètes -->
    <div class="text-sm text-gray-600 space-y-2">
      <div>
        <p class="font-semibold text-gray-700 mb-0.5">Lieu de départ</p>
        <p class="text-gray-500">{{ trip.departureAddress.streetNumber }} {{ trip.departureAddress.streetName }}, {{ trip.departureAddress.city.postalCode }} {{ trip.departureAddress.city.name }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-700 mb-0.5">Lieu de destination</p>
        <p class="text-gray-500">{{ trip.arrivingAddress.streetNumber }} {{ trip.arrivingAddress.streetName }}, {{ trip.arrivingAddress.city.postalCode }} {{ trip.arrivingAddress.city.name }}</p>
      </div>
    </div>

    <!-- Badges -->
    <div class="flex flex-wrap gap-2 pt-1">
      <span
          class="text-xs rounded-full px-3 py-1"
          :class="{
          'bg-green-100 text-green-700': trip.tripStatus === 'PLANNED',
          'bg-gray-100 text-gray-500': trip.tripStatus === 'COMPLETED',
          'bg-red-100 text-red-600': trip.tripStatus === 'CANCELLED',
        }"
      >
        {{ trip.tripStatus === 'PLANNED' ? 'Planifié' : trip.tripStatus === 'COMPLETED' ? 'Terminé' : 'Annulé' }}
      </span>
          <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
        {{ Math.round(trip.distanceKm ?? 0) }} km
      </span>
      <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
        {{ trip.durationMinutes }} min
      </span>
      <span class="text-xs bg-blue-600 text-white rounded-full px-3 py-1">
        {{ trip.availableSeats }} place{{ trip.availableSeats > 1 ? 's' : '' }}
      </span>
      <span
          class="text-xs rounded-full px-3 py-1 flex items-center gap-1"
          :class="trip.smokingAllowed ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'"
      >
        <Cigarette v-if="trip.smokingAllowed" :size="12" />
        <CigaretteOff v-else :size="12" />
        {{ trip.smokingAllowed ? 'Fumeurs' : 'Non-fumeurs' }}
      </span>
    </div>

  </div>
</template>