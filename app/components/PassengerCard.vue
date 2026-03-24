<script setup lang="ts">
const { cancelReservation } = useTrips()

const props = defineProps<{
  reservation: Reservation
  tripId: number
}>()

const emit = defineEmits<{
  'cancelled': []
}>()

const loading = ref(false)

const handleCancel = async () => {
  loading.value = true
  try {
    await cancelReservation(props.tripId, props.reservation.passenger.id)
    emit('cancelled')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">

    <NuxtLink
        :to="`/contact/${reservation.passenger.id}`"
        class="flex items-center gap-3 flex-1 min-w-0"
    >
      <!-- Avatar initiales -->
      <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
        {{ reservation.passenger.profile
          ? (reservation.passenger.profile.firstname?.[0] ?? '') + (reservation.passenger.profile.lastname?.[0] ?? '')
          : (reservation.passenger.email?.[0]?.toUpperCase() ?? '?')
        }}
      </div>

      <!-- Infos -->
      <div class="min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">
          {{ reservation.passenger.profile
            ? `${reservation.passenger.profile.firstname} ${reservation.passenger.profile.lastname}`
            : 'Profil incomplet'
          }}
        </p>
        <p class="text-xs text-gray-500 truncate">{{ reservation.passenger.email }}</p>
        <p v-if="reservation.passenger.profile?.phone" class="text-xs text-gray-400">
          {{ reservation.passenger.profile.phone }}
        </p>
      </div>
    </NuxtLink>

    <!-- Badge statut + bouton supprimer -->
    <div class="flex items-center gap-2 shrink-0">
      <span
          class="text-xs rounded-full px-2 py-1"
          :class="reservation.reservationStatus === 'CONFIRMED'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500'"
      >
        {{ reservation.reservationStatus === 'CONFIRMED' ? 'Confirmé' : reservation.reservationStatus }}
      </span>
      <button
          v-if="reservation.reservationStatus === 'CONFIRMED'"
          type="button"
          @click="handleCancel"
          :disabled="loading"
          class="text-gray-300 hover:text-red-400 disabled:opacity-50 transition-colors p-1"
          title="Supprimer la réservation"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

  </div>
</template>