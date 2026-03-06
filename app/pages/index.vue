<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { userId, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <main>
    <h1>Dashboard</h1>
    <p>Connecté en tant qu'utilisateur #{{ userId }}</p>
    <button @click="handleLogout">Se déconnecter</button>
  </main>
</template>

<style scoped>

</style>