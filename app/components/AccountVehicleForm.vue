<script setup lang="ts">
import type { VehicleRequest } from '#shared/types/vehicle'

defineProps<{ locked: boolean }>()

const { vehicle, brands, saveVehicle, deleteVehicle } = useVehicle()

const hasVehicle = computed(() => !!vehicle.value)

const vehicleForm = reactive<VehicleRequest>({
  brandId:     0,
  model:       '',
  description: '',
  plate:       '',
  seats:       1,
})

watch(vehicle, (val) => {
  if (val) {
    vehicleForm.brandId     = val.brand.id
    vehicleForm.model       = val.model
    vehicleForm.description = val.description
    vehicleForm.plate       = val.plate
    vehicleForm.seats       = val.seats
  }
}, { immediate: true })

const loading = ref(false)
const success = ref(false)
const error   = ref('')

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value   = ''
  try {
    await saveVehicle(vehicleForm, hasVehicle.value ? vehicle.value!.id : undefined)
    success.value = true
  } catch (e: any) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}

const deleteConfirm = ref(false)
const deleteLoading = ref(false)
const deleteError   = ref('')

const handleDelete = async () => {
  deleteLoading.value = true
  deleteError.value   = ''
  success.value       = false
  try {
    await deleteVehicle(vehicle.value!.id)
    deleteConfirm.value = false
    Object.assign(vehicleForm, { brandId: 0, model: '', description: '', plate: '', seats: 1 })
  } catch (e: any) {
    deleteError.value = getErrorMessage(e)
  } finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 relative">

    <form
        @submit.prevent="handleSubmit"
        class="p-6 space-y-4"
        :class="{ 'opacity-30 blur-sm pointer-events-none select-none': locked }"
    >
      <h2 class="text-base font-semibold text-gray-900">Mon véhicule</h2>

      <div class="space-y-1">
        <label for="brand" class="text-sm font-medium text-gray-700">Marque</label>
        <select
            id="brand"
            v-model="vehicleForm.brandId"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option :value="0" disabled>Sélectionner une marque</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
        </select>
      </div>

      <div class="space-y-1">
        <label for="model" class="text-sm font-medium text-gray-700">Modèle</label>
        <input
            id="model"
            v-model="vehicleForm.model"
            type="text"
            required
            placeholder="V10 Turbo"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <div class="space-y-1">
        <label for="description" class="text-sm font-medium text-gray-700">Description</label>
        <textarea
            id="description"
            v-model="vehicleForm.description"
            placeholder="pur cuir, climatisation, coffre spacieux..."
            rows="3"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label for="plate" class="text-sm font-medium text-gray-700">Plaque</label>
          <input
              id="plate"
              v-model="vehicleForm.plate"
              type="text"
              required
              placeholder="AB-143-CD"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div class="space-y-1">
          <label for="seats" class="text-sm font-medium text-gray-700">Places disponibles</label>
          <input
              id="seats"
              v-model.number="vehicleForm.seats"
              type="number"
              min="1"
              max="9"
              required
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
      <p v-if="success" class="text-xs text-green-600">Véhicule enregistré avec succès.</p>

      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
      >
        {{ loading ? 'Enregistrement...' : hasVehicle ? 'Mettre à jour le véhicule' : 'Ajouter mon véhicule' }}
      </button>

      <div v-if="hasVehicle" class="flex justify-end">
        <button
            type="button"
            @click="deleteConfirm = true"
            class="text-sm text-gray-900 hover:text-gray-600 transition-colors underline underline-offset-2"
        >
          Supprimer ce véhicule
        </button>
      </div>
    </form>

    <!-- Overlay si locked -->
    <div v-if="locked" class="absolute inset-0 flex items-center justify-center bg-white/75 rounded-xl">
      <div class="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 mx-4 text-center shadow-sm">
        <p class="text-sm font-semibold text-amber-700">⚠️ Profil incomplet</p>
        <p class="text-xs text-amber-600 mt-1">Complétez votre profil pour renseigner votre véhicule.</p>
      </div>
    </div>

    <!-- Modal suppression -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-black/40" @click="deleteConfirm = false" />
          <div class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 class="text-base font-semibold text-gray-900">Supprimer le véhicule</h3>
            <p class="text-sm text-gray-500">Cette action est irréversible.</p>
            <p v-if="deleteError" class="text-xs text-red-500">{{ deleteError }}</p>
            <div class="flex gap-3 pt-2">
              <button
                  type="button"
                  @click="handleDelete"
                  :disabled="deleteLoading"
                  class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                {{ deleteLoading ? 'Suppression...' : 'Confirmer' }}
              </button>
              <button
                  type="button"
                  @click="deleteConfirm = false"
                  class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>