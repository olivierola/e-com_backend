<template>
  <div>
    <div v-if="loading">
      <Loader message="Chargement des produits..." />
    </div>
    
    <div v-else-if="products.length === 0" class="no-products">
      <h3>Aucun produit trouvé</h3>
      <p>Essayez de modifier vos filtres ou effectuez une autre recherche.</p>
    </div>
    
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
    
    <Pagination
      v-if="products.length > 0"
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      @page-change="changePage"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useProductStore } from '@/store/product'
import ProductCard from '@/components/product/ProductCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'ProductList',
  components: {
    ProductCard,
    Pagination,
    Loader
  },
  setup() {
    const productStore = useProductStore()
    
    const products = computed(() => productStore.getProducts)
    const pagination = computed(() => productStore.getPagination)
    const loading = computed(() => productStore.isLoading)
    
    const changePage = (page) => {
      // Check if we're filtering or just browsing
      const isFiltering = Object.values(productStore.getFilters).some(value => {
        return value !== '' && value !== null && value !== false
      })
      
      if (isFiltering) {
        productStore.searchProducts(page)
      } else {
        productStore.fetchProducts(page)
      }
      
      // Scroll to top
      window.scrollTo(0, 0)
    }
    
    return {
      products,
      pagination,
      loading,
      changePage
    }
  }
}
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.no-products {
  text-align: center;
  padding: var(--spacing-xl) 0;
}
</style>