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

const birthDay   = ref('')
const birthMonth = ref('')
const birthYear  = ref('')

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_, i) => currentYear - 15 - i)

const isBirthdayValid = computed(() => {
  if (!birthDay.value || !birthMonth.value || !birthYear.value) return true // pas encore rempli
  const date = new Date(`${birthYear.value}-${birthMonth.value}-${birthDay.value}`)
  return !isNaN(date.getTime()) &&
      date.getDate() === parseInt(birthDay.value) &&
      date.getMonth() + 1 === parseInt(birthMonth.value)
})

watch([birthDay, birthMonth, birthYear], () => {
  if (birthDay.value && birthMonth.value && birthYear.value) {
    profileForm.birthday = `${birthYear.value}-${birthMonth.value}-${birthDay.value}`
  }
})

watch(person, (val) => {
  if (val?.profile) {
    profileForm.firstname = val.profile.firstname
    profileForm.lastname  = val.profile.lastname
    profileForm.phone     = val.profile.phone
    if (val.profile.birthday) {
      const parts = val.profile.birthday.slice(0, 10).split('-')
      birthYear.value  = parts[0] ?? ''
      birthMonth.value = parts[1] ?? ''
      birthDay.value   = parts[2] ?? ''
    }
  }
}, { immediate: true })

const loading = ref(false)
const success = ref(false)
const error   = ref('')

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value   = ''

  if (!isBirthdayValid.value) {
    error.value = 'La date de naissance est invalide.'
    loading.value = false
    return
  }

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
  <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

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
      <div class="flex gap-2">
        <select
            v-model="birthDay"
            class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="">Jour</option>
          <option v-for="d in 31" :key="d" :value="String(d).padStart(2, '0')">{{ d }}</option>
        </select>
        <select
            v-model="birthMonth"
            class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="">Mois</option>
          <option
              v-for="(m, i) in ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']"
              :key="i"
              :value="String(i + 1).padStart(2, '0')"
          >{{ m }}</option>
        </select>
        <select
            v-model="birthYear"
            class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="">Année</option>
          <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
        </select>
      </div>
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