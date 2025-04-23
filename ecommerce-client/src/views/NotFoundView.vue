<template>
    <div class="not-found">
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <router-link to="/" class="btn btn-primary">Retour à l'accueil</router-link>
    </div>
</template>
  
<script>
  export default {
    name: 'NotFoundView'
  }
</script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: var(--spacing-xl) 0;
  }
  
  .not-found h1 {
    font-size: 6rem;
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
  }
  
  .not-found h2 {
    margin-bottom: var(--spacing-md);
  }
  
  .not-found p {
    margin-bottom: var(--spacing-lg);
    color: var(--text-muted);
  }
  </style>