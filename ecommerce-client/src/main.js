import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

// Import des composants globaux
import Alert from './components/common/Alert.vue'
import Loader from './components/common/Loader.vue'
import Pagination from './components/common/Pagination.vue'

// ⚠️ IMPORT du store auth
import { useAuthStore } from './store/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ⚙️ Initialisation dans une fonction asynchrone
const initApp = async () => {
  const authStore = useAuthStore()
  authStore.initAuth()
  if (authStore.token) {
    await authStore.fetchProfile()
  }

  // Composants globaux
  app.component('Alert', Alert)
  app.component('Loader', Loader)
  app.component('Pagination', Pagination)

  app.mount('#app')
}

initApp()
