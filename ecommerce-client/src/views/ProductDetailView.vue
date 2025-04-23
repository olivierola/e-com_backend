<template>
  <div class="product-detail">
    <div v-if="loading">
      <Loader message="Chargement du produit..." :overlay="true" />
    </div>
    
    <div v-else-if="!product" class="not-found">
      <h2>Produit non trouvé</h2>
      <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
      <router-link to="/products" class="btn btn-primary">
        Retourner aux produits
      </router-link>
    </div>
    
    <template v-else>
      <div class="product-header">
        <nav class="breadcrumb">
          <router-link to="/">Accueil</router-link> &gt;
          <router-link to="/products">Produits</router-link> &gt;
          <span>{{ product.title }}</span>
        </nav>
      </div>
      
      <div class="product-main">
        <div class="product-gallery-container">
          <ProductGallery
            :images="product.images || []"
            :alt="product.title"
          />
        </div>
        
        <div class="product-info">
          <h1 class="product-title">{{ product.title }}</h1>
          
          <div class="product-meta">
            <div class="product-rating">
              <StarRating
                :value="product.averageRating"
                :count="product.ratingCount"
                :show-value="true"
              />
            </div>
            
            <div v-if="product.categoryName" class="product-category">
              Catégorie:
              <router-link :to="`/products?category=${product.categoryId}`">
                {{ product.categoryName }}
              </router-link>
            </div>
          </div>
          
          <div class="product-price-container">
            <div v-if="product.discount > 0" class="discount-tag">
              -{{ product.discount }}%
            </div>
            
            <div class="product-price">
              <span v-if="product.discount > 0" class="price-discount">
                {{ formatPrice(product.price) }}
              </span>
              <span class="price">{{ formatPrice(discountedPrice) }}</span>
            </div>
          </div>
          
          <div class="stock-status" :class="{ 'out-of-stock': product.stock <= 0 }">
            <span v-if="product.stock > 0">
              <span class="in-stock-icon">✓</span> En stock
              <span v-if="product.stock < 10" class="stock-warning">
                (Plus que {{ product.stock }} disponibles)
              </span>
            </span>
            <span v-else>
              <span class="out-of-stock-icon">✗</span> Rupture de stock
            </span>
          </div>
          
          <div class="product-description">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>
          
          <div v-if="product.characteristics && product.characteristics.length > 0" class="product-characteristics">
            <h3>Caractéristiques</h3>
            <ul>
              <li v-for="(char, index) in product.characteristics" :key="index">
                <strong>{{ char.name }}:</strong> {{ char.value }}
              </li>
            </ul>
          </div>
          
          <div class="add-to-cart">
            <div class="quantity-control">
              <button
                class="quantity-btn"
                @click="decrementQuantity"
                :disabled="quantity <= 1"
              >
                -
              </button>
              <input
                type="number"
                v-model.number="quantity"
                min="1"
                :max="product.stock"
                class="quantity-input"
              />
              <button
                class="quantity-btn"
                @click="incrementQuantity"
                :disabled="quantity >= product.stock"
              >
                +
              </button>
            </div>
            
            <button
              @click="addToCart"
              class="btn btn-primary add-cart-btn"
              :disabled="addToCartLoading || product.stock <= 0"
            >
              <span v-if="addToCartLoading">Ajout en cours...</span>
              <span v-else-if="product.stock <= 0">Indisponible</span>
              <span v-else>Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>
      
      <ProductReviews
        :product="product"
        :loading="loading"
        @review-submitted="fetchProduct"
      />
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/store/cart'
import productService from '@/services/product.service'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductReviews from '@/components/product/ProductReviews.vue'
import StarRating from '@/components/common/StarRating.vue'
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'ProductDetailView',
  components: {
    ProductGallery,
    ProductReviews,
    StarRating,
    Loader
  },
  setup() {
    const route = useRoute()
    const cartStore = useCartStore()
    
    const product = ref(null)
    const loading = ref(true)
    const quantity = ref(1)
    const addToCartLoading = ref(false)
    
    const discountedPrice = computed(() => {
      if (!product.value) return 0
      if (product.value.discount > 0) {
        return product.value.price * (1 - product.value.discount / 100)
      }
      return product.value.price
    })
    
    const fetchProduct = async () => {
      loading.value = true
      try {
        const response = await productService.getProductById(route.params.id)
        product.value = response.data.product
        console.log('Product fetched:', product.value)
      } catch (error) {
        console.error('Error fetching product:', error)
        product.value = null
      } finally {
        loading.value = false
      }
    }
    
    // Format price to currency format
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    const incrementQuantity = () => {
      if (product.value && quantity.value < product.value.stock) {
        quantity.value++
      }
    }
    
    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }
    
    const addToCart = async () => {
      if (!product.value || product.value.stock <= 0) return
      
      addToCartLoading.value = true
      try {
        await cartStore.addToCart(product.value.id, quantity.value)
        quantity.value = 1 // Reset quantity after adding to cart
      } finally {
        addToCartLoading.value = false
      }
    }
    
    onMounted(() => {
      fetchProduct()
    })
    
    // Watch for route changes (different product)
    watch(() => route.params.id, () => {
      fetchProduct()
    })
    
    return {
      product,
      loading,
      quantity,
      addToCartLoading,
      discountedPrice,
      formatPrice,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      fetchProduct
    }
  }
}
</script>

<style scoped>
.product-detail {
  position: relative;
}

.not-found {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.breadcrumb {
  margin-bottom: var(--spacing-lg);
  color: var(--text-muted);
}

.breadcrumb a {
  color: var(--text-muted);
  transition: var(--transition);
}

.breadcrumb a:hover {
  color: var(--primary-color);
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.product-title {
  margin-bottom: var(--spacing-md);
}

.product-meta {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.product-rating {
  margin-right: var(--spacing-lg);
}

.product-category {
  color: var(--text-muted);
}

.product-price-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.discount-tag {
  background-color: var(--danger-color);
  color: white;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  font-weight: bold;
  margin-right: var(--spacing-md);
}

.stock-status {
  margin-bottom: var(--spacing-lg);
  font-weight: bold;
  color: var(--success-color);
}

.stock-status.out-of-stock {
  color: var(--danger-color);
}

.in-stock-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: var(--success-color);
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  margin-right: 5px;
}

.out-of-stock-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: var(--danger-color);
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  margin-right: 5px;
}

.stock-warning {
  color: var(--warning-color);
  font-weight: normal;
  margin-left: 5px;
}

.product-description {
  margin-bottom: var(--spacing-lg);
}

.product-description h3,
.product-characteristics h3 {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-lg);
}

.product-characteristics ul {
  padding-left: var(--spacing-lg);
}

.product-characteristics li {
  margin-bottom: var(--spacing-xs);
}

.add-to-cart {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.add-cart-btn {
  flex: 1;
}

@media (max-width: 992px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>