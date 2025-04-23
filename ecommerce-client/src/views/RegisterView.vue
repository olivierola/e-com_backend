<template>
  <div class="register-page">
    <div class="auth-container">
      <h1>Créer un compte</h1>
      
      <Alert
        v-if="error"
        :message="error"
        type="danger"
        :dismissible="true"
        @dismiss="error = ''"
      />
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="fullName" class="form-label">Nom complet</label>
          <input
            type="text"
            id="fullName"
            v-model="fullName"
            class="form-control"
            placeholder="Votre nom complet"
            required
          />
        </div>
        
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
            placeholder="Votre mot de passe (min. 6 caractères)"
            required
            minlength="6"
          />
        </div>
        
        <div class="form-group">
          <label for="passwordConfirm" class="form-label">Confirmer le mot de passe</label>
          <input
            type="password"
            id="passwordConfirm"
            v-model="passwordConfirm"
            class="form-control"
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>
        
        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Création en cours...' : 'Créer un compte' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Vous avez déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Alert from '@/components/common/Alert.vue'

export default {
  name: 'RegisterView',
  components: {
    Alert
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const fullName = ref('')
    const email = ref('')
    const password = ref('')
    const passwordConfirm = ref('')
    const error = ref('')
    
    const loading = computed(() => authStore.loading)
    
    const isFormValid = computed(() => {
      return (
        fullName.value.trim() !== '' && 
        email.value.trim() !== '' && 
        password.value.length >= 6 && 
        password.value === passwordConfirm.value
      )
    })
    
    const handleSubmit = async () => {
      error.value = ''
      
      if (!isFormValid.value) {
        if (password.value !== passwordConfirm.value) {
          error.value = 'Les mots de passe ne correspondent pas'
        } else if (password.value.length < 6) {
          error.value = 'Le mot de passe doit contenir au moins 6 caractères'
        }
        return
      }
      
      const success = await authStore.register({
        fullName: fullName.value,
        email: email.value,
        password: password.value
      })
      
      if (success) {
        router.push('/')
      } else {
        error.value = authStore.error
      }
    }
    
    return {
      fullName,
      email,
      password,
      passwordConfirm,
      error,
      loading,
      isFormValid,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg) 0;
}

.auth-container {
  width: 100%;
  max-width: 500px;
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