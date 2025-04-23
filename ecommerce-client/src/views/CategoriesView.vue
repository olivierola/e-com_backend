<template>
    <div class="categories-view">
      <div class="page-header">
        <h1>Toutes nos catégories</h1>
        <p>Explorez notre sélection de produits par catégorie</p>
      </div>
      
      <div v-if="loading" class="loader-container">
        <Loader message="Chargement des catégories..." />
      </div>
      
      <div v-else-if="categories.length === 0" class="no-categories">
        <div class="no-categories-content">
          <i class="fas fa-tags"></i>
          <h2>Aucune catégorie disponible</h2>
          <p>Nos catégories seront bientôt disponibles. Consultez nos produits en attendant.</p>
          <router-link to="/products" class="btn btn-primary">
            Voir tous les produits
          </router-link>
        </div>
      </div>
      
      <div v-else class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="category-card"
        >
          <router-link :to="`/categories/${category.id}`" class="category-link">
            <div class="category-image">
              <img :src="getCategoryImage(category)" alt="category.name">
            </div>
            <div class="category-info">
              <h2 class="category-name">{{ category.name }}</h2>
              <p v-if="category.description" class="category-description">
                {{ truncateDescription(category.description) }}
              </p>
              <div class="category-count">
                {{ category.productCount || 0 }} produits
              </div>
            </div>
            <div class="view-button">
              <span class="btn btn-outline">Voir les produits</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useProductStore } from '@/store/product'
  import Loader from '@/components/common/Loader.vue'
  
  export default {
    name: 'CategoriesView',
    components: {
      Loader
    },
    setup() {
      const productStore = useProductStore()
      const categories = ref([])
      const loading = ref(true)
      
      // Fonction pour charger les catégories
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
      
      // Images par défaut pour les catégories (à remplacer par vos propres images)
      const categoryImages = {
        electronics: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        clothing: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        home: 'https://images.unsplash.com/photo-1518112166137-85f9979a43aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        books: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        food: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        furniture: 'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        default: 'https://images.unsplash.com/photo-1542559272--381f4348bfc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      }
      
      // Fonction pour obtenir l'image d'une catégorie
      const getCategoryImage = (category) => {
        // Si la catégorie a un slug ou un nom qui correspond à une de nos images
        const slug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (categoryImages[slug]) {
          return categoryImages[slug]
        }
        
        // Sinon, utiliser une image par défaut basée sur l'id
        const defaultImages = Object.values(categoryImages)
        const index = category.id % defaultImages.length
        return defaultImages[index] || categoryImages.default
      }
      
      // Fonction pour tronquer les descriptions longues
      const truncateDescription = (description, maxLength = 100) => {
        if (!description) return ''
        if (description.length <= maxLength) return description
        return description.substring(0, maxLength) + '...'
      }
      
      onMounted(() => {
        loadCategories()
      })
      
      return {
        categories,
        loading,
        getCategoryImage,
        truncateDescription
      }
    }
  }
  </script>
  
  <style scoped>
  .categories-view {
    padding-bottom: var(--spacing-xl);
  }
  
  .page-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }
  
  .page-header h1 {
    margin-bottom: var(--spacing-xs);
  }
  
  .page-header p {
    color: var(--text-muted);
  }
  
  .loader-container {
    display: flex;
    justify-content: center;
    padding: var(--spacing-xl) 0;
  }
  
  .no-categories {
    text-align: center;
    padding: var(--spacing-xl) 0;
  }
  
  .no-categories-content i {
    font-size: 3rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-md);
  }
  
  .no-categories-content h2 {
    margin-bottom: var(--spacing-sm);
  }
  
  .no-categories-content p {
    color: var(--text-muted);
    margin-bottom: var(--spacing-lg);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .category-card {
    background-color: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    height: 100%;
  }
  
  .category-card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-5px);
  }
  
  .category-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: var(--text-color);
    text-decoration: none;
  }
  
  .category-image {
    height: 200px;
    overflow: hidden;
  }
  
  .category-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .category-card:hover .category-image img {
    transform: scale(1.05);
  }
  
  .category-info {
    padding: var(--spacing-md);
    flex-grow: 1;
  }
  
  .category-name {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-xs);
  }
  
  .category-description {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
    line-height: 1.4;
  }
  
  .category-count {
    font-size: var(--font-size-sm);
    color: var(--primary-color);
    font-weight: bold;
  }
  
  .view-button {
    padding: 0 var(--spacing-md) var(--spacing-md);
    text-align: center;
  }
  
  .btn-outline {
    display: inline-block;
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: var(--border-radius);
    transition: var(--transition);
    text-align: center;
  }
  
  .category-card:hover .btn-outline {
    background-color: var(--primary-color);
    color: white;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .categories-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
  
  @media (max-width: 576px) {
    .categories-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>



<!-- <template>
    
    
    <div class="categories-grid">
      <CategoryCard 
        v-for="category in categories" 
        :key="category.id" 
        :category="category" 
      />
    </div>
    
    
  </template>
  
  <script>
  import CategoryCard from '@/components/category/CategoryCard.vue'
  // ... autres imports ...
  
  export default {
    name: 'CategoriesView',
    components: {
      CategoryCard,
      Loader
    },
    // ... reste du code ...
  }
  </script> -->