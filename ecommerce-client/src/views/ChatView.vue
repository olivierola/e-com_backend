<template>
  <div class="chat-view">
    <div class="page-header">
      <h1>Assistant IA</h1>
      <p>Posez-moi des questions pour trouver les produits qui vous conviennent</p>
    </div>
    
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div class="message system">
          <div class="message-content">
            <p>Bonjour ! Je suis votre assistant shopping. Comment puis-je vous aider aujourd'hui ?</p>
            <p>Exemples de questions :</p>
            <ul>
              <li>Je cherche des vêtements pour l'été</li>
              <li>Quels sont les meilleurs produits électroniques ?</li>
              <li>Pouvez-vous me recommander des produits pour la cuisine ?</li>
            </ul>
          </div>
        </div>
        
        <template v-for="(message, index) in messages" :key="index">
          <div class="message" :class="message.sender">
            <div class="message-content">
              <p v-if="message.text">{{ message.text }}</p>
              
              <div v-if="message.recommendations && message.recommendations.length > 0" class="recommendations">
                <p v-if="message.message">{{ message.message }}</p>
                
                <div class="product-recommendations">
                  <div
                    v-for="product in message.recommendations"
                    :key="product.productId"
                    class="recommendation-card"
                  >
                    <div class="recommendation-image">
                      <img
                        :src="getProductImage(product)"
                        :alt="product.title"
                      />
                    </div>
                    <div class="recommendation-details">
                      <h4>{{ product.title }}</h4>
                      <p class="recommendation-reason">{{ product.reason }}</p>
                      <p class="recommendation-price" v-if="product.price">
                        {{ formatPrice(product.price) }}
                      </p>
                      <div class="recommendation-actions">
                        <router-link
                          :to="`/products/${product.productId}`"
                          class="btn btn-sm btn-outline"
                        >
                          Voir le produit
                        </router-link>
                        
                        <button
                          v-if="product.stock > 0"
                          @click="addToCart(product.productId)"
                          class="btn btn-sm btn-primary"
                          :disabled="addingToCart[product.productId]"
                        >
                          {{ addingToCart[product.productId] ? '...' : 'Ajouter' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <div v-if="loading" class="message bot">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <textarea
          v-model="newMessage"
          @keydown.enter.prevent="sendMessage"
          placeholder="Posez votre question ici..."
          :disabled="loading"
          ref="messageInput"
        ></textarea>
        <button
          @click="sendMessage"
          class="btn btn-primary send-btn"
          :disabled="loading || !newMessage.trim()"
        >
          <span v-if="loading">Traitement...</span>
          <span v-else>Envoyer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, reactive } from 'vue'
import { useCartStore } from '@/store/cart'
import chatService from '@/services/chat.service'

export default {
  name: 'ChatView',
  setup() {
    const cartStore = useCartStore()
    const messagesContainer = ref(null)
    const messageInput = ref(null)
    
    const messages = ref([])
    const newMessage = ref('')
    const loading = ref(false)
    const addingToCart = reactive({})
    
    onMounted(() => {
      messageInput.value.focus()
    })
    
    const scrollToBottom = async () => {
      await nextTick()
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }
    
    const sendMessage = async () => {
      if (loading.value || !newMessage.value.trim()) return
      
      const userMessage = newMessage.value.trim()
      messages.value.push({ sender: 'user', text: userMessage })
      newMessage.value = ''
      
      scrollToBottom()
      loading.value = true
      
      try {
        const response = await chatService.sendMessage(userMessage)
        
        const botMessage = {
          sender: 'bot',
          ...response.data
        }
        
        messages.value.push(botMessage)
        scrollToBottom()
      } catch (error) {
        console.error('Error sending message:', error)
        messages.value.push({
          sender: 'bot',
          text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer."
        })
        scrollToBottom()
      } finally {
        loading.value = false
        messageInput.value.focus()
      }
    }
    
    const getProductImage = (product) => {
      if (product.images && product.images.length > 0) {
        return product.images[0]
      }
      return 'https://via.placeholder.com/150?text=No+Image'
    }
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    }
    
    const addToCart = async (productId) => {
      addingToCart[productId] = true
      try {
        await cartStore.addToCart(productId, 1)
      } finally {
        addingToCart[productId] = false
      }
    }
    
    return {
      messages,
      newMessage,
      loading,
      addingToCart,
      messagesContainer,
      messageInput,
      sendMessage,
      getProductImage,
      formatPrice,
      addToCart
    }
  }
}
</script>

<style scoped>
.chat-view {
  min-height: 70vh;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: white;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.message {
  display: flex;
  margin-bottom: var(--spacing-md);
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 70%;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
}

.message.system .message-content {
  background-color: var(--bg-light);
  margin-bottom: var(--spacing-md);
  width: 100%;
  max-width: 100%;
}

.message.user .message-content {
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius) 0 var(--border-radius) var(--border-radius);
}

.message.bot .message-content {
  background-color: var(--bg-light);
  border-radius: 0 var(--border-radius) var(--border-radius) var(--border-radius);
}

.message-content p {
  margin: 0 0 var(--spacing-sm);
}

.message-content p:last-child {
  margin-bottom: 0;
}

.message.system .message-content ul {
  margin: var(--spacing-sm) 0 0;
  padding-left: var(--spacing-lg);
}

.message.system .message-content li {
  margin-bottom: var(--spacing-xs);
}

.chat-input {
  display: flex;
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-light);
}

.chat-input textarea {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  resize: none;
  height: 60px;
  font-family: var(--font-family);
  font-size: var(--font-size);
}

.chat-input textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-btn {
  margin-left: var(--spacing-md);
  align-self: flex-end;
}

.typing-indicator {
  display: flex;
  align-items: center;
  column-gap: 6px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.typing-indicator span {
  display: block;
  width: 8px;
  height: 8px;
  background-color: var(--text-muted);
  border-radius: 50%;
  animation: typing 1.5s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.3s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.recommendations {
  margin-top: var(--spacing-md);
}

.product-recommendations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.recommendation-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: white;
  transition: var(--transition);
}

.recommendation-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-3px);
}

.recommendation-image {
  height: 150px;
  overflow: hidden;
}

.recommendation-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommendation-details {
  padding: var(--spacing-sm);
}

.recommendation-details h4 {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size);
}

.recommendation-reason {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.recommendation-price {
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.recommendation-actions {
  display: flex;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }
  
  .product-recommendations {
    grid-template-columns: 1fr;
  }
}
</style>
