<template>
  <div>
    <div class="page-header">
      <h1>Nos produits</h1>
      <p v-if="pagination.totalProducts > 0">
        {{ pagination.totalProducts }} produit{{ pagination.totalProducts > 1 ? 's' : '' }} disponible{{ pagination.totalProducts > 1 ? 's' : '' }}
      </p>
    </div>
    
    <div class="product-listing">
      <aside class="filters-sidebar">
        <ProductFilter />
      </aside>
      
      <main class="products-main">
        <ProductList />
      </main>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/store/product'
import ProductFilter from '@/components/product/ProductFilter.vue'
import ProductList from '@/components/product/ProductList.vue'

export default {
  name: 'ProductListView',
  components: {
    ProductFilter,
    ProductList
  },
  setup() {
    const route = useRoute()
    const productStore = useProductStore()
    
    const pagination = computed(() => productStore.getPagination)
    
    // Initial load and handle route changes
    onMounted(() => {
      // Load categories if not already loaded
      if (productStore.getCategories.length === 0) {
        productStore.fetchCategories()
      }
      
      handleRouteChange()
    })
    
    // Watch for query changes to apply filters
    watch(() => route.query, () => {
      handleRouteChange()
    })
    
    const handleRouteChange = () => {
      const queryParams = route.query
      
      // Check if we have any filters
      const hasFilters = Object.keys(queryParams).length > 0
      
      if (hasFilters) {
        // Apply filters from URL
        const filters = {
          name: queryParams.name || '',
          category: queryParams.category || '',
          minPrice: queryParams.minPrice ? Number(queryParams.minPrice) : null,
          maxPrice: queryParams.maxPrice ? Number(queryParams.maxPrice) : null,
          minRating: queryParams.minRating ? Number(queryParams.minRating) : null,
          inStock: queryParams.inStock === 'true'
        }
        
        // Set filters in store
        productStore.setFilters(filters)
        
        // Search with filters
        productStore.searchProducts(Number(queryParams.page) || 1)
      } else {
        // Reset filters and load all products
        productStore.resetFilters()
        productStore.fetchProducts(Number(queryParams.page) || 1)
      }
    }
    
    return {
      pagination
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: var(--spacing-lg);
}

.page-header p {
  color: var(--text-muted);
}

.product-listing {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-lg);
}

@media (max-width: 992px) {
  .product-listing {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    margin-bottom: var(--spacing-lg);
  }
}
</style>