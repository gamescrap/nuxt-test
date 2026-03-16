<script setup lang="ts">
import AppFooter from "~/components/AppFooter.vue";

const { isAuthenticated, isRefreshing } = useAuth()
const route = useRoute()
const showLoading = ref(false)
const MIN_LOADING_MS = 1000

const isAuthPage = computed(() => route.path.startsWith('/auth/'))

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
  if (val) {
    setTimeout(() => {
      isRefreshing.value = false
    }, MIN_LOADING_MS)
    return
  }

  if (!isRefreshing.value) {
    navigateTo('/auth/login')
  }
})
</script>

<template>
  <AppLoader v-if="showLoading" />

  <template v-else>
    <AppHeader v-if="!isAuthPage" />
    <main :class="!isAuthPage ? 'pt-12 pb-[4rem] md:pb-[5rem]' : ''">
      <NuxtPage />
    </main>
    <AppFooter v-if="!isAuthPage" />
  </template>
</template>