<script setup lang="ts">
import { formatTripDate } from '#shared/utils/date'
import { Cigarette, CigaretteOff, Users, Route, Clock } from 'lucide-vue-next'

defineProps<{
  trip: TripMinimal
  index?: number
  role?: 'driver' | 'passenger'
}>()
</script>

<template>
  <li
      class="slide-in rounded-xl border border-gray-200 p-4 relative overflow-hidden"
      :style="{ animationDelay: `${(index ?? 0) * 80}ms` }"
  >
    <!-- Background image selon le rôle -->
    <div
        class="absolute pointer-events-none bg-contain bg-no-repeat bg-center w-[210px] h-[210px] -bottom-14 -right-6"
        :style="{ backgroundImage: `url('/images/${role === 'driver' ? 'volant' : 'ticket'}.png')` }"
    />
    <div class="absolute inset-0 bg-white/85" />

    <!-- Contenu -->
    <div class="relative z-10 space-y-3">

      <!-- Header : 2 colonnes -->
      <div class="flex items-stretch justify-between gap-3">

        <!-- Colonne gauche : trajet + date -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-900">{{ trip.departureCityName.name }}</span>
            <span class="text-gray-400">→</span>
            <span class="font-semibold text-gray-900">{{ trip.arrivingCityName.name }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ formatTripDate(trip.tripDatetime) }}</p>
        </div>

        <!-- Colonne droite : statut -->
        <span
            class="text-sm font-bold uppercase rounded-lg px-3 flex items-center shrink-0"
            :class="{
            'bg-green-100 text-green-700': trip.tripStatus === 'PLANNED',
            'bg-gray-100 text-gray-500': trip.tripStatus === 'COMPLETED',
            'bg-red-100 text-red-600': trip.tripStatus === 'CANCELLED',
          }"
        >
          {{ trip.tripStatus === 'PLANNED' ? 'Planifié' : trip.tripStatus === 'COMPLETED' ? 'Terminé' : 'Annulé' }}
        </span>
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-2">

        <!-- Conducteur -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="text-gray-400 font-medium">Conducteur :</span>
          <span>{{ trip.driver.email }}</span>
        </div>

        <!-- Places disponibles + fumeurs -->
        <div class="flex items-center gap-2">
          <Users :size="14" class="text-gray-400" />
          <span class="text-sm text-gray-600">
            {{ trip.availableSeats }} place{{ trip.availableSeats > 1 ? 's' : '' }} disponible{{ trip.availableSeats > 1 ? 's' : '' }}
          </span>
          <div
              class="flex items-center gap-1 text-xs rounded-full px-3 py-1"
              :class="trip.smokingAllowed ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'"
          >
            <Cigarette v-if="trip.smokingAllowed" :size="12" />
            <CigaretteOff v-else :size="12" />
            {{ trip.smokingAllowed ? 'Fumeurs' : 'Non-fumeurs' }}
          </div>
        </div>

        <!-- Distance + durée -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <Route :size="14" class="text-gray-400" />
            <span class="text-sm text-gray-600">
              {{ trip.distanceKm != null ? trip.distanceKm.toFixed(1) : 'Inconnu' }} km
            </span>
          </div>
          <div class="flex items-center gap-1">
            <Clock :size="14" class="text-gray-400" />
            <span class="text-sm text-gray-600">{{ trip.durationMinutes ?? 'Inconnu' }} min</span>
          </div>
        </div>

      </div>
    </div>
  </li>
</template>