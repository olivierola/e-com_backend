<template>
  <div class="star-rating">
    <div class="stars-container">
      <button
        v-for="i in 5"
        :key="i"
        type="button"
        @click="editable ? updateRating(i) : null"
        class="star-btn"
        :class="{ 'clickable': editable }"
      >
        <svg
          :class="{ 'filled': i <= displayValue, 'hover-fill': editable && i <= hoverValue }"
          class="star-icon"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      </button>
    </div>
    <span v-if="showValue" class="rating-value">{{ displayValue }}/5</span>
    <span v-if="count" class="rating-count">({{ count }})</span>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'StarRating',
  props: {
    value: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    editable: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const hoverValue = ref(0)
    
    const displayValue = computed(() => {
      return parseFloat(props.value).toFixed(1)
    })
    
    const updateRating = (value) => {
      emit('update:value', value)
    }
    
    return {
      hoverValue,
      displayValue,
      updateRating
    }
  }
}
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
}

.stars-container {
  display: flex;
}

.star-btn {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0 2px;
  cursor: default;
}

.star-btn.clickable {
  cursor: pointer;
}

.star-icon {
  width: 20px;
  height: 20px;
  fill: #e0e0e0;
  transition: fill 0.2s ease;
}

.star-icon.filled {
  fill: #ffc107;
}

.star-icon.hover-fill {
  fill: #ffdb70;
}

.rating-value {
  margin-left: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-color);
}

.rating-count {
  margin-left: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}
</style>