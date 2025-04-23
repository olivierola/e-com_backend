<template>
  <div class="product-filter">
    <h3>Filtres</h3>
    
    <div class="filter-section">
      <h4>Recherche</h4>
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="Rechercher..."
          v-model="filters.name"
        />
      </div>
    </div>
    
    <div class="filter-section">
      <h4>Catégories</h4>
      <div class="form-group">
        <select v-model="filters.category" class="form-control">
          <option value="">Toutes les catégories</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>Prix</h4>
      <div class="price-range">
        <div class="form-group">
          <input
            type="number"
            class="form-control"
            placeholder="Min"
            v-model.number="filters.minPrice"
            min="0"
          />
        </div>
        <span>à</span>
        <div class="form-group">
          <input
            type="number"
            class="form-control"
            placeholder="Max"
            v-model.number="filters.maxPrice"
            min="0"
          />
        </div>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>Note minimale</h4>
      <div class="form-group">
        <StarRating
          :value="filters.minRating || 0"
          editable
          @update:value="updateRating"
        />
      </div>
    </div>
    
    <div class="filter-section">
      <div class="form-group">
        <label class="checkbox-container">
          <input type="checkbox" v-model="filters.inStock" />
          <span class="checkmark"></span>
          Produits en stock uniquement
        </label>
      </div>
    </div>
    
    <div class="filter-actions">
      <button @click="applyFilters" class="btn btn-primary">
        Appliquer les filtres
      </button>
      <button @click="resetFilters" class="btn btn-secondary">
        Réinitialiser
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/store/product'
import StarRating from '@/components/common/StarRating.vue'

export default {
  name: 'ProductFilter',
  components: {
    StarRating
  },
  props: {
    selectedCategory: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const productStore = useProductStore()
    
    const filters = ref({
      name: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: false
    })
    
    const categories = computed(() => productStore.getCategories)
    
    // Initialize filters from URL query params
    onMounted(() => {
      if (categories.value.length === 0) {
        productStore.fetchCategories()
      }
      
      // Set initial filters from URL
      const { name, category, minPrice, maxPrice, minRating, inStock } = route.query
      filters.value = {
        name: name || '',
        category: category || '',
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        minRating: minRating ? Number(minRating) : null,
        inStock: inStock === 'true'
      }
      console.log('Initial filters:', filters.value)
    })
    
    
    // Watch for route query changes
    watch(() => route.query, (newQuery) => {
      const { name, category, minPrice, maxPrice, minRating, inStock } = newQuery
      
      // Only update if coming from elsewhere (not from this component's applyFilters)
      if (route.name === 'ProductList') {
        filters.value = {
          name: name || '',
          category: category || '',
          minPrice: minPrice ? Number(minPrice) : null,
          maxPrice: maxPrice ? Number(maxPrice) : null,
          minRating: minRating ? Number(minRating) : null,
          inStock: inStock === 'true'
        }
      }
    }, { deep: true })
    
    const updateRating = (value) => {
      filters.value.minRating = value
    }
    
    const applyFilters = () => {
      // Build query params
      const query = {}
      
      if (filters.value.name) query.name = filters.value.name
      if (filters.value.category) query.category = filters.value.category
      if (filters.value.minPrice) query.minPrice = filters.value.minPrice
      if (filters.value.maxPrice) query.maxPrice = filters.value.maxPrice
      if (filters.value.minRating) query.minRating = filters.value.minRating
      if (filters.value.inStock) query.inStock = filters.value.inStock
      
      // Update URL
      router.push({ path: '/products', query })
      
      // Update store filters
      productStore.setFilters(filters.value)
      
      // Search products
      productStore.searchProducts()
    }
    
    const resetFilters = () => {
      filters.value = {
        name: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        minRating: null,
        inStock: false
      }
      
      // Update URL - remove all query params
      router.push({ path: '/products' })
      
      // Reset store filters
      productStore.resetFilters()
      
      // Fetch all products
      productStore.fetchProducts()
    }
    
    return {
      filters,
      categories,
      updateRating,
      applyFilters,
      resetFilters
    }
  }
}
</script>

<style scoped>
.product-filter {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

.filter-section {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.filter-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.filter-section h4 {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size);
}

.price-range {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.price-range .form-group {
  flex: 1;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--primary-color);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.filter-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}
</style>