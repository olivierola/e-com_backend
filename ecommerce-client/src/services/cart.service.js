import api from './api'


export default {
  getCart() {
    return api.get('/cart')
  },
  
  addToCart(productId, quantity = 1) {
    console.log('Cart service: adding product', { productId, quantity });
    return api.post('/cart', { productId, quantity })
  },
  
  updateCartItem(productId, quantity) {
    return api.put(`/cart/${productId}`, { quantity })
  },
  
  removeFromCart(productId) {
    return api.delete(`/cart/${productId}`)
  }
}