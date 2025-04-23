<template>
  <div class="order-detail-view">
    <div v-if="loading">
      <Loader message="Chargement de la commande..." />
    </div>
    
    <div v-else-if="!order" class="not-found">
      <h2>Commande non trouvée</h2>
      <p>La commande que vous recherchez n'existe pas ou n'est pas accessible.</p>
      <router-link to="/orders" class="btn btn-primary">
        Retour à mes commandes
      </router-link>
    </div>
    
    <template v-else>
      <div class="page-header">
        <div class="header-top">
          <h1>Commande #{{ order.id }}</h1>
          <span class="status-badge" :class="statusClass">
            {{ formatStatus(order.status) }}
          </span>
        </div>
        <p class="order-date">
          Passée le {{ formatDate(order.createdAt) }}
        </p>
      </div>
      
      <div class="order-content">
        <div class="order-info">
          <div class="info-section delivery-info">
            <h3>Adresse de livraison</h3>
            <p class="address">{{ formatAddress(order.deliveryAddress) }}</p>
          </div>
          
          <div class="info-section payment-info">
            <h3>Détails du paiement</h3>
            <p><strong>Méthode :</strong> Carte bancaire</p>
            <p><strong>Statut :</strong> Payé</p>
          </div>
          
          <div v-if="order.deliveryPerson" class="info-section delivery-person">
            <h3>Livreur</h3>
            <p>{{ order.deliveryPerson }}</p>
          </div>
          
          <div v-if="order.status === 'delivered'" class="delivery-confirmation">
            <div class="confirmation-icon">✓</div>
            <div class="confirmation-text">
              <h3>Commande livrée</h3>
              <p>Votre commande a été livrée le {{ formatDate(order.updatedAt) }}</p>
            </div>
          </div>
        </div>
        
        <div class="order-summary">
          <h3>Résumé de la commande</h3>
          
          <div class="item-list">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-image">
                <img :src="getItemImage(item)" :alt="item.title" />
              </div>
              <div class="item-details">
                <h4 class="item-title">{{ item.title }}</h4>
                <div class="item-meta">
                  <p class="item-quantity">Quantité: {{ item.quantity }}</p>
                  <p class="item-price">{{ formatPrice(item.price) }} x {{ item.quantity }}</p>
                </div>
              </div>
              <div class="item-subtotal">
                {{ formatPrice(item.subtotal) }}
              </div>
            </div>
          </div>
          
          <div class="price-summary">
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ formatPrice(order.totalAmount) }}</span>
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
        </div>
      </div>
      
      <div class="order-actions">
        <router-link to="/orders" class="btn btn-outline">
          Retour à mes commandes
        </router-link>
        
        <button v-if="showSupportButton" class="btn btn-primary" @click="contactSupport">
          Contacter le support
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import orderService from '@/services/order.service'
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'OrderDetailView',
  components: {
    Loader
  },
  setup() {
    const route = useRoute()
    const orderId = route.params.id
    
    const order = ref(null)
    const loading = ref(true)
    
    // For demo purposes, hardcoded shipping cost
    const shipping = ref(5.99)
    
    const statusClass = computed(() => {
      if (!order.value) return ''
      
      const statusMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'picked_up': 'status-picked-up',
        'in_transit': 'status-in-transit',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
      }
      return statusMap[order.value.status] || 'status-pending'
    })
    
    const total = computed(() => {
      if (!order.value) return 0
      // Normally shipping would be included in totalAmount from API
      return order.value.totalAmount
    })
    
    // Show support button except for completed orders
    const showSupportButton = computed(() => {
      if (!order.value) return false
      return order.value.status !== 'delivered' && order.value.status !== 'cancelled'
    })
    
    const fetchOrder = async () => {
      loading.value = true
      try {
        const response = await orderService.getOrderById(orderId)
        order.value = response.data.order
      } catch (error) {
        console.error('Error fetching order:', error)
        order.value = null
      } finally {
        loading.value = false
      }
    }
    
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    const formatAddress = (address) => {
      if (!address) return ''
      return address.replace(/\n/g, '<br>')
    }
    
    const getItemImage = (item) => {
      if (item.images && item.images.length > 0) {
        return item.images[0]
      }
      return 'https://via.placeholder.com/80x80?text=No+Image'
    }
    
    const contactSupport = () => {
      // This would normally open a support chat or form
      alert(`Pour toute assistance concernant votre commande #${orderId}, veuillez nous contacter au 01 23 45 67 89 ou par email à support@eshop.com`)
    }
    
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      order,
      loading,
      shipping,
      statusClass,
      total,
      showSupportButton,
      formatStatus,
      formatDate,
      formatPrice,
      formatAddress,
      getItemImage,
      contactSupport
    }
  }
}
</script>

<style scoped>
.order-detail-view {
  min-height: 60vh;
}

.not-found {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.header-top {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.order-date {
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
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

.order-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.order-info, .order-summary {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

.info-section {
  margin-bottom: var(--spacing-lg);
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h3 {
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
}

.address {
  white-space: pre-line;
}

.delivery-confirmation {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: #d4edda;
  border-radius: var(--border-radius);
  margin-top: var(--spacing-lg);
}

.confirmation-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #155724;
  color: white;
  font-size: 20px;
  border-radius: 50%;
}

.confirmation-text h3 {
  margin: 0 0 var(--spacing-xs);
  border: none;
  padding: 0;
  color: #155724;
}

.confirmation-text p {
  margin: 0;
  color: #155724;
}

.order-summary h3 {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
}

.item-list {
  margin-bottom: var(--spacing-lg);
}

.order-item {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-title {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size);
}

.item-meta {
  color: var(--text-muted);
}

.item-meta p {
  margin: var(--spacing-xs) 0;
}

.item-subtotal {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.price-summary {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.summary-row.total {
  font-weight: bold;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color);
  font-size: var(--font-size-lg);
}

.order-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-lg);
}

@media (max-width: 992px) {
  .order-content {
    grid-template-columns: 1fr;
  }
  
  .order-info {
    order: 1;
  }
}
</style>