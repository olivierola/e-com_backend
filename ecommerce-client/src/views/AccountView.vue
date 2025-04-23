<template>
  <div class="account-view">
    <h1>Mon Compte</h1>
    <div v-if="user">
      <h2>Détails de l'utilisateur</h2>
      <p><strong>Nom:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <button @click="logout">Se déconnecter</button>
    </div>
    <div v-else>
      <p>Veuillez vous connecter pour voir vos détails de compte.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';

export default {
  name: 'AccountView',
  setup() {
    const authStore = useAuthStore();
    const user = ref(null);

    onMounted(async () => {
      user.value = authStore.getUser;
    });

    const logout = () => {
      authStore.logout();
    };

    return {
      user,
      logout
    };
  }
}
</script>

<style scoped>
.account-view {
  padding: var(--spacing-lg);
}

h1 {
  margin-bottom: var(--spacing-md);
}

button {
  margin-top: var(--spacing-md);
}
</style>