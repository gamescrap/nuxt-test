<script setup lang="ts">
const { userId, isAuthenticated } = useAuth()
const { fetchMyReservations } = usePerson()

const { data: reservations, pending } = fetchMyReservations()
const activeTab = ref<'active' | 'completed' | 'cancelled'>('active')

const sortedReservations = computed(() => {
  const now = new Date()
  const all = (reservations.value ?? []).filter(r => r != null)

  if (activeTab.value === 'active') {
    return all
        .filter(r => r.reservationStatus === 'CONFIRMED' && new Date(r.trip.tripDatetime) > now)
        .sort((a, b) => new Date(a.trip.tripDatetime).getTime() - new Date(b.trip.tripDatetime).getTime())
  }
  if (activeTab.value === 'completed') {
    return all
        .filter(r => r.reservationStatus === 'CONFIRMED' && new Date(r.trip.tripDatetime) <= now)
        .sort((a, b) => new Date(b.trip.tripDatetime).getTime() - new Date(a.trip.tripDatetime).getTime())
  }
  return all
      .filter(r => r.reservationStatus === 'CANCELLED')
      .sort((a, b) => new Date(b.trip.tripDatetime).getTime() - new Date(a.trip.tripDatetime).getTime())
})

const emptyMessage = computed(() => {
  if (activeTab.value === 'active') return 'Aucune réservation en cours.'
  if (activeTab.value === 'completed') return 'Aucune réservation terminée.'
  return 'Aucune réservation annulée.'
})
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">

      <h1 class="text-xl font-semibold text-gray-900">Mes réservations</h1>

      <!-- Onglets -->
      <div class="flex border-b border-gray-200">
        <button
            v-for="tab in [
              { key: 'active', label: 'En cours' },
              { key: 'completed', label: 'Terminées' },
              { key: 'cancelled', label: 'Annulées' },
            ]"
            :key="tab.key"
            @click="activeTab = tab.key as 'active' | 'completed' | 'cancelled'"
            class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
            :class="activeTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
        </button>
      </div>

      <p v-if="pending" class="text-sm text-gray-500 text-center py-8">
        Chargement...
      </p>

      <ul v-else-if="sortedReservations.length" class="space-y-3">
        <NuxtLink
            v-for="(reservation, index) in sortedReservations"
            :key="reservation.id"
            :to="`/reservations/${reservation.trip.id}`"
            class="block"
        >
          <TripMinimalCard :trip="reservation.trip" :index="index" role="passenger" />
        </NuxtLink>
      </ul>

      <p v-else class="text-sm text-gray-500 text-center py-8">
        {{ emptyMessage }}
      </p>

    </div>
  </main>
</template>