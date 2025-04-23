<template>
  <div class="app-container">
    <TheHeader />
    <main>
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  },
  setup() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    const router = useRouter()

    onMounted(() => {
      // Try to restore user session from localStorage
    })
  }
}
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: var(--spacing-lg) 0;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>