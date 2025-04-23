<template>
    <div class="category-card">
      <router-link :to="`/products?category=${category.id}`" class="category-link">
        <div class="category-image">
          <img :src="categoryImage" :alt="category.name">
        </div>
        <div class="category-info">
          <h2 class="category-name">{{ category.name }}</h2>
          <p v-if="category.description" class="category-description">
            {{ truncatedDescription }}
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
  </template>
  
  <script>
  import { computed } from 'vue'
  
  export default {
    name: 'CategoryCard',
    props: {
      category: {
        type: Object,
        required: true
      },
      imageUrl: {
        type: String,
        default: null
      }
    },
    setup(props) {
      // Image par défaut si aucune n'est fournie
      const categoryImage = computed(() => {
        if (props.imageUrl) return props.imageUrl
        
        // Image par défaut basée sur l'id de la catégorie
        const defaultImages = [
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1518112166137-85f9979a43aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        ]
        
        const index = props.category.id % defaultImages.length
        return defaultImages[index]
      })
      
      // Tronquer la description si elle est trop longue
      const truncatedDescription = computed(() => {
        if (!props.category.description) return ''
        if (props.category.description.length <= 100) return props.category.description
        return props.category.description.substring(0, 100) + '...'
      })
      
      return {
        categoryImage,
        truncatedDescription
      }
    }
  }
  </script>
  
  <style scoped>
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
  </style>