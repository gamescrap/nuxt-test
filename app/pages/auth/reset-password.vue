<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const route = useRoute()
const token = route.query.token as string

const form = reactive({ newPassword: '', confirmPassword: '' })
const error = ref('')
const success = ref(false)
const loading = ref(false)

if (!token) {
  await navigateTo('/auth/forgot-password')
}

const handleSubmit = async () => {
  error.value = ''

  if (form.newPassword !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword: form.newPassword }
    })
    success.value = true
  } catch (e: any) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <div v-if="!success" class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Nouveau mot de passe</h1>
        <p class="text-sm text-gray-500 mt-1">Choisissez un nouveau mot de passe pour votre compte</p>
      </div>

      <!-- Succès -->
      <div v-if="success" class="bg-white rounded-2xl border border-gray-200 p-6 text-center space-y-4">
        <p class="text-sm text-green-600">Votre mot de passe a été réinitialisé avec succès.</p>
        <NuxtLink
            to="/auth/login"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors text-center"
        >
          Se connecter
        </NuxtLink>
      </div>

      <!-- Formulaire -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

        <div class="space-y-1">
          <label for="password" class="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
          <input
              id="password"
              v-model="form.newPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
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
          {{ loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
        </button>

      </form>

    </div>
  </main>
</template>