<template>
  <div class="orders-view">
    <div class="page-header">
      <h1>Mes commandes</h1>
    </div>
    
    <div v-if="loading">
      <Loader message="Chargement des commandes..." />
    </div>
    
    <div v-else-if="orders.length === 0" class="no-orders">
      <h2>Aucune commande</h2>
      <p>Vous n'avez pas encore passé de commande.</p>
      <router-link to="/products" class="btn btn-primary">
        Explorer les produits
      </router-link>
    </div>
    
    <div v-else class="orders-list">
      <OrderItem
        v-for="order in orders"
        :key="order.id"
        :order="order"
      />
      
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderService from '@/services/order.service'
import OrderItem from '@/components/order/OrderItem.vue'
import Pagination from '@/components/common/Pagination.vue'
import Loader from '@/components/common/Loader.vue'

export default {
  name: 'OrderListView',
  components: {
    OrderItem,
    Pagination,
    Loader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const orders = ref([])
    const loading = ref(true)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalOrders = ref(0)
    
    onMounted(() => {
      // Get page from route query or default to 1
      currentPage.value = parseInt(route.query.page) || 1
      fetchOrders(currentPage.value)
    })
    
    const fetchOrders = async (page) => {
      loading.value = true
      try {
        const response = await orderService.getOrders(page)
        orders.value = response.data.orders
        totalPages.value = response.data.pagination.totalPages
        totalOrders.value = response.data.pagination.totalOrders
        currentPage.value = response.data.pagination.currentPage
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        loading.value = false
      }
    }
    
    const changePage = (page) => {
      router.push({ query: { page } })
      fetchOrders(page)
      window.scrollTo(0, 0)
    }
    
    return {
      orders,
      loading,
      currentPage,
      totalPages,
      totalOrders,
      changePage
    }
  }
}
</script>

<style scoped>
.orders-view {
  min-height: 50vh;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.no-orders {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.orders-list {
  margin-bottom: var(--spacing-xl);
}
</style>