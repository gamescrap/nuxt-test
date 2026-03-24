<script setup lang="ts">
const route = useRoute()
const { fetchTrip, cancelTrip } = useTrips()
const { data: trip, pending, refresh } = fetchTrip(route.params.id)

const cancelConfirm = ref(false)
const cancelLoading = ref(false)
const cancelError = ref('')

const handleCancelTrip = async () => {
  cancelLoading.value = true
  cancelError.value = ''
  try {
    await cancelTrip(Number(route.params.id))
    await navigateTo('/trips')
  } catch (e: any) {
    cancelError.value = getErrorMessage(e)
  } finally {
    cancelLoading.value = false
  }
}
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
        <div class="ml-auto flex items-center gap-2">
          <NuxtLink
              v-if="trip?.tripStatus === 'PLANNED'"
              :to="`/trips/${route.params.id}/edit`"
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Modifier
          </NuxtLink>
          <button
              v-if="trip?.tripStatus === 'PLANNED'"
              type="button"
              @click="cancelConfirm = true"
              class="text-sm bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            Annuler le trajet
          </button>
        </div>
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
      </template>

    </div>
  </main>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="cancelConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/40" @click="cancelConfirm = false" />
        <div class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
          <h3 class="text-base font-semibold text-gray-900">Annuler le trajet</h3>
          <p class="text-sm text-gray-500">Cette action est irréversible. Le trajet sera annulé et les passagers notifiés.</p>
          <p v-if="cancelError" class="text-xs text-red-500">{{ cancelError }}</p>
          <div class="flex gap-3 pt-2">
            <button
                type="button"
                @click="handleCancelTrip"
                :disabled="cancelLoading"
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
            >
              {{ cancelLoading ? 'Annulation...' : 'Confirmer' }}
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