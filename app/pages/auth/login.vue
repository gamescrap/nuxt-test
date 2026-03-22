<script setup lang="ts">
const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(form.email, form.password)
    await navigateTo('/')
  } catch (e: any) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Connexion</h1>
        <p class="text-sm text-gray-500 mt-1">Bienvenue, connectez-vous pour continuer</p>
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
          />
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
          />
        </div>

        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>

        <div class="flex justify-end">
          <NuxtLink
              to="/auth/forgot-password"
              class="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            Mot de passe oublié ?
          </NuxtLink>
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        Pas encore de compte ?
        <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-800 font-medium">
          S'inscrire
        </NuxtLink>
      </p>

    </div>
  </main>
</template>