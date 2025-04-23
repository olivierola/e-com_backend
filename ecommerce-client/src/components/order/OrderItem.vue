<template>
  <div class="order-item">
    <div class="order-header">
      <div class="order-id">
        <h3>Commande #{{ order.id }}</h3>
        <span class="order-date">{{ formatDate(order.createdAt) }}</span>
      </div>
      
      <div class="order-status">
        <span class="status-badge" :class="statusClass">
          {{ formatStatus(order.status) }}
        </span>
      </div>
    </div>
    
    <div class="order-info">
      <div class="order-summary">
        <p><strong>Nombre d'articles :</strong> {{ order.itemCount }}</p>
        <p><strong>Total :</strong> {{ formatPrice(order.totalAmount) }}</p>
      </div>
      
      <div class="order-actions">
        <router-link :to="`/orders/${order.id}`" class="btn btn-primary">
          Détails
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'OrderItem',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const statusClass = computed(() => {
      const statusMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'picked_up': 'status-picked-up',
        'in_transit': 'status-in-transit',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
      }
      return statusMap[props.order.status] || 'status-pending'
    })
    
    const formatStatus = (status) => {
      const statusLabels = {
        'pending': 'En attente',
        'processing': 'En préparation',
        'picked_up': 'Récupérée',
        'in_transit': 'En transit',
        'delivered': 'Livrée',
        'cancelled': 'Annulée'
      }
      return statusLabels[status] || 'Inconnu'
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    return {
      statusClass,
      formatStatus,
      formatDate,
      formatPrice
    }
  }
}
</script>

<style scoped>
.order-item {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  background-color: white;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.order-id h3 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.order-date {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.status-badge {
  display: inline-block;
  padding: 0.25em 0.6em;
  font-size: var(--font-size-sm);
  font-weight: bold;
  border-radius: 50px;
}

.status-pending {
  background-color: #f8f9fa;
  color: #6c757d;
}

.status-processing {
  background-color: #fff3cd;
  color: #856404;
}

.status-picked-up, .status-in-transit {
  background-color: #cce5ff;
  color: #004085;
}

.status-delivered {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
}

.order-summary p {
  margin: 0.25em 0;
}

@media (max-width: 768px) {
  .order-header, .order-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-status {
    margin-top: var(--spacing-xs);
  }
  
  .order-actions {
    margin-top: var(--spacing-sm);
    width: 100%;
  }
  
  .order-actions .btn {
    width: 100%;
  }
}
</style>