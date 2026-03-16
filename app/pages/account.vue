<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { userId, logout } = useAuth()
const { person } = usePerson()
const hasProfile = computed(() => !!person.value?.profile)

const deleteAccountConfirm = ref(false)
const deleteAccountLoading = ref(false)
const deleteAccountError   = ref('')

const handleDeleteAccount = async () => {
  deleteAccountLoading.value = true
  deleteAccountError.value   = ''
  try {
    await $fetch(`/api/persons/${userId.value}/soft-delete`, { method: 'PATCH' })
    await logout()
    await navigateTo('/auth/login')
  } catch (e: any) {
    deleteAccountError.value = getErrorMessage(e)
  } finally {
    deleteAccountLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">

      <div class="mb-2">
        <h1 class="text-xl font-semibold text-gray-900">Mon compte</h1>
        <p class="text-sm text-gray-500 mt-1">{{ person?.email }}</p>
      </div>

      <div v-if="!hasProfile" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p class="text-sm text-blue-700 font-medium">Votre profil est incomplet</p>
        <p class="text-sm text-blue-600 mt-1">Renseignez vos informations pour utiliser pleinement l'application.</p>
      </div>

      <AccountProfileForm />


      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden relative">

        <div v-if="!hasProfile" class="p-6 space-y-4 opacity-30 pointer-events-none select-none">
          <h2 class="text-base font-semibold text-gray-900">Mon véhicule</h2>
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Marque</label>
            <select disabled class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Modèle</label>
              <input disabled class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Plaque</label>
              <input disabled class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" />
            </div>
          </div>
        </div>

        <div v-if="!hasProfile" class="absolute inset-0 flex items-center justify-center bg-white/75">
          <div class="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 mx-4 text-center shadow-sm">
            <p class="text-sm font-semibold text-amber-700">⚠️ Profil incomplet</p>
            <p class="text-xs text-amber-600 mt-1">Complétez votre profil pour renseigner votre véhicule.</p>
          </div>
        </div>

        <AccountVehicleForm v-else />

      </div>

      <!-- Suppression compte -->
      <div class="slide-in" style="animation-delay: 300ms">
        <div class="flex justify-end">
          <button
              type="button"
              @click="deleteAccountConfirm = true"
              class="text-sm text-red-500 hover:text-red-700 transition-colors underline underline-offset-2"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="modal">
          <div v-if="deleteAccountConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div class="absolute inset-0 bg-black/40" @click="deleteAccountConfirm = false" />
            <div class="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
              <h3 class="text-base font-semibold text-gray-900">Supprimer mon compte</h3>
              <p class="text-sm text-gray-500">Cette action est irréversible. Votre compte sera définitivement supprimé.</p>
              <p v-if="deleteAccountError" class="text-xs text-red-500">{{ deleteAccountError }}</p>
              <div class="flex gap-3 pt-2">
                <button
                    type="button"
                    @click="handleDeleteAccount"
                    :disabled="deleteAccountLoading"
                    class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                >
                  {{ deleteAccountLoading ? 'Suppression...' : 'Confirmer' }}
                </button>
                <button
                    type="button"
                    @click="deleteAccountConfirm = false"
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
  </main>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>