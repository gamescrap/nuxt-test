<script setup lang="ts">
const { isAuthenticated, register } = useAuth()

if (isAuthenticated.value) await navigateTo('/')

const form = reactive({ email: '', password: '', confirmPassword: '' })
const error = ref('')
const validationErrors = ref<Record<string, string>>({})
const loading = ref(false)

const handleSubmit = async () => {
  console.log('handleSubmit appelé')
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
    console.error('Erreur reçue dans le composant:', e)
    if (e?.data?.validationErrors) {
      validationErrors.value = e.data.validationErrors
    } else {
      error.value = e?.data?.message || 'Une erreur est survenue.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h1>Créer un compte</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required />
        <span v-if="validationErrors.email">{{ validationErrors.email }}</span>
      </div>

      <div>
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" required />
        <span v-if="validationErrors.password">{{ validationErrors.password }}</span>
      </div>

      <div>
        <label for="confirm">Confirmer le mot de passe</label>
        <input id="confirm" v-model="form.confirmPassword" type="password" required />
      </div>

      <p v-if="error">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Inscription...' : "S'inscrire" }}
      </button>
    </form>

    <p>Déjà un compte ? <NuxtLink to="/auth/login">Se connecter</NuxtLink></p>
  </main>
</template>