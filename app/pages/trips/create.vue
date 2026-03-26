<script setup lang="ts">
const { createTrip } = useTrips()
const departure = useAddressSearch()
const arriving = useAddressSearch()

const form = reactive({
  tripDate: '',
  tripHour: '08',
  tripMinute: '00',
  availableSeats: 1,
  smokingAllowed: false,
})

const loading = ref(false)
const error = ref('')

const today = new Date().toISOString().split('T')[0]

const tripDatetime = computed(() => {
  if (!form.tripDate) return null
  return `${form.tripDate}T${form.tripHour}:${form.tripMinute}:00`
})

const canSubmit = computed(() =>
    departure.selectedAddress.value?.id &&
    arriving.selectedAddress.value?.id &&
    tripDatetime.value !== null
)

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

const handleSubmit = async () => {
  if (!canSubmit.value || !tripDatetime.value) return
  loading.value = true
  error.value = ''
  try {
    await createTrip({
      tripDatetime: tripDatetime.value,
      availableSeats: form.availableSeats,
      smokingAllowed: form.smokingAllowed,
      departureAddressId: departure.selectedAddress.value!.id,
      arrivingAddressId: arriving.selectedAddress.value!.id,
    })
    await navigateTo('/trips')
  } catch (e: any) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
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
        <span class="text-gray-900 font-medium">Créer un trajet</span>
      </nav>

      <form @submit.prevent="handleSubmit" class="space-y-4">

        <!-- Adresse de départ -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 class="text-sm font-semibold text-gray-900">Départ</h2>
          <AddressSearchInput
              label="Ville de départ"
              :city-query="departure.cityQuery.value"
              :city-suggestions="departure.citySuggestions.value"
              :selected-city="departure.selectedCity.value"
              :address-query="departure.addressQuery.value"
              :address-suggestions="departure.addressSuggestions.value"
              :selected-address="departure.selectedAddress.value"
              :loading-cities="departure.loadingCities.value"
              :loading-addresses="departure.loadingAddresses.value"
              @update:city-query="inputValue => { departure.cityQuery.value = inputValue; departure.searchCities(inputValue) }"
              @update:address-query="inputValue => { departure.addressQuery.value = inputValue; departure.searchAddresses(inputValue) }"
              @select-city="departure.selectCity"
              @select-address="departure.selectAddress"
          />
        </div>

        <!-- Adresse d'arrivée -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 class="text-sm font-semibold text-gray-900">Arrivée</h2>
          <AddressSearchInput
              label="Ville d'arrivée"
              :city-query="arriving.cityQuery.value"
              :city-suggestions="arriving.citySuggestions.value"
              :selected-city="arriving.selectedCity.value"
              :address-query="arriving.addressQuery.value"
              :address-suggestions="arriving.addressSuggestions.value"
              :selected-address="arriving.selectedAddress.value"
              :loading-cities="arriving.loadingCities.value"
              :loading-addresses="arriving.loadingAddresses.value"
              @update:city-query="inputValue => { arriving.cityQuery.value = inputValue; arriving.searchCities(inputValue) }"
              @update:address-query="inputValue => { arriving.addressQuery.value = inputValue; arriving.searchAddresses(inputValue) }"
              @select-city="arriving.selectCity"
              @select-address="arriving.selectAddress"
          />
        </div>

        <!-- Date et options -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h2 class="text-sm font-semibold text-gray-900">Détails</h2>

          <!-- Date -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Date de départ</label>
            <input
                v-model="form.tripDate"
                type="date"
                :min="today"
                required
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <!-- Heure -->
          <div v-if="form.tripDate" class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Heure de départ</label>
            <div class="flex items-center gap-2">
              <select
                  v-model="form.tripHour"
                  class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option v-for="h in hours" :key="h" :value="h">{{ h }}h</option>
              </select>
              <span class="text-gray-400 font-medium">:</span>
              <select
                  v-model="form.tripMinute"
                  class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <!-- Places -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Places disponibles</label>
            <input
                v-model.number="form.availableSeats"
                type="number" min="1" max="8" required
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <!-- Fumeurs -->
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Fumeurs acceptés</label>
            <input type="checkbox" v-model="form.smokingAllowed" class="w-4 h-4 accent-blue-600" />
          </div>
        </div>

        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>

        <button
            type="submit"
            :disabled="loading || !canSubmit"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          {{ loading ? 'Création...' : 'Créer le trajet' }}
        </button>

      </form>
    </div>
  </main>
</template>