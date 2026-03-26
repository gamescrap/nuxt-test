<script setup lang="ts">
defineProps<{
  label: string
  cityQuery: string
  citySuggestions: City[]
  selectedCity: City | null
  loadingCities: boolean
}>()

defineEmits<{
  'update:cityQuery': [value: string]
  'selectCity': [city: City]
}>()
</script>

<template>
  <div class="space-y-1 relative">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative">
      <input
          :value="cityQuery"
          type="text"
          placeholder="Ex: Vannes"
          @input="$emit('update:cityQuery', ($event.target as HTMLInputElement).value)"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <span v-if="selectedCity" class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
        <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </span>
      <span v-else-if="cityQuery.length > 1" class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
        <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </span>
    </div>

    <ul v-if="citySuggestions.length" class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
      <li
          v-for="city in citySuggestions"
          :key="`${city.name}-${city.postalCode}`"
          @click="$emit('selectCity', city)"
          class="px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 cursor-pointer flex justify-between"
      >
        <span>{{ city.name }}</span>
        <span class="text-gray-400">{{ city.postalCode }}</span>
      </li>
    </ul>
    <p v-if="loadingCities" class="text-xs text-gray-400">Recherche...</p>
  </div>
</template>