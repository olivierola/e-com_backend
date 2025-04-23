<template>
  <div class="order-summary">
    <h2>Résumé de la commande</h2>
    <div v-if="order">
      <h3>Commande #{{ order.id }}</h3>
      <p>Date: {{ order.date }}</p>
      <p>Statut: {{ order.status }}</p>
      <h4>Détails des articles</h4>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.name }} - {{ item.quantity }} x {{ item.price | currency }}
        </li>
      </ul>
      <h4>Total: {{ order.total | currency }}</h4>
    </div>
    <div v-else>
      <p>Aucune commande trouvée.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }
  }
}
</script>

<style scoped>
.order-summary {
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-light);
}
</style>
