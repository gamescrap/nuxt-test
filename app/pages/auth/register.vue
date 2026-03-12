<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { register } = useAuth()
const form = reactive({ email: '', password: '', confirmPassword: '' })
const error = ref('')
const validationErrors = ref<Record<string, string>>({})
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  validationErrors.value = {}

  if (form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    await register(form.email, form.password)
    await navigateTo('/')
  } catch (e: any) {
    error.value = getErrorMessage(e)
    validationErrors.value = getValidationErrors(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Créer un compte</h1>
        <p class="text-sm text-gray-500 mt-1">Rejoignez notre communauté de covoiturage</p>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

        <div class="space-y-1">
          <label for="email" class="text-sm font-medium text-gray-700">Email</label>
          <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="votre@email.com"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :class="{ 'border-red-400': validationErrors.email }"
          />
          <p v-if="validationErrors.email" class="text-xs text-red-500">{{ validationErrors.email }}</p>
        </div>

        <div class="space-y-1">
          <label for="password" class="text-sm font-medium text-gray-700">Mot de passe</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :class="{ 'border-red-400': validationErrors.password }"
          />
          <p v-if="validationErrors.password" class="text-xs text-red-500">{{ validationErrors.password }}</p>
        </div>

        <div class="space-y-1">
          <label for="confirm" class="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
          <input
              id="confirm"
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>

        <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>

      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        Déjà un compte ?
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-800 font-medium">
          Se connecter
        </NuxtLink>
      </p>

    </div>
  </main>
</template>