<script setup lang="ts">
import { formatTripDate } from '#shared/utils/date'
import { Cigarette, CigaretteOff } from 'lucide-vue-next'

defineProps<{
  trip: TripMinimal
  index?: number
  role?: 'driver' | 'passenger'
}>()
</script>

<template>
  <li
      class="slide-in bg-white rounded-xl border border-gray-200 p-4 space-y-3"
      :style="{ animationDelay: `${(index ?? 0) * 80}ms` }"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-gray-900">{{ trip.departureCityName.name }}</span>
        <span class="text-gray-400">→</span>
        <span class="font-semibold text-gray-900">{{ trip.arrivingCityName.name }}</span>
      </div>

      <div class="flex items-center gap-2">
      <span v-if="role === 'driver'" class="text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1 shrink-0">
        Conducteur
      </span>
        <span v-else-if="role === 'passenger'" class="text-xs bg-cyan-100 text-cyan-700 rounded-full px-3 py-1 shrink-0">
        Passager
      </span>

        <span
            class="text-xs rounded-full px-3 py-1 shrink-0"
            :class="{
          'bg-green-100 text-green-700': trip.tripStatus === 'PLANNED',
          'bg-gray-100 text-gray-500': trip.tripStatus === 'COMPLETED',
          'bg-red-100 text-red-600': trip.tripStatus === 'CANCELLED',
        }"
        >
        {{ trip.tripStatus === 'PLANNED' ? 'Planifié' : trip.tripStatus === 'COMPLETED' ? 'Terminé' : 'Annulé' }}
      </span>
      </div>
    </div>



    <p class="text-sm text-gray-500">{{ formatTripDate(trip.tripDatetime) }}</p>

    <div class="flex flex-wrap gap-2">
      <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
        {{ trip.driver.email }}
      </span>
      <span class="text-xs bg-blue-600 text-white rounded-full px-3 py-1">
        {{ trip.availableSeats }} place{{ trip.availableSeats > 1 ? 's' : '' }}
      </span>
      <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
          {{ trip.distanceKm != null ? trip.distanceKm.toFixed(1) : 'Inconnu' }} km
      </span>
      <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
        {{ trip.durationMinutes ?? 'Inconnu' }} min
      </span>
      <span
          class="text-xs rounded-full px-3 py-1 flex items-center gap-1"
          :class="trip.smokingAllowed ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'"
      >
        <Cigarette v-if="trip.smokingAllowed" :size="12" />
        <CigaretteOff v-else :size="12" />
        {{ trip.smokingAllowed ? 'Fumeurs' : 'Non-fumeurs' }}
      </span>
    </div>
  </li>
</template>