import { defineStore } from 'pinia'
import cartService from '@/services/cart.service'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    loading: false,
    error: null,
    summary: {
      totalItems: 0,
      totalQuantity: 0,
      totalPrice: 0
    }
  }),
  
  getters: {
    getCartItems: (state) => state.cartItems,
    getCartSummary: (state) => state.summary,
    getItemCount: (state) => state.summary.totalQuantity,
    getCartTotal: (state) => state.summary.totalPrice
  },
  
  actions: {
    async fetchCart() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Fetching cart...');
        const response = await cartService.getCart();
        console.log('Cart response:', response.data.cartItems);
        this.rawSummary = response.data.summary;
        this.cartItems = response.data.cartItems.map(item => ({
          ...item,
          price: Number(item.price),
          discount: Number(item.discount),
          quantity: Number(item.quantity),
          discountedPrice: Number(item.discountedPrice),
          subtotal: Number(item.subtotal),
          originalPrice: Number(item.originalPrice),
        }));
        
        this.summary = {
          totalItems: this.cartItems.length,
          totalQuantity: this.cartItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: this.cartItems.reduce((sum, item) => sum + item.subtotal, 0)
        };
        

      } catch (error) {
        console.error('Error fetching cart:', error);
        this.error = error.response?.data?.error || 'Une erreur est survenue lors du chargement du panier';
      } finally {
        this.loading = false;
      }
    },
    
    async addToCart(productId, quantity = 1) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Adding product ${productId} to cart, quantity: ${quantity}`);
        await cartService.addToCart(productId, quantity);
        await this.fetchCart(); // Refresh cart
        return true;
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de l\'ajout au panier';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async updateCartItem(productId, quantity) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Updating cart item ${productId}, quantity: ${quantity}`);
        await cartService.updateCartItem(productId, quantity);
        await this.fetchCart(); // Refresh cart
        return true;
      } catch (error) {
        console.error('Error updating cart:', error);
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de la mise à jour du panier';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async removeFromCart(productId) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Removing product ${productId} from cart`);
        await cartService.removeFromCart(productId);
        await this.fetchCart(); // Refresh cart
        return true;
      } catch (error) {
        console.error('Error removing from cart:', error);
        this.error = error.response?.data?.error || 'Une erreur est survenue lors de la suppression du panier';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    resetCart() {
      this.cartItems = [];
      this.summary = {
        totalItems: 0,
        totalQuantity: 0,
        totalPrice: 0
      };
    }
  }
});