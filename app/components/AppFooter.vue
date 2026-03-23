<script setup lang="ts">
import { Home, Navigation, Search, BookMarked, User, LogOut } from 'lucide-vue-next'

const { isAuthenticated } = useAuth()

const links = [
  { to: '/',             label: 'Accueil',           icon: Home       },
  { to: '/trips',   label: 'Mes trajets',        icon: Navigation },
  { to: '/', label: 'Trouver un trajet',  icon: Search     },
  { to: '/', label: 'Mes réservations',   icon: BookMarked },
  { to: '/account',      label: 'Mon compte',         icon: User       },
]
</script>

<template>
  <footer v-if="isAuthenticated" class="app-footer fixed bottom-0 left-0 right-0 bg-blue-600 border-t border-blue-500 z-50">

    <!-- Desktop -->
    <div class="hidden md:flex items-stretch justify-center h-[80px] max-w-2xl mx-auto">

      <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex flex-col items-center justify-center gap-1.5 px-6 text-blue-200 hover:text-white hover:bg-blue-500 transition-colors border-r border-blue-500 first:border-l"
          active-class="!text-white !bg-blue-500"
      >
        <component :is="link.icon" :size="22" />
        <span class="text-xs whitespace-nowrap">{{ link.label }}</span>
      </NuxtLink>
    </div>

    <!-- Mobile -->
    <div class="flex md:hidden items-stretch justify-around h-16">

      <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :aria-label="link.label"
          class="flex items-center justify-center flex-1 text-blue-200 hover:text-white hover:bg-blue-500 transition-colors border-r border-blue-500 first:border-l"
          active-class="!text-white !bg-blue-500"
      >
        <component :is="link.icon" :size="22" />
      </NuxtLink>
    </div>

  </footer>
</template>

<style scoped>
.app-footer {
  animation: slideDown 0.4s ease both;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>