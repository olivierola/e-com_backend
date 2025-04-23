<template>
    <div class="category-navigation">
      <h3>Catégories</h3>
      
      <div v-if="loading" class="loading-categories">
        <div class="spinner-sm"></div> Chargement...
      </div>
      
      <ul v-else class="category-list">
        <li v-for="category in categories" :key="category.id">
          <router-link :to="`/categories/${category.id}`" class="category-link">
            {{ category.name }}
            <span class="product-count" v-if="category.productCount">
              ({{ category.productCount }})
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useProductStore } from '@/store/product'
  
  export default {
    name: 'CategoryNavigation',
    setup() {
      const productStore = useProductStore()
      const loading = ref(true)
      
      const categories = ref([])
      
      const loadCategories = async () => {
        loading.value = true
        try {
          await productStore.fetchCategories()
          categories.value = productStore.getCategories
        } catch (error) {
          console.error('Error loading categories:', error)
        } finally {
          loading.value = false
        }
      }
      
      onMounted(() => {
        loadCategories()
      })
      
      return {
        categories,
        loading
      }
    }
  }
  </script>
  
  <style scoped>
  .category-navigation {
    margin-bottom: var(--spacing-lg);
  }
  
  .category-navigation h3 {
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-lg);
  }
  
  .loading-categories {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }
  
  .spinner-sm {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  .category-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .category-list li {
    margin-bottom: var(--spacing-xs);
  }
  
  .category-link {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
    color: var(--text-color);
    text-decoration: none;
    transition: var(--transition);
  }
  
  .category-link:hover {
    color: var(--primary-color);
  }
  
  .product-count {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>