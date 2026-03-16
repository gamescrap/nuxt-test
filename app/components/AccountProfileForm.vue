<script setup lang="ts">
import type { UpdatePersonRequest } from '#shared/types/person'

const { userId } = useAuth()
const { person } = usePerson()

const hasProfile = computed(() => !!person.value?.profile)

const profileForm = reactive<UpdatePersonRequest>({
  firstname: '',
  lastname:  '',
  phone:     '',
  birthday:  '',
})

watch(person, (val) => {
  if (val?.profile) {
    profileForm.firstname = val.profile.firstname
    profileForm.lastname  = val.profile.lastname
    profileForm.phone     = val.profile.phone
    profileForm.birthday  = val.profile.birthday?.slice(0, 10) ?? ''
  }
}, { immediate: true })

const loading = ref(false)
const success = ref(false)
const error   = ref('')

const maxDate = new Date()
maxDate.setFullYear(maxDate.getFullYear() - 15)

const birthdayDate = computed({
  get: () => profileForm.birthday ? new Date(profileForm.birthday) : null,
  set: (val: Date | null) => {
    if (!val) return
    profileForm.birthday = val.toISOString().slice(0, 10)
  }
})

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value   = ''
  try {
    await $fetch(hasProfile.value ? `/api/persons/${userId.value}` : '/api/persons', {
      method: hasProfile.value ? 'PATCH' : 'POST',
      body: profileForm,
    })
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
  <form @submit.prevent="handleSubmit" class="slide-in bg-white rounded-xl border border-gray-200 p-6 space-y-4">

    <h2 class="text-base font-semibold text-gray-900">Informations personnelles</h2>

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
            v-model="profileForm.firstname"
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
            v-model="profileForm.lastname"
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
          v-model="profileForm.phone"
          type="tel"
          required
          placeholder="0612345678"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>

    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">Date de naissance</label>
      <VDatePicker
          v-model="birthdayDate"
          :max-date="maxDate"
          mode="date"
          :popover="{ visibility: 'click' }"
      >
        <template #default="{ inputValue, inputEvents }">
          <input
              :value="inputValue"
              v-on="inputEvents"
              placeholder="JJ/MM/AAAA"
              readonly
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
          />
        </template>
      </VDatePicker>
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
</template>