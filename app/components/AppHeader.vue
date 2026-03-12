<script setup lang="ts">
const { isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <header class="bg-blue-600 px-4 py-4">
    <div class="max-w-2xl mx-auto flex items-center justify-between">
      <NuxtLink to="/" class="text-lg font-semibold text-white">Covoiturage</NuxtLink>

      <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="text-sm text-blue-200 hover:text-white transition-colors"
      >
        Se déconnecter
      </button>

      <NuxtLink
          v-else
          to="/auth/login"
          class="text-sm text-blue-200 hover:text-white transition-colors"
      >
        Se connecter
      </NuxtLink>
    </div>
  </header>
</template>