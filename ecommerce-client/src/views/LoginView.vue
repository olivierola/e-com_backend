<template>
  <div class="login-page">
    <div class="auth-container">
      <h1>Connexion</h1>
      
      <Alert
        v-if="error"
        :message="error"
        type="danger"
        :dismissible="true"
        @dismiss="error = ''"
      />
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Votre adresse email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Votre mot de passe"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Vous n'avez pas de compte ? <router-link to="/register">Créer un compte</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import Alert from '@/components/common/Alert.vue'

export default {
  name: 'LoginView',
  components: {
    Alert
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    
    const email = ref('')
    const password = ref('')
    const error = ref('')
    
    const loading = computed(() => authStore.loading)
    
    const redirectPath = computed(() => {
      return route.query.redirect || '/'
    })
    
    const handleSubmit = async () => {
      error.value = ''
      
      const success = await authStore.login({
        email: email.value,
        password: password.value
      })
      
      if (success) {
        await cartStore.fetchCart()
        router.push(redirectPath.value)
      } else {
        error.value = authStore.error
      }
    }
    
    return {
      email,
      password,
      error,
      loading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: white;
}

.auth-container h1 {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.auth-form {
  margin-bottom: var(--spacing-lg);
}

.btn-block {
  width: 100%;
  margin-top: var(--spacing-md);
}

.auth-footer {
  text-align: center;
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-md);
  color: var(--text-muted);
}
</style>