<script setup lang="ts">
const route = useRoute()
const { fetchTrip, toggleReservation } = useTrips()
const { userId } = useAuth()
const { data: trip, pending, refresh } = fetchTrip(route.params.id)

const toggleLoading = ref(false)
const toggleError = ref('')

const canToggle = computed(() => {
  if (!trip.value) return false
  if (trip.value.tripStatus !== 'PLANNED') return false
  if (myReservation.value?.reservationStatus === 'CANCELLED') {
    return trip.value.availableSeats > 0 && new Date(trip.value.tripDatetime) > new Date()
  }
  return true
})

const myReservation = computed(() =>
    trip.value?.reservations.find(r => r.passenger.id === userId.value)
)

const cancelConfirm = ref(false)

const handleToggle = async () => {
  if (myReservation.value?.reservationStatus === 'CANCELLED') {
    await doToggle()
    return
  }
  cancelConfirm.value = true
}

const doToggle = async () => {
  toggleLoading.value = true
  toggleError.value = ''
  cancelConfirm.value = false
  try {
    await toggleReservation(Number(route.params.id))
    await refresh()
  } catch (e: any) {
    toggleError.value = getErrorMessage(e)
  } finally {
    toggleLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">

      <nav class="flex items-center gap-2 text-sm mb-2">
        <NuxtLink to="/reservations" class="text-gray-400 hover:text-gray-700 transition-colors">
          Mes réservations
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <span class="text-gray-900 font-medium">Détail</span>
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
        <TripCard :trip="trip" />

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

        <!-- Statut de ma réservation -->
        <div v-if="myReservation" class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 class="text-sm font-semibold text-gray-900">Ma réservation</h2>
          <div class="flex items-center justify-between">
    <span
        class="text-xs rounded-full px-3 py-1"
        :class="myReservation.reservationStatus === 'CONFIRMED'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-600'"
    >
      {{ myReservation.reservationStatus === 'CONFIRMED' ? 'Confirmée' : 'Annulée' }}
    </span>

            <div class="flex items-center gap-2">
              <!-- Bouton contacter -->
              <NuxtLink
                  :to="`/contact/${trip.driver.id}`"
                  class="text-sm font-medium rounded-lg px-4 py-2 transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
              >
                Contacter le conducteur
              </NuxtLink>

              <!-- Bouton annuler/réactiver -->
              <button
                  v-if="canToggle"
                  type="button"
                  @click="handleToggle"
                  :disabled="toggleLoading"
                  class="text-sm font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                  :class="myReservation.reservationStatus === 'CONFIRMED'
            ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
            : 'bg-blue-600 hover:bg-blue-700 text-white'"
              >
                {{ toggleLoading
                  ? 'En cours...'
                  : myReservation.reservationStatus === 'CONFIRMED'
                      ? 'Annuler ma réservation'
                      : 'Réactiver ma réservation'
                }}
              </button>
            </div>
          </div>
          <p v-if="toggleError" class="text-xs text-red-500">{{ toggleError }}</p>
        </div>

        <Teleport to="body">
          <Transition name="modal">
            <div v-if="cancelConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div class="absolute inset-0 bg-black/40" @click="cancelConfirm = false" />
              <div class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
                <h3 class="text-base font-semibold text-gray-900">Annuler la réservation</h3>
                <p class="text-sm text-gray-500">Voulez-vous vraiment annuler cette réservation ?</p>
                <p v-if="toggleError" class="text-xs text-red-500">{{ toggleError }}</p>
                <div class="flex gap-3 pt-2">
                  <button
                      type="button"
                      @click="doToggle"
                      :disabled="toggleLoading"
                      class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                  >
                    {{ toggleLoading ? 'Annulation...' : 'Confirmer' }}
                  </button>
                  <button
                      type="button"
                      @click="cancelConfirm = false"
                      class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg py-2.5 transition-colors"
                  >
                    Retour
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

      </template>
    </div>
  </main>
</template>