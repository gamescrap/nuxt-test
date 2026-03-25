<script setup lang="ts">
const route = useRoute()
const { fetchTrip, toggleReservation } = useTrips()
const { userId } = useAuth()
const { data: trip, pending, refresh } = fetchTrip(route.params.id)

const toggleLoading = ref(false)
const toggleError = ref('')
const cancelConfirm = ref(false)

const myReservation = computed(() =>
    trip.value?.reservations.find(r => r.passenger.id === userId.value)
)

const isDriver = computed(() => trip.value?.driver.id === userId.value)

const canToggle = computed(() => {
  if (!trip.value) return false
  if (isDriver.value) return false
  if (trip.value.tripStatus !== 'PLANNED') return false
  if (myReservation.value?.reservationStatus === 'CANCELLED') {
    return trip.value.availableSeats > 0 && new Date(trip.value.tripDatetime) > new Date()
  }
  return true
})

const handleToggle = async () => {
  if (myReservation.value?.reservationStatus === 'CONFIRMED') {
    cancelConfirm.value = true
    return
  }
  await doToggle()
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
        <NuxtLink to="/search" class="text-gray-400 hover:text-gray-700 transition-colors">
          Recherche
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <NuxtLink @click="$router.back()" to="" class="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
          Résultats
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

        <!-- Actions -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

          <!-- Complet sans réservation -->
          <p v-if="trip.availableSeats === 0 && !myReservation" class="text-sm text-gray-500 text-center py-1">
            Ce trajet est complet.
          </p>

          <!-- Bouton toggle réservation -->
          <button
              v-if="canToggle"
              type="button"
              @click="handleToggle"
              :disabled="toggleLoading"
              class="w-full text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
              :class="myReservation?.reservationStatus === 'CONFIRMED'
                ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white'"
          >
            {{ toggleLoading
              ? 'En cours...'
              : myReservation?.reservationStatus === 'CONFIRMED'
                  ? 'Annuler ma réservation'
                  : 'Réserver ce trajet'
            }}
          </button>

          <p v-if="toggleError" class="text-xs text-red-500">{{ toggleError }}</p>

          <!-- Contacter le conducteur -->
          <NuxtLink
              v-if="!isDriver"
              :to="`/contact/${trip.driver.id}`"
              class="block w-full text-center border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-lg py-2.5 transition-colors"
          >
            Contacter le conducteur
          </NuxtLink>

        </div>
      </template>

    </div>
  </main>

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