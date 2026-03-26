<script setup lang="ts">
import { formatTripDate } from '#shared/utils/date'
import { Cigarette, CigaretteOff } from 'lucide-vue-next'

const { userId } = useAuth()

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

    <!-- Conducteur -->
    <div v-if="userId !== trip.driver.id" class="pt-2 border-t border-gray-100 space-y-3">
      <p class="text-xs font-semibold text-gray-700">Conducteur</p>

      <div class="flex items-center justify-between gap-3">
        <div class="flex flex-col gap-2">
          <!-- Avatar + nom -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0 text-sm">
              {{ (trip.driver.profile?.firstname?.[0] ?? '') + (trip.driver.profile?.lastname?.[0] ?? '') }}
            </div>
            <p class="text-sm font-medium text-gray-900">
              {{ trip.driver.profile ? `${trip.driver.profile.firstname} ${trip.driver.profile.lastname}` : 'Profil incomplet' }}
            </p>
          </div>

          <!-- Coordonnées -->
          <div class="space-y-0.5">
            <p class="text-sm text-gray-500">
              <span class="font-semibold text-gray-700">Email : </span>{{ trip.driver.email }}
            </p>
            <p v-if="trip.driver.profile?.phone" class="text-sm text-gray-500">
              <span class="font-semibold text-gray-700">Téléphone : </span>{{ trip.driver.profile.phone }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Véhicule -->
    <div v-if="trip.vehicle && userId !== trip.driver.id" class="pt-2 border-t border-gray-100 space-y-1">
      <p class="text-xs font-semibold text-gray-700 mb-2">Véhicule</p>
      <p class="text-sm">
        <span class="font-semibold text-gray-700">Marque : </span>
        <span class="text-gray-500">{{ trip.vehicle.brand.name }}</span>
      </p>
      <p class="text-sm">
        <span class="font-semibold text-gray-700">Modèle : </span>
        <span class="text-gray-500">{{ trip.vehicle.model }}</span>
      </p>
      <div v-if="trip.vehicle.description" class="text-sm">
        <p v-if="trip.vehicle.description" class="text-sm">
          <span class="font-semibold text-gray-700">Description : </span>
          <span class="text-gray-500">{{ trip.vehicle.description }}</span>
        </p>
      </div>
    </div>

  </div>
</template>