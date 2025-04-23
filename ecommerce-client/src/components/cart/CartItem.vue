<template>
  <div class="cart-item">
    <div class="item-image">
      <img :src="productImage" :alt="item.title" />
    </div>
    
    <div class="item-details">
      <h3 class="item-title">
        <router-link :to="`/products/${item.productId}`">
          {{ item.title }}
        </router-link>
      </h3>
      
      <div class="item-price">
        <span v-if="item.discount > 0" class="price-discount">
          {{ formatPrice(item.originalPrice) }}
        </span>
        <span class="price">{{ formatPrice(item.discountedPrice) }}</span>
      </div>
      
      <div class="stock-info" v-if="item.stock < 10">
        <span v-if="item.stock === 0" class="out-of-stock">
          Rupture de stock
        </span>
        <span v-else class="low-stock">
          Plus que {{ item.stock }} en stock
        </span>
      </div>
    </div>
    
    <div class="item-quantity">
      <div class="quantity-control">
        <button
          class="quantity-btn"
          @click="decrementQuantity"
          :disabled="loading || item.quantity <= 1"
        >
          -
        </button>
        <input
          type="text"
          class="quantity-input"
          :value="item.quantity"
          readonly
        />
        <button
          class="quantity-btn"
          @click="incrementQuantity"
          :disabled="loading || item.quantity >= item.stock"
        >
          +
        </button>
      </div>
    </div>
    
    <div class="item-subtotal">
      {{ formatPrice(item.subtotal) }}
    </div>
    
    <div class="item-actions">
      <button
        @click="removeItem"
        class="btn btn-danger btn-sm"
        :disabled="loading"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useCartStore } from '@/store/cart'

export default {
  name: 'CartItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const cartStore = useCartStore()
    const loading = ref(false)
    
    const productImage = computed(() => {
      if (props.item.images && props.item.images.length > 0) {
        return props.item.images[0]
      }
      return 'https://via.placeholder.com/100x100?text=No+Image'
    })
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    const incrementQuantity = async () => {
      if (props.item.quantity >= props.item.stock) return
      
      loading.value = true
      try {
        await cartStore.updateCartItem(props.item.productId, props.item.quantity + 1)
      } finally {
        loading.value = false
      }
    }
    
    const decrementQuantity = async () => {
      if (props.item.quantity <= 1) return
      
      loading.value = true
      try {
        await cartStore.updateCartItem(props.item.productId, props.item.quantity - 1)
      } finally {
        loading.value = false
      }
    }
    
    const removeItem = async () => {
      loading.value = true
      try {
        await cartStore.removeFromCart(props.item.productId)
      } finally {
        loading.value = false
      }
    }
    
    return {
      loading,
      productImage,
      formatPrice,
      incrementQuantity,
      decrementQuantity,
      removeItem
    }
  }
}
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 100px 3fr 1fr 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
}

.item-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-title {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size);
}

.item-title a {
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
}

.item-title a:hover {
  color: var(--primary-color);
}

.item-price {
  margin-bottom: var(--spacing-xs);
}

.stock-info {
  font-size: var(--font-size-sm);
}

.out-of-stock {
  color: var(--danger-color);
  font-weight: bold;
}

.low-stock {
  color: var(--warning-color);
}

.item-quantity {
  text-align: center;
}

.item-subtotal {
  font-weight: bold;
  text-align: right;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "image details"
      "image price"
      "quantity subtotal"
      "actions actions";
    gap: var(--spacing-sm);
  }
  
  .item-image {
    grid-area: image;
    width: 80px;
    height: 80px;
  }
  
  .item-details {
    grid-area: details;
  }
  
  .item-price {
    grid-area: price;
  }
  
  .item-quantity {
    grid-area: quantity;
    justify-self: start;
    margin-top: var(--spacing-sm);
  }
  
  .item-subtotal {
    grid-area: subtotal;
    justify-self: end;
    margin-top: var(--spacing-sm);
  }
  
  .item-actions {
    grid-area: actions;
    width: 100%;
    margin-top: var(--spacing-sm);
  }
  
  .item-actions button {
    width: 100%;
  }
}
</style>