<template>
  <div class="checkout-view">
    <div class="page-header">
      <h1>Finaliser la commande</h1>
    </div>
    
    <Alert
      v-if="error"
      :message="error"
      type="danger"
      :dismissible="true"
      @dismiss="error = ''"
    />
    
    <Alert
      v-if="success"
      :message="success"
      type="success"
      :dismissible="true"
      @dismiss="success = ''"
    />
    
    <div v-if="loading">
      <Loader message="Chargement..." />
    </div>
    
    <div v-else-if="cartItems.length === 0 && !orderCreated" class="empty-checkout">
      <h2>Votre panier est vide</h2>
      <p>Vous devez ajouter des produits à votre panier avant de passer une commande.</p>
      <router-link to="/products" class="btn btn-primary">
        Parcourir les produits
      </router-link>
    </div>
    
    <div v-else-if="orderCreated" class="order-success">
      <div class="success-icon">✓</div>
      <h2>Commande effectuée avec succès!</h2>
      <p>Votre commande #{{ orderNumber }} a été enregistrée.</p>
      <p>Vous recevrez un e-mail de confirmation avec les détails de votre commande.</p>
      <div class="order-actions">
        <router-link :to="`/orders/${orderNumber}`" class="btn btn-primary">
          Voir les détails de ma commande
        </router-link>
        <router-link to="/products" class="btn btn-outline">
          Continuer mes achats
        </router-link>
      </div>
    </div>
    
    <div v-else class="checkout-content">
      <div class="checkout-form-container">
        <h2>Adresse de livraison</h2>
        
        <form @submit.prevent="placeOrder" class="checkout-form">
          <div class="form-group">
            <label for="fullName" class="form-label">Nom complet</label>
            <input
              type="text"
              id="fullName"
              v-model="deliveryAddress.fullName"
              class="form-control"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="address" class="form-label">Adresse</label>
            <input
              type="text"
              id="address"
              v-model="deliveryAddress.address"
              class="form-control"
              required
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="postalCode" class="form-label">Code postal</label>
              <input
                type="text"
                id="postalCode"
                v-model="deliveryAddress.postalCode"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="city" class="form-label">Ville</label>
              <input
                type="text"
                id="city"
                v-model="deliveryAddress.city"
                class="form-control"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="country" class="form-label">Pays</label>
            <input
              type="text"
              id="country"
              v-model="deliveryAddress.country"
              class="form-control"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Téléphone</label>
            <input
              type="tel"
              id="phone"
              v-model="deliveryAddress.phone"
              class="form-control"
              required
            />
          </div>
          
          <h2 class="payment-title">Mode de paiement</h2>
          
          <div class="payment-methods">
            <div class="payment-method">
              <input
                type="radio"
                id="payment-card"
                name="payment"
                value="card"
                v-model="paymentMethod"
                checked
              />
              <label for="payment-card">Carte bancaire</label>
            </div>
            
            <div class="payment-method">
              <input
                type="radio"
                id="payment-paypal"
                name="payment"
                value="paypal"
                v-model="paymentMethod"
              />
              <label for="payment-paypal">PayPal</label>
            </div>
          </div>
          
          <div v-if="paymentMethod === 'card'" class="card-details">
            <div class="form-group">
              <label for="cardNumber" class="form-label">Numéro de carte</label>
              <input
                type="text"
                id="cardNumber"
                v-model="cardDetails.number"
                class="form-control"
                placeholder="XXXX XXXX XXXX XXXX"
                required
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="expiration" class="form-label">Date d'expiration</label>
                <input
                  type="text"
                  id="expiration"
                  v-model="cardDetails.expiration"
                  class="form-control"
                  placeholder="MM/AA"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="cvv" class="form-label">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  v-model="cardDetails.cvv"
                  class="form-control"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            class="btn btn-success btn-lg checkout-btn"
            :disabled="checkoutLoading"
          >
            {{ checkoutLoading ? 'Traitement en cours...' : 'Confirmer la commande' }}
          </button>
        </form>
      </div>
      
      <div class="checkout-summary">
        <h2>Récapitulatif de la commande</h2>
        
        <div class="order-items">
          <div v-for="item in cartItems" :key="item.id" class="order-item">
            <div class="item-image">
              <img :src="getItemImage(item)" :alt="item.title" />
            </div>
            <div class="item-details">
              <h4 class="item-title">{{ item.title }}</h4>
              <div class="item-meta">
                <span class="item-quantity">Qté: {{ item.quantity }}</span>
                <span class="item-price">{{ formatPrice(item.subtotal) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="order-summary">
          <div class="summary-row">
            <span>Sous-total</span>
            <span>{{ formatPrice(cartSummary.totalPrice) }}</span>
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import orderService from '@/services/order.service'
import Alert from '@/components/common/Alert.vue'
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'CheckoutView',
  components: {
    Alert,
    Loader
  },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    
    const loading = ref(true)
    const checkoutLoading = ref(false)
    const error = ref('')
    const success = ref('')
    const orderCreated = ref(false)
    const orderNumber = ref(null)
    
    const deliveryAddress = ref({
      fullName: '',
      address: '',
      postalCode: '',
      city: '',
      country: 'France',
      phone: ''
    })
    
    const paymentMethod = ref('card')
    const cardDetails = ref({
      number: '',
      expiration: '',
      cvv: ''
    })
    
    const cartItems = computed(() => cartStore.getCartItems)
    const cartSummary = computed(() => cartStore.getCartSummary)
    
    const shipping = computed(() => {
      // Free shipping for orders over 50€
      return cartSummary.value.totalPrice >= 50 ? 0 : 5.99
    })
    
    const total = computed(() => {
      return cartSummary.value.totalPrice + shipping.value
    })
    
    onMounted(async () => {
      try {
        await cartStore.fetchCart()
      } finally {
        loading.value = false
      }
    })
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    const getItemImage = (item) => {
      if (item.images && item.images.length > 0) {
        return item.images[0]
      }
      return 'https://via.placeholder.com/50x50?text=No+Image'
    }
    
    const formatAddressForAPI = () => {
      const { fullName, address, postalCode, city, country, phone } = deliveryAddress.value
      return `${fullName}\n${address}\n${postalCode} ${city}\n${country}\nTel: ${phone}`
    }
    
    const placeOrder = async () => {
      if (cartItems.value.length === 0) return
      
      checkoutLoading.value = true
      error.value = ''
      success.value = ''
      
      try {
        // Format address for API
        const formattedAddress = formatAddressForAPI()
        
        // Create order via API
        const response = await orderService.createOrder(formattedAddress)
        
        // Order created successfully
        orderCreated.value = true
        orderNumber.value = response.data.order.id
        success.value = 'Commande créée avec succès'
        
        // Reset cart after successful order
        cartStore.resetCart()
      } catch (err) {
        error.value = err.response?.data?.error || 'Une erreur est survenue lors de la création de la commande'
      } finally {
        checkoutLoading.value = false
      }
    }
    
    return {
      loading,
      checkoutLoading,
      error,
      success,
      orderCreated,
      orderNumber,
      deliveryAddress,
      paymentMethod,
      cardDetails,
      cartItems,
      cartSummary,
      shipping,
      total,
      formatPrice,
      getItemImage,
      placeOrder
    }
  }
}
</script>

<style scoped>
.checkout-view {
  min-height: 60vh;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.empty-checkout, .order-success {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: var(--success-color);
  color: white;
  font-size: 40px;
  border-radius: 50%;
  margin: 0 auto var(--spacing-md);
}

.order-actions {
  margin-top: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--spacing-xl);
}

.checkout-form-container, .checkout-summary {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
}

.checkout-form-container h2, .checkout-summary h2 {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.payment-title {
  margin-top: var(--spacing-lg);
}

.payment-methods {
  margin-bottom: var(--spacing-md);
}

.payment-method {
  margin-bottom: var(--spacing-sm);
}

.card-details {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-light);
}

.checkout-btn {
  width: 100%;
  margin-top: var(--spacing-lg);
}

.order-items {
  margin-bottom: var(--spacing-lg);
  max-height: 300px;
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

.order-item {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.item-image {
  width: 50px;
  height: 50px;
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
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.order-summary {
  margin-top: var(--spacing-lg);
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

@media (max-width: 992px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .checkout-summary {
    order: -1;
    margin-bottom: var(--spacing-lg);
  }
}
</style>