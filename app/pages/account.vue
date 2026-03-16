<script setup lang="ts">
import type { UpdatePersonRequest } from '#shared/types/person'

definePageMeta({ middleware: 'auth' })

const { userId } = useAuth()
const { person, displayName } = usePerson()

const hasProfile = computed(() => !!person.value?.profile)

const form = reactive<UpdatePersonRequest>({
  firstname: '',
  lastname: '',
  phone: '',
  birthday: '',
})

// Pré-remplit le formulaire si profil existant
watch(person, (val) => {
  if (val?.profile) {
    form.firstname = val.profile.firstname
    form.lastname  = val.profile.lastname
    form.phone     = val.profile.phone
    form.birthday  = val.profile.birthday?.slice(0, 10) ?? ''
  }
}, { immediate: true })

const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value   = ''
  try {
    if (hasProfile.value) {
      await $fetch(`/api/persons/${userId.value}`, {
        method: 'PATCH',
        body: form,
      })
    } else {
      await $fetch('/api/persons', {
        method: 'POST',
        body: form,
      })
    }
    success.value = true
    await refreshNuxtData('person')
  } catch (e: any) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-6">

    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Mon compte</h1>
      <p class="text-sm text-gray-500 mt-1">{{ person?.email }}</p>
    </div>

    <!-- Bandeau si pas de profil -->
    <div v-if="!hasProfile" class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <p class="text-sm text-blue-700 font-medium">Votre profil est incomplet</p>
      <p class="text-sm text-blue-600 mt-1">Renseignez vos informations pour utiliser pleinement l'application.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">Email</label>
        <input
            :value="person?.email"
            disabled
            class="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label for="firstname" class="text-sm font-medium text-gray-700">Prénom</label>
          <input
              id="firstname"
              v-model="form.firstname"
              type="text"
              required
              placeholder="Jean"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div class="space-y-1">
          <label for="lastname" class="text-sm font-medium text-gray-700">Nom</label>
          <input
              id="lastname"
              v-model="form.lastname"
              type="text"
              required
              placeholder="Martin"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label for="phone" class="text-sm font-medium text-gray-700">Téléphone</label>
        <input
            id="phone"
            v-model="form.phone"
            type="tel"
            required
            placeholder="0612345678"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <div class="space-y-1">
        <label for="birthday" class="text-sm font-medium text-gray-700">Date de naissance</label>
        <input
            id="birthday"
            v-model="form.birthday"
            type="date"
            required
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
      <p v-if="success" class="text-xs text-green-600">Profil mis à jour avec succès.</p>

      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
      >
        {{ loading ? 'Enregistrement...' : hasProfile ? 'Mettre à jour' : 'Créer mon profil' }}
      </button>

    </form>

  </main>
</template>