<template>
  <div class="product-card">
    <div v-if="product.discount > 0" class="discount-badge">
      -{{ product.discount }}%
    </div>
    
    <router-link :to="`/products/${product.id}`" class="product-img-container">
      <img
        :src="productImage"
        :alt="product.title"
        class="product-img"
      />
    </router-link>
    
    <div class="product-body">
      <h3 class="product-title">
        <router-link :to="`/products/${product.id}`">
          {{ product.title }}
        </router-link>
      </h3>
      
      <div class="product-category" v-if="product.categoryName">
        {{ product.categoryName }}
      </div>
      
      <div class="product-rating">
        <StarRating :value="product.averageRating" :count="product.ratingCount" />
      </div>
      
      <div class="product-price">
        <span v-if="product.discount > 0" class="price-discount">
          {{ formatPrice(product.price) }}
        </span>
        <span class="price">
          {{ formatPrice(discountedPrice) }}
        </span>
      </div>
      
      <div class="product-actions">
        <button
          @click="addToCart"
          class="btn btn-primary"
          :disabled="loading || product.stock <= 0"
        >
          <span v-if="loading">...</span>
          <span v-else>{{ product.stock > 0 ? 'Ajouter au panier' : 'Indisponible' }}</span>
        </button>
        
        <router-link :to="`/products/${product.id}`" class="btn btn-outline">
          Détails
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import StarRating from '@/components/common/StarRating.vue'

export default {
  name: 'ProductCard',
  components: {
    StarRating
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const router = useRouter()
    const loading = ref(false)
    
    const productImage = computed(() => {
      if (props.product.images && props.product.images.length > 0) {
        return Array.isArray(props.product.images) 
          ? props.product.images[0] 
          : typeof props.product.images === 'string' 
            ? props.product.images 
            : 'https://via.placeholder.com/300x300?text=No+Image'
      }
      return 'https://via.placeholder.com/300x300?text=No+Image'
    })
    
    const discountedPrice = computed(() => {
      if (props.product.discount > 0) {
        return props.product.price * (1 - props.product.discount / 100)
      }
      return props.product.price
    })
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    const addToCart = async () => {
      if (props.product.stock <= 0) return
      
      // Vérifier si l'utilisateur est connecté
      if (!authStore.isAuthenticated) {
        router.push('/login?redirect=' + router.currentRoute.value.fullPath)
        return
      }
      
      loading.value = true
      try {
        console.log('ProductCard: Adding to cart, product:', props.product.id);
        const success = await cartStore.addToCart(props.product.id, 1)
        if (success) {
          console.log('Product added to cart successfully');
          // Optionally show a success notification
        } else {
          console.error('Failed to add product to cart');
          // Handle errors if needed
        }
      } catch (error) {
        console.error('Error in addToCart:', error);
      } finally {
        loading.value = false
      }
    }
    
    return {
      loading,
      productImage,
      discountedPrice,
      formatPrice,
      addToCart
    }
  }
}
</script>


<style scoped>
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: var(--transition);
  background-color: white;
}

.product-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-5px);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--danger-color);
  color: white;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  font-weight: bold;
  font-size: 14px;
  z-index: 1;
}

.product-img-container {
  display: block;
  padding-top: 75%;
  position: relative;
  overflow: hidden;
}

.product-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-body {
  padding: var(--spacing-md);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size);
}

.product-title a {
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
}

.product-title a:hover {
  color: var(--primary-color);
}

.product-category {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.product-rating {
  margin-bottom: var(--spacing-sm);
}

.product-price {
  margin-bottom: var(--spacing-md);
  font-weight: bold;
}

.product-actions {
  margin-top: auto;
  display: flex;
  gap: var(--spacing-sm);
}

.product-actions .btn {
  flex: 1;
}
</style>

