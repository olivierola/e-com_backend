<template>
  <div class="cart-summary">
    <h3>Récapitulatif</h3>
    
    <div class="summary-details">
      <div class="summary-row">
        <span>Sous-total ({{ summary.totalQuantity }} article{{ summary.totalQuantity > 1 ? 's' : '' }})</span>
        <span>{{ formatPrice(summary.totalPrice) }}</span>
      </div>
      
      <div class="summary-row">
        <span>Livraison</span>
        <span>{{ shipping > 0 ? formatPrice(shipping) : 'Gratuite' }}</span>
      </div>
      
      <div class="summary-row total">
        <span>Total</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>
    
    <button
      @click="$emit('checkout')"
      class="btn btn-success btn-lg checkout-btn"
      :disabled="summary.totalItems === 0"
    >
      Procéder au paiement
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'CartSummary',
  props: {
    summary: {
      type: Object,
      required: true
    }
  },
  emits: ['checkout'],
  setup(props) {
    const shipping = computed(() => {
      // Free shipping for orders over 50€
      return props.summary.totalPrice >= 50 ? 0 : 5.99
    })
    
    const total = computed(() => {
      return props.summary.totalPrice + shipping.value
    })
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    return {
      shipping,
      total,
      formatPrice
    }
  }
}
</script>

<style scoped>
.cart-summary {
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

.summary-details {
  margin: var(--spacing-md) 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.summary-row.total {
  font-weight: bold;
  font-size: var(--font-size-lg);
  border-bottom: none;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 2px solid var(--border-color);
}

.checkout-btn {
  width: 100%;
  margin-top: var(--spacing-md);
}
</style>