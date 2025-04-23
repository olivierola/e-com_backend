import api from './api'

export default {
  createOrder(deliveryAddress) {
    return api.post('/orders', { deliveryAddress })
  },
  
  getOrders(page = 1, limit = 10) {
    return api.get(`/orders?page=${page}&limit=${limit}`)
  },
  
  getOrderById(orderId) {
    return api.get(`/orders/${orderId}`)
  }
}