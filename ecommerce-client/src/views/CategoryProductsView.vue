<template>
    <div class="category-products-view">
      <div class="category-header" v-if="category">
        <h1>{{ category.name }}</h1>
        <p v-if="category.description">{{ category.description }}</p>
        
        <div class="category-stats">
          <span class="products-count">{{ pagination.totalProducts || 0 }} produits</span>
        </div>
      </div>
  
      <div v-if="loading && !products.length" class="loader-container">
        <Loader message="Chargement des produits..." />
      </div>
      
      <div v-else-if="products.length === 0" class="no-products">
        <div class="no-products-content">
          <i class="fas fa-box-open"></i>
          <h2>Aucun produit dans cette catégorie</h2>
          <p>Découvrez d'autres catégories ou revenez plus tard.</p>
          <router-link to="/products" class="btn btn-primary">Voir tous les produits</router-link>
        </div>
      </div>
      
      <div v-else class="category-content">
        <div class="products-main">
          <div class="sort-options">
            <label for="sort">Trier par:</label>
            <select id="sort" v-model="sortOption" @change="sortProducts">
              <option value="popularity">Popularité</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="rating">Note des clients</option>
              <option value="newest">Nouveautés</option>
            </select>
          </div>
          
          <div class="product-grid">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
          
          <div v-if="loading" class="loading-more">
            <Loader message="Chargement..." />
          </div>
          
          <Pagination
            v-if="pagination.totalPages > 1"
            :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages"
            @page-change="changePage"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductStore } from '@/store/product'
  import ProductCard from '@/components/product/ProductCard.vue'
  import Pagination from '@/components/common/Pagination.vue'
  import Loader from '@/components/common/Loader.vue'
  
  export default {
    name: 'CategoryProductsView',
    components: {
      ProductCard,
      Pagination,
      Loader
    },
    setup() {
      const route = useRoute()
      const router = useRouter()
      const productStore = useProductStore()
      
      const loading = computed(() => productStore.isLoading)
      const sortOption = ref('popularity')
      const categoryId = computed(() => route.params.id)
      const category = ref(null)
  
      const products = computed(() => productStore.getProducts)
      const pagination = computed(() => productStore.getPagination)
      
      const fetchCategoryProducts = async (page = 1) => {
        if (!categoryId.value) return;
        
        try {
          // Appeler directement la méthode pour récupérer les produits par catégorie
          await productStore.fetchProductsByCategory(categoryId.value, page);
        } catch (error) {
          console.error('Error fetching category products:', error);
        }
      }
      
      const fetchCategoryDetails = async () => {
        if (!categoryId.value) return;
        
        try {
          // Récupérer les catégories si ce n'est pas déjà fait
          if (productStore.getCategories.length === 0) {
            await productStore.fetchCategories();
          }
          
          // Trouver la catégorie actuelle
          const found = productStore.getCategories.find(
            cat => cat.id.toString() === categoryId.value.toString()
          );
          
          if (found) {
            category.value = found;
          } else {
            console.error('Category not found:', categoryId.value);
          }
        } catch (error) {
          console.error('Error fetching category details:', error);
        }
      }
      
      const changePage = (page) => {
        router.push({
          name: 'CategoryProducts',
          params: { id: categoryId.value },
          query: { page }
        });
      }
      
      const sortProducts = () => {
        // La logique de tri peut être implémentée ici si nécessaire
        // Pour l'instant, nous allons simplement récupérer les produits à nouveau
        fetchCategoryProducts(pagination.value.currentPage);
      }
      
      onMounted(async () => {
        await fetchCategoryDetails();
        
        // Récupérer la page depuis l'URL ou par défaut à 1
        const page = route.query.page ? parseInt(route.query.page) : 1;
        await fetchCategoryProducts(page);
      });
      
      // Observer les changements de route pour recharger les produits
      watch(() => route.params.id, async (newId, oldId) => {
        if (newId !== oldId) {
          await fetchCategoryDetails();
          await fetchCategoryProducts(1);
        }
      });
      
      watch(() => route.query.page, async (newPage) => {
        if (newPage) {
          await fetchCategoryProducts(parseInt(newPage));
        }
      });
      
      return {
        categoryId,
        category,
        products,
        pagination,
        loading,
        sortOption,
        changePage,
        sortProducts
      }
    }
  }
  </script>
  
  <style scoped>
  .category-products-view {
    padding-bottom: var(--spacing-xl);
  }
  
  .category-header {
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
  }
  
  .category-header h1 {
    margin-bottom: var(--spacing-xs);
  }
  
  .category-header p {
    color: var(--text-muted);
    margin-bottom: var(--spacing-sm);
  }
  
  .category-stats {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
  }
  
  .loader-container {
    display: flex;
    justify-content: center;
    padding: var(--spacing-xl) 0;
  }
  
  .no-products {
    text-align: center;
    padding: var(--spacing-xl) 0;
  }
  
  .no-products-content i {
    font-size: 3rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-md);
  }
  
  .no-products-content h2 {
    margin-bottom: var(--spacing-sm);
  }
  
  .no-products-content p {
    color: var(--text-muted);
    margin-bottom: var(--spacing-lg);
  }
  
  .category-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .sort-options {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }
  
  .sort-options label {
    margin-right: var(--spacing-sm);
    font-weight: 500;
  }
  
  .sort-options select {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: white;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
  
  .loading-more {
    display: flex;
    justify-content: center;
    padding: var(--spacing-md) 0;
  }
  </style>