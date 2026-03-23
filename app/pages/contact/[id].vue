<script setup lang="ts">
const route = useRoute()
const requestFetch = useRequestFetch()

const { data: person } = useAsyncData(
    `person-contact-${route.params.id}`,
    () => requestFetch<Person>(`/api/persons/${route.params.id}`),
    { lazy: true }
)

const form = reactive({ subject: '', message: '' })
const loading = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  // TODO : implémenter quand l'endpoint sera disponible
  success.value = true
}
</script>

<template>
  <main class="min-h-[calc(100vh-113px)] md:min-h-[calc(100vh-130px)] bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">

      <nav class="flex items-center gap-2 text-sm mb-2">
        <NuxtLink to="" @click="$router.back()" class="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
          Retour
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <span class="text-gray-900 font-medium">Contacter</span>
      </nav>

      <div v-if="person" class="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0">
          {{ person.profile
            ? (person.profile.firstname?.[0] ?? '') + (person.profile.lastname?.[0] ?? '')
            : (person.email?.[0]?.toUpperCase() ?? '?')
          }}
        </div>
        <div>
          <p class="font-medium text-gray-900">
            {{ person.profile ? `${person.profile.firstname} ${person.profile.lastname}` : 'Profil incomplet' }}
          </p>
          <p class="text-sm text-gray-500">{{ person.email }}</p>
          <p v-if="person.profile?.phone" class="text-sm text-gray-400">{{ person.profile.phone }}</p>
        </div>
      </div>

      <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
        Message envoyé avec succès.
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h2 class="text-sm font-semibold text-gray-900">Envoyer un message</h2>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Sujet</label>
          <input
              v-model="form.subject"
              type="text"
              required
              placeholder="Ex: Question sur le trajet"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Message</label>
          <textarea
              v-model="form.message"
              required
              rows="4"
              placeholder="Votre message..."
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          {{ loading ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>

    </div>
  </main>
</template>