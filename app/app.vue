<script setup lang="ts">
const { isAuthenticated, isRefreshing } = useAuth()
const showLoading = ref(false)
const MIN_LOADING_MS = 3000

watch(isRefreshing, (val) => {
  if (val) {
    showLoading.value = true
    return
  }

  setTimeout(() => {
    showLoading.value = false
  }, MIN_LOADING_MS)
})

watch(isAuthenticated, (val) => {
  if (!val && !isRefreshing.value) {
    navigateTo('/auth/login')
  }
})

const handleTest = () => {
  showLoading.value = true
  setTimeout(() => showLoading.value = false, MIN_LOADING_MS)
}
</script>

<template>
  <AppLoader v-if="showLoading" />

  <template v-else>
    <AppHeader />
<!--    <button @click="handleTest">Tester le chargement</button>-->
    <NuxtPage />
  </template>
</template>
