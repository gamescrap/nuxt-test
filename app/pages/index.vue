<script setup lang="ts">
import {formatTripDate} from "#shared/utils/date";

definePageMeta({ middleware: 'auth' })

const { userId, logout } = useAuth()
const { fetchTrips } = useTrips()

const {data: trips, error, refresh : refreshTrips } = await fetchTrips({isUpcoming: true})

const handleLogout = async () => {
  await logout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <main>
    <h1>Dashboard</h1>
    <p>Connecté en tant qu'utilisateur #{{ userId }}</p>
    <button @click="handleLogout()">Se déconnecter</button>
    <button @click="refreshTrips()">rafraichir la liste des trajets</button>

    <h2>Trajets disponibles</h2>

    <p v-if="error">Erreur lors du chargement des trajets.</p>

    <ul v-else-if="trips?.length">
      <li v-for="trip in trips" :key="trip.id">
        <strong>
          {{ trip.departureAddress.city.name }}
          →
          {{ trip.arrivingAddress.city.name }}
        </strong>
        | Conducteur : {{ trip.driver.firstname }} {{ trip.driver.lastname }}
        | Places restantes : {{ trip.availableSeats }}
        | Distance : {{ trip.distanceKm ?? 'Inconnu' }} km
        | Durée : {{ trip.durationMinutes ?? 'Inconnu' }} min
        | Date de départ : {{ formatTripDate(trip.tripDatetime) }}
      </li>
    </ul>

    <p v-else>Aucun trajet disponible.</p>
  </main>
</template>

<style scoped>

</style>