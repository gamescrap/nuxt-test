<script setup lang="ts">
const { isAuthenticated, handleAuthError, roles } = useAuth()
const { fetchDriverTrips } = useTrips()

const { data: myTrips, error, refresh: refreshTrips, pending } = await fetchDriverTrips()

const activeTab = ref<'upcoming' | 'past'>('upcoming')
const showTrips = ref(true)
const showDriverModal = ref(false)

const isDriver = computed(() => roles.value.includes('ROLE_DRIVER'))

const handleNewTrip = () => {
  if (!isDriver.value) {
    showDriverModal.value = true
    return
  }
  navigateTo('/trips/create')
}

const allTrips = computed(() => {
  return (myTrips.value ?? []).map(t => ({ ...t, role: 'driver' as const }))
})

const sortedTrips = computed(() => {
  if (activeTab.value === 'upcoming') {
    return allTrips.value
        .filter(t => t.tripStatus === 'PLANNED')
        .sort((a, b) => new Date(a.tripDatetime).getTime() - new Date(b.tripDatetime).getTime())
  }
  return allTrips.value
      .filter(t => t.tripStatus === 'COMPLETED' || t.tripStatus === 'CANCELLED')
      .sort((a, b) => new Date(b.tripDatetime).getTime() - new Date(a.tripDatetime).getTime())
})

const handleRefresh = async () => {
  showTrips.value = false
  await refreshTrips()
  if (await handleAuthError(error)) return
  await nextTick()
  showTrips.value = true
}
</script>

<template>
  <main v-if="isAuthenticated" class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">

      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">Mes trajets</h1>
        <button
            @click="handleNewTrip"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          + Nouveau trajet
        </button>
      </div>

      <!-- Onglets -->
      <div class="flex border-b border-gray-200">
        <button
            @click="activeTab = 'upcoming'"
            class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
            :class="activeTab === 'upcoming'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          À venir
        </button>
        <button
            @click="activeTab = 'past'"
            class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
            :class="activeTab === 'past'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Passés ou annulés
        </button>
      </div>

      <p v-if="pending" class="text-sm text-gray-500 text-center py-8">
        Chargement...
      </p>

      <p v-else-if="error" class="text-sm text-red-500 text-center py-8">
        Erreur lors du chargement des trajets.
      </p>

      <ul v-else-if="showTrips && sortedTrips.length" class="space-y-3">
        <NuxtLink
            v-for="(trip, index) in sortedTrips"
            :key="`${trip.role}-${trip.id}`"
            :to="`/trips/${trip.id}`"
            class="block"
        >
          <TripMinimalCard :trip="trip" :index="index" :role="trip.role" />
        </NuxtLink>
      </ul>

      <p v-else class="text-sm text-gray-500 text-center py-8">
        {{ activeTab === 'upcoming' ? 'Aucun trajet à venir.' : 'Aucun trajet passé ou annulé.' }}
      </p>

    </div>
  </main>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showDriverModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/40" @click="showDriverModal = false" />
        <div class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
          <h3 class="text-base font-semibold text-gray-900">Profil conducteur requis</h3>
          <p class="text-sm text-gray-500">
            Pour créer un trajet, vous devez compléter votre profil et renseigner votre véhicule.
          </p>
          <div class="flex gap-3 pt-2">
            <NuxtLink
                to="/account"
                @click="showDriverModal = false"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors text-center"
            >
              Compléter mon profil
            </NuxtLink>
            <button
                type="button"
                @click="showDriverModal = false"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg py-2.5 transition-colors"
            >
              D'accord
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>