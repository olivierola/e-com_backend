<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">E-Shop</router-link>
        </div>
        
        <div class="search-bar">
          <input
            type="text"
            placeholder="Rechercher des produits..."
            v-model="searchQuery"
            @keyup.enter="search"
          />
          <button @click="search" class="search-btn">
            <span class="search-icon">&#128269;</span>
          </button>
        </div>
        
        <nav class="nav-menu">
          <ul>
            <li>
              <router-link to="/products">Produits</router-link>
            </li>
            <li>
              <router-link to="/categories">Catégories</router-link>
            </li>
            <li v-if="isAuthenticated">
              <router-link to="/chat">IA Assistant</router-link>
            </li>
            <li v-if="isAuthenticated" class="cart-icon">
              <router-link to="/cart">
                <span>&#128722;</span>
                <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
              </router-link>
            </li>
            <li v-if="isAuthenticated" class="dropdown">
              <button class="dropdown-toggle">
                {{ user?.fullName || 'Mon compte' }}
              </button>
              <div class="dropdown-menu">
                <router-link to="/account">Mon profil</router-link>
                <router-link to="/orders">Mes commandes</router-link>
                <button @click="logout" class="dropdown-item">Déconnexion</button>
              </div>
            </li>
            <li v-else>
              <router-link to="/login" class="btn btn-primary btn-sm">Connexion</router-link>
            </li>
          </ul>
        </nav>
        
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
        <ul>
          <li>
            <router-link to="/products" @click="closeMobileMenu">Produits</router-link>
          </li>
          <li class="dropdown">
            <button class="dropdown-toggle">
              Catégories
            </button>
            <div class="dropdown-menu">
              <router-link 
                v-for="category in categories" 
                :key="category.id" 
                :to="`/categories/${category.id}`"
                class="dropdown-item"
              >
                {{ category.name }}
              </router-link>
            </div>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/chat" @click="closeMobileMenu">IA Assistant</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/cart" @click="closeMobileMenu">
              Panier ({{ cartCount }})
            </router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/account" @click="closeMobileMenu">Mon profil</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/orders" @click="closeMobileMenu">Mes commandes</router-link>
          </li>
          <li v-if="isAuthenticated">
            <button @click="logout" class="mobile-logout-btn">Déconnexion</button>
          </li>
          <li v-else>
            <router-link to="/login" @click="closeMobileMenu" class="btn btn-primary">Connexion</router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

export default {
  name: 'TheHeader',
  setup() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    const router = useRouter()
    
    const searchQuery = ref('')
    const mobileMenuOpen = ref(false)
    
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.getUser)
    const cartCount = computed(() => cartStore.getItemCount)
    
    const search = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: '/products',
          query: { name: searchQuery.value }
        })
        searchQuery.value = ''
        closeMobileMenu()
      }
    }
    
    const logout = () => {
      authStore.logout()
      cartStore.resetCart()
      router.push('/login')
      closeMobileMenu()
    }
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }
    
    return {
      isAuthenticated,
      user,
      cartCount,
      searchQuery,
      mobileMenuOpen,
      search,
      logout,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>

<style scoped>
.header {
  background-color: white;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 500px;
  margin: 0 var(--spacing-lg);
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size);
}

.search-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: none;
  border: none;
  padding: 0 var(--spacing-md);
  cursor: pointer;
}

.search-icon {
  font-size: 1.2rem;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  margin-left: var(--spacing-md);
}

.nav-menu a {
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
}

.nav-menu a:hover {
  color: var(--primary-color);
}

.cart-icon {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: var(--font-size);
  color: var(--text-color);
}

.dropdown-toggle:after {
  content: '▼';
  font-size: 0.6em;
  margin-left: var(--spacing-xs);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: var(--shadow);
  border-radius: var(--border-radius);
  min-width: 160px;
  z-index: 1000;
  display: none;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a, 
.dropdown-item {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size);
}

.dropdown-menu a:hover, 
.dropdown-item:hover {
  background-color: var(--bg-light);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  flex-direction: column;
}

.mobile-menu-btn span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--text-color);
  margin: 3px 0;
  transition: var(--transition);
}

.mobile-menu {
  display: none;
}

@media (max-width: 992px) {
  .header-content {
    flex-wrap: wrap;
  }
  
  .search-bar {
    order: 3;
    max-width: 100%;
    margin: var(--spacing-md) 0 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
    height: 0;
    overflow: hidden;
    transition: var(--transition);
  }
  
  .mobile-menu.active {
    height: auto;
    padding-bottom: var(--spacing-md);
  }
  
  .mobile-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .mobile-menu li {
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border-color);
  }
  
  .mobile-menu a {
    display: block;
    color: var(--text-color);
    text-decoration: none;
    padding: var(--spacing-xs) 0;
  }
  
  .mobile-logout-btn {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: var(--danger-color);
    padding: var(--spacing-xs) 0;
    cursor: pointer;
    font-size: var(--font-size);
  }
}
</style>