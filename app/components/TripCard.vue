<script setup lang="ts">
import { formatTripDate } from '#shared/utils/date'

defineProps<{
  trip: Trip
  index?: number
}>()
</script>

<template>
  <li
      class="slide-in bg-white rounded-xl border border-gray-200 p-4 space-y-3"
      :style="{ animationDelay: `${(index ?? 0) * 80}ms` }"
  >
    <div class="flex items-center gap-2">
      <span class="font-semibold text-gray-900">{{ trip.departureAddress.city.name }}</span>
      <span class="text-gray-400">→</span>
      <span class="font-semibold text-gray-900">{{ trip.arrivingAddress.city.name }}</span>
    </div>

    <p class="text-sm text-gray-500">{{ formatTripDate(trip.tripDatetime) }}</p>

    <div class="flex flex-wrap gap-2">
      <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
        {{ trip.driver.firstname }} {{ trip.driver.lastname }}
      </span>
      <span class="text-xs bg-blue-600 text-white rounded-full px-3 py-1">
        {{ trip.availableSeats }} place{{ trip.availableSeats > 1 ? 's' : '' }}
      </span>
      <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
        {{ trip.distanceKm ?? 'Inconnu' }} km
      </span>
      <span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
        {{ trip.durationMinutes ?? 'Inconnu' }} min
      </span>
    </div>
  </li>
</template>