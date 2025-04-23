<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>Découvrez nos produits</h1>
        <p>Trouvez les meilleurs articles aux meilleurs prix</p>
        <router-link to="/products" class="btn btn-primary btn-lg">Explorer</router-link>
      </div>
    </section>
    
    <section class="categories-section">

      <div class="section-header">
        <h2>Nos catégories</h2>
        <router-link to="/categories" class="view-all">Voir tout</router-link>
      </div>
      
      
      <div v-if="loading" class="text-center">
        <Loader message="Chargement des catégories..." />
      </div>
      
      <div v-else class="categories-grid">
        <div
          v-for="category in categories.slice(0, 6)"
          :key="category.id"
          class="category-card"
        >
          <router-link :to="`/categories/${category.id}`">
            <h3>{{ category.name }}</h3>
            <p v-if="category.productCount">{{ category.productCount }} produits</p>
          </router-link>
          
        </div>
      </div>
    </section>
    
    <section class="featured-section">
      <div class="section-header">
        <h2>Produits populaires</h2>
        <router-link to="/products" class="view-all">Voir tout</router-link>
      </div>
      
      <div v-if="loading" class="text-center">
        <Loader message="Chargement des produits..." />
      </div>
      
      <div v-else class="product-grid">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
    
    <section class="promo-section">
      <div class="promo-card">
        <h3>Livraison gratuite</h3>
        <p>Pour toutes les commandes de plus de 50€</p>
      </div>
      
      <div class="promo-card">
        <h3>Support client 24/7</h3>
        <p>Assistance clientèle à votre service</p>
      </div>
      
      <div class="promo-card">
        <h3>Garantie satisfaction</h3>
        <p>Retours gratuits sous 30 jours</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/store/product'
import ProductCard from '@/components/product/ProductCard.vue'
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'HomeView',
  components: {
    ProductCard,
    Loader
  },
  setup() {
    const productStore = useProductStore()
    const loading = ref(true)
    
    const categories = computed(() => productStore.getCategories)
    const products = computed(() => productStore.getProducts)
    
    // Pick the first 4 products as featured ones
    const featuredProducts = computed(() => products.value.slice(0, 4))
    
    onMounted(async () => {
      try {
        // Load categories and products
        await Promise.all([
          productStore.fetchCategories(),
          productStore.fetchProducts(1, 8)
        ])
      } finally {
        loading.value = false
      }
    })
    
    return {
      categories,
      featuredProducts,
      loading
    }
  }
}
</script>

<style scoped>
.hero {
  height: 500px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  margin-bottom: var(--spacing-xl);
}

.hero-content {
  max-width: 600px;
  padding: var(--spacing-lg);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.hero p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.view-all {
  color: var(--primary-color);
  font-weight: bold;
}

.categories-section,
.featured-section {
  margin-bottom: var(--spacing-xl);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.category-card {
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  transition: var(--transition);
  text-align: center;
}

.category-card:hover {
  background-color: var(--primary-color);
  transform: translateY(-5px);
}

.category-card:hover h3,
.category-card:hover p {
  color: white;
}

.category-card a {
  text-decoration: none;
  color: inherit;
}

.category-card h3 {
  margin-bottom: var(--spacing-xs);
  transition: var(--transition);
}

.category-card p {
  color: var(--text-muted);
  margin: 0;
  font-size: var(--font-size-sm);
  transition: var(--transition);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.promo-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.promo-card {
  background-color: var(--bg-light);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  text-align: center;
  transition: var(--transition);
}

.promo-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.promo-card h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--primary-color);
}

.promo-card p {
  margin: 0;
  color: var(--text-muted);
}

@media (max-width: 992px) {
  .promo-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    height: 400px;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .promo-section {
    grid-template-columns: 1fr;
  }
}
</style>