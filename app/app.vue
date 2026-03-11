<script setup lang="ts">
const { isAuthenticated, isRefreshing } = useAuth()
const showLoading = ref(false)
const MIN_LOADING_MS = 1000

watch(isRefreshing, (val) => {
  if (val) {
    showLoading.value = true
    return
  }
  // isRefreshing passé à false → attend le minimum
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
  <div v-if="showLoading" style="display: flex; align-items: center; justify-content: center; height: 100vh;">
    <p>Chargement...</p>
  </div>

  <template v-else>
    <button @click="handleTest">Tester le chargement</button>
    <NuxtPage />
  </template>
</template>