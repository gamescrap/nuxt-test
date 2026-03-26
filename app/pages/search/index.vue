<script setup lang="ts">
const departure = useAddressSearch()
const arriving = useAddressSearch()

const departureCity = ref('')
const arrivalCity = ref('')
const tripDate = ref('')
const fromHour = ref('00')

const today = new Date().toISOString().split('T')[0]
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

const canSearch = computed(() =>
    departure.selectedCity.value !== null &&
    arriving.selectedCity.value !== null &&
    tripDate.value.length > 0
)

const handleSearch = () => {
  if (!canSearch.value) return
  navigateTo({
    path: '/search/results',
    query: {
      startingCity: departure.selectedCity.value!.name,
      arrivalCity: arriving.selectedCity.value!.name,
      tripDate: tripDate.value,
      fromHour: fromHour.value,
    }
  })
}
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">

      <h1 class="text-xl font-semibold text-gray-900">Rechercher un trajet</h1>

      <form @submit.prevent="handleSearch" class="space-y-4">

        <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

          <CitySearchInput
              label="Ville de départ"
              :city-query="departure.cityQuery.value"
              :city-suggestions="departure.citySuggestions.value"
              :selected-city="departure.selectedCity.value"
              :loading-cities="departure.loadingCities.value"
              @update:city-query="q => { departure.cityQuery.value = q; departure.searchCities(q) }"
              @select-city="departure.selectCity"
          />

          <CitySearchInput
              label="Ville d'arrivée"
              :city-query="arriving.cityQuery.value"
              :city-suggestions="arriving.citySuggestions.value"
              :selected-city="arriving.selectedCity.value"
              :loading-cities="arriving.loadingCities.value"
              @update:city-query="q => { arriving.cityQuery.value = q; arriving.searchCities(q) }"
              @select-city="arriving.selectCity"
          />

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Date</label>
            <input
                v-model="tripDate"
                type="date"
                :min="today"
                required
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div v-if="tripDate" class="space-y-1">
            <label class="text-sm font-medium text-gray-700">À partir de</label>
            <select
                v-model="fromHour"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option v-for="h in hours" :key="h" :value="h">{{ h }}h00</option>
            </select>
          </div>

        </div>

        <button
            type="submit"
            :disabled="!canSearch"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          Rechercher
        </button>

      </form>
    </div>
  </main>
</template>