import { defineStore } from 'pinia'
import productService from '@/services/product.service'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
    categories: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      limit: 10
    },
    filters: {
      name: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStock: false
    }
  }),
  
  getters: {
    getProducts: (state) => state.products,
    getProduct: (state) => state.product,
    getCategories: (state) => state.categories,
    getPagination: (state) => state.pagination,
    getFilters: (state) => state.filters,
    isLoading: (state) => state.loading
  },
  
  actions: {
    async fetchProducts(page = 1, limit = 10) {
      this.loading = true
      
      try {
        const response = await productService.getProducts(page, limit)
        this.products = response.data.products
        this.pagination = response.data.pagination
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors du chargement des produits'
      } finally {
        this.loading = false
      }
    },

    async fetchProductsByCategory(categoryId, page = 1) {
      this.loading = true;
      
      try {
        const response = await productService.getProductsByCategory(categoryId, page, this.pagination.limit);
        this.products = response.data.products;
        this.pagination = response.data.pagination;
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors du chargement des produits par catégorie';
        console.error('Error fetching products by category:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCategories() {
      try {
        const response = await productService.getCategories()
        this.categories = response.data.categories
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors du chargement des catégories'
      }
    },
    
    async searchProducts(page = 1) {
      this.loading = true
      
      try {
        const params = {
          ...this.filters,
          page,
          limit: this.pagination.limit
        }
        
        // Remove null or empty string values
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '') {
            delete params[key]
          }
        })
        
        const response = await productService.searchProducts(params)
        this.products = response.data.products
        this.pagination = response.data.pagination
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de la recherche des produits'
      } finally {
        this.loading = false
      }
    },
    
    async fetchProductById(id) {
      this.loading = true
      this.product = null
      
      try {
        const response = await productService.getProductById(id)
        this.product = response.data.product
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors du chargement du produit'
      } finally {
        this.loading = false
      }
    },
    
    async rateProduct(productId, rating) {
      try {
        await productService.rateProduct(productId, rating)
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de la notation du produit'
        return false
      }
    },
    
    async commentProduct(productId, comment) {
      try {
        await productService.commentProduct(productId, comment)
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de l\'ajout du commentaire'
        return false
      }
    },
    
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    
    resetFilters() {
      this.filters = {
        name: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        minRating: null,
        inStock: false
      }
    }
  }
})