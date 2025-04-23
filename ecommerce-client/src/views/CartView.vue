<template>
  <div class="cart-view">
    <div class="page-header">
      <h1>Mon panier</h1>
    </div>
    
    <Alert
      v-if="cartStore.error"
      :message="cartStore.error"
      type="danger"
      :dismissible="true"
      @dismiss="cartStore.error = null"
    />
    
    <div v-if="loading">
      <Loader message="Chargement du panier..." />
    </div>
    
    <div v-else-if="cartItems.length === 0" class="empty-cart">
      <h2>Votre panier est vide</h2>
      <p>Ajoutez des produits à votre panier pour les voir ici.</p>
      <router-link to="/products" class="btn btn-primary">
        Continuer mes achats
      </router-link>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-list">
        <div class="cart-header">
          <div class="cart-header-item product-col">Produit</div>
          <div class="cart-header-item">Quantité</div>
          <div class="cart-header-item">Prix</div>
          <div class="cart-header-item">Actions</div>
        </div>
        
        <CartItem
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
        />
      </div>
      
      <div class="cart-sidebar">
        <CartSummary
          :summary="cartSummary"
          @checkout="goToCheckout"
        />
        
        <div class="cart-actions">
          <router-link to="/products" class="btn btn-outline">
            Continuer mes achats
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import Alert from '@/components/common/Alert.vue'
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'CartView',
  components: {
    CartItem,
    CartSummary,
    Alert,
    Loader
  },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    
    const cartItems = computed(() => cartStore.getCartItems)
    const cartSummary = computed(() => cartStore.getCartSummary)
    const loading = computed(() => cartStore.loading)
    
    onMounted(() => {
      cartStore.fetchCart()
    })
    
    const goToCheckout = () => {
      router.push('/checkout')
    }
    
    return {
      cartStore,
      cartItems,
      cartSummary,
      loading,
      goToCheckout
    }
  }
}
</script>

<style scoped>
.cart-view {
  min-height: 50vh;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.empty-cart {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-lg);
}

.cart-header {
  display: grid;
  grid-template-columns: 100px 3fr 1fr 1fr auto;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-color);
  font-weight: bold;
}

.product-col {
  grid-column: span 2;
}

.cart-actions {
  margin-top: var(--spacing-md);
  text-align: center;
}

@media (max-width: 992px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-header {
    display: none;
  }
}
</style>