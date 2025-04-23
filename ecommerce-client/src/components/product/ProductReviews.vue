<template>
  <div class="product-reviews">
    <h3>Avis clients ({{ product.ratingCount || 0 }})</h3>
    
    <div v-if="isAuthenticated" class="review-form">
      <h4>Écrire un avis</h4>
      
      <div class="form-group">
        <label>Note</label>
        <StarRating
          :value="newReview.rating"
          editable
          @update:value="updateRating"
        />
      </div>
      
      <div class="form-group">
        <label for="comment">Commentaire</label>
        <textarea
          id="comment"
          v-model="newReview.comment"
          class="form-control"
          rows="3"
          placeholder="Partagez votre expérience avec ce produit..."
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button
          @click="submitReview"
          class="btn btn-primary"
          :disabled="submitLoading || !canSubmit"
        >
          {{ submitLoading ? 'Envoi en cours...' : 'Envoyer' }}
        </button>
      </div>
    </div>
    
    <div v-else class="login-prompt">
      <p>Connectez-vous pour laisser un avis</p>
      <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
    </div>
    
    <div v-if="product.comments && product.comments.length > 0" class="comments-section">
      <div v-for="comment in product.comments" :key="comment.id" class="comment">
        <div class="comment-header">
          <span class="comment-author">{{ comment.userName }}</span>
          <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          <div class="comment-rating">
            <StarRating :value="comment.rating" />
          </div>
        </div>
        <p class="comment-content">{{ comment.comment }}</p>
      </div>
    </div>
    
    <div v-else-if="!loading" class="no-reviews">
      <p>Aucun avis pour ce produit pour le moment.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useProductStore } from '@/store/product'
import StarRating from '@/components/common/StarRating.vue'

export default {
  name: 'ProductReviews',
  components: {
    StarRating
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const productStore = useProductStore()
    
    const submitLoading = ref(false)
    const newReview = ref({
      rating: 0,
      comment: ''
    })
    
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    
    const canSubmit = computed(() => {
      return newReview.value.rating > 0 && newReview.value.comment.trim() !== ''
    })
    
    const updateRating = (value) => {
      newReview.value.rating = value
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }
    
    const submitReview = async () => {
      if (!canSubmit.value) return
      
      submitLoading.value = true
      
      try {
        // Submit rating
        await productStore.rateProduct(props.product.id, newReview.value.rating)
        
        // Submit comment
        await productStore.commentProduct(props.product.id, newReview.value.comment)
        
        // Reset form
        newReview.value = {
          rating: 0,
          comment: ''
        }
        
        // Emit event to refresh product
        emit('review-submitted')
      } catch (error) {
        console.error('Error submitting review:', error)
      } finally {
        submitLoading.value = false
      }
    }
    
    return {
      isAuthenticated,
      newReview,
      submitLoading,
      canSubmit,
      updateRating,
      formatDate,
      submitReview
    }
  }
}
</script>

<style scoped>
.product-reviews {
  margin-top: var(--spacing-xl);
}

.review-form {
  background-color: var(--bg-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
}

.login-prompt {
  background-color: var(--bg-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.comments-section {
  margin-top: var(--spacing-lg);
}

.comment {
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-md) 0;
}

.comment:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.comment-author {
  font-weight: bold;
  margin-right: var(--spacing-sm);
}

.comment-date {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.comment-rating {
  margin-left: auto;
}

.comment-content {
  margin: 0;
  line-height: 1.5;
}

.no-reviews {
  text-align: center;
  padding: var(--spacing-lg) 0;
  color: var(--text-muted);
}
</style>