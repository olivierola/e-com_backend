<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>E-Shop</h3>
          <p>Votre boutique en ligne de confiance pour tous vos besoins shopping.</p>
        </div>
        
        <div class="footer-section">
          <h3>Liens utiles</h3>
          <ul>
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/products">Produits</router-link></li>
            <li><router-link to="/account">Mon compte</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Catégories</h3>
          <ul>
            <li v-for="category in categories.slice(0, 5)" :key="category.id">
              <router-link :to="`/products?category=${category.id}`">
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Contact</h3>
          <p>Email: contact@eshop.com</p>
          <p>Téléphone: +33 1 23 45 67 89</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} E-Shop. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/store/product'

export default {
  name: 'TheFooter',
  setup() {
    const productStore = useProductStore()
    const categories = computed(() => productStore.getCategories)
    const currentYear = computed(() => new Date().getFullYear())
    
    onMounted(() => {
      if (categories.value.length === 0) {
        productStore.fetchCategories()
      }
    })
    
    return {
      categories,
      currentYear
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: var(--bg-dark);
  color: white;
  padding: var(--spacing-xl) 0 var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.footer-section h3 {
  margin-bottom: var(--spacing-md);
  color: white;
  font-size: var(--font-size-lg);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: var(--spacing-sm);
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition);
}

.footer-section a:hover {
  color: white;
  text-decoration: underline;
}

.footer-bottom {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>