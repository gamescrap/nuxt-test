<script setup lang="ts">
const { forgotPassword } = useAuth()

const form = reactive({ email: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await forgotPassword(form.email)
    success.value = 'Un email de réinitialisation a été envoyé si ce compte existe.'
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

      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Mot de passe oublié</h1>
        <p class="text-sm text-gray-500 mt-1">Renseignez votre email pour recevoir un lien de réinitialisation</p>
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

        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
        <p v-if="success" class="text-xs text-green-600">{{ success }}</p>

        <button
            type="submit"
            :disabled="loading || !!success"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
        </button>

      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-800 font-medium">
          Retour à la connexion
        </NuxtLink>
      </p>

    </div>
  </main>
</template>