import api from './api'

export default {
  getProducts(page = 1, limit = 10) {
    return api.get(`/products?page=${page}&limit=${limit}`)
  },
  
  getCategories() {
    return api.get('/products/categories')
  },
  
  searchProducts(params) {
    return api.get('/products/search', { params })
  },
  
  getProductById(id) {
    return api.get(`/products/${id}`)
  },
  
  rateProduct(productId, rating) {
    return api.post(`/products/${productId}/rate`, { rating })
  },
  
  commentProduct(productId, comment) {
    return api.post(`/products/${productId}/comment`, { comment })
  },

  getProductsByCategory(categoryId, params = {}) {
    
    return api.get(`/products/category/${categoryId}`, { 
      params: {
        ...params,
        category: categoryId
      }
    });
  }
}