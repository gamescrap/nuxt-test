<script setup lang="ts">
const { login } = useAuth()

definePageMeta({ middleware: 'guest' })

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
  <main>
    <h1>Connexion</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>

      <div>
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>

      <p v-if="error">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>

    <p>Pas encore de compte ? <NuxtLink to="/auth/register">S'inscrire</NuxtLink></p>
  </main>
</template>

<style scoped>

</style>