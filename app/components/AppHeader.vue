<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

const { logout, isAuthenticated } = useAuth()
const { displayName } = usePerson()

const handleLogout = async () => {
  await logout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <header v-if="isAuthenticated" class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
    <div class="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">

      <p class="text-sm text-gray-500 truncate">
        Connecté en tant que
        <span class="font-medium text-gray-900">{{ displayName }}</span>
      </p>

      <button
          @click="handleLogout"
          aria-label="Se déconnecter"
          class="text-gray-400 hover:text-gray-700 transition-colors p-1"
      >
        <LogOut :size="18" />
      </button>

    </div>
  </header>
</template>