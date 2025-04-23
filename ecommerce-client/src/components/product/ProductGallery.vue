<template>
  <div class="product-gallery">
    <div class="main-image-container">
      <img :src="currentImage" :alt="alt" class="main-image" />
    </div>
    
    <div v-if="images.length > 1" class="thumbnails">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="selectImage(index)"
        class="thumbnail-button"
        :class="{ active: currentIndex === index }"
      >
        <img :src="image" :alt="`${alt} - vue ${index + 1}`" class="thumbnail" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ProductGallery',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    alt: {
      type: String,
      default: 'Product image'
    }
  },
  setup(props) {
    const currentIndex = ref(0)
    
    const currentImage = computed(() => {
      if (props.images.length === 0) {
        return 'https://via.placeholder.com/600x400?text=No+Image'
      }
      return props.images[currentIndex.value]
    })
    
    // Reset current index if images change
    watch(() => props.images, () => {
      currentIndex.value = 0
    })
    
    const selectImage = (index) => {
      currentIndex.value = index
    }
    
    return {
      currentIndex,
      currentImage,
      selectImage
    }
  }
}
</script>

<style scoped>
.product-gallery {
  width: 100%;
}

.main-image-container {
  width: 100%;
  margin-bottom: var(--spacing-md);
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.main-image {
  width: 100%;
  display: block;
  height: auto;
  max-height: 400px;
  object-fit: contain;
}

.thumbnails {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  overflow-x: auto;
  padding-bottom: var(--spacing-xs);
}

.thumbnail-button {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  background: none;
  transition: var(--transition);
}

.thumbnail-button.active {
  border-color: var(--primary-color);
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>