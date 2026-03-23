<script setup lang="ts">
const { fetchDriverTrips } = useTrips()
const { data: trips, pending } = fetchDriverTrips()

const activeTab = ref<'upcoming' | 'past'>('upcoming')

const sortedTrips = computed(() => {
  const now = new Date()
  const sorted = [...(trips.value ?? [])].sort(
      (a, b) => new Date(a.tripDatetime).getTime() - new Date(b.tripDatetime).getTime()
  )

  if (activeTab.value === 'upcoming') {
    return sorted.filter(t => new Date(t.tripDatetime) > now)
  }
  return sorted.filter(t => new Date(t.tripDatetime) <= now).reverse()
})
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">

      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">Mes trajets</h1>
        <NuxtLink
            to="/trips/create"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          + Nouveau trajet
        </NuxtLink>
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
          Passés
        </button>
      </div>

      <p v-if="pending" class="text-sm text-gray-500 text-center py-8">
        Chargement...
      </p>

      <ul v-else-if="sortedTrips.length" class="space-y-3">
        <NuxtLink
            v-for="(trip, index) in sortedTrips"
            :key="trip.id"
            :to="`/trips/${trip.id}`"
            class="block"
        >
          <TripMinimalCard :trip="trip" :index="index" role="driver" />
        </NuxtLink>
      </ul>

      <p v-else class="text-sm text-gray-500 text-center py-8">
        {{ activeTab === 'upcoming' ? 'Aucun trajet à venir.' : 'Aucun trajet passé.' }}
      </p>

    </div>
  </main>
</template>