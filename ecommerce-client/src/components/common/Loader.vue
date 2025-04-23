<template>
  <div class="loader" :class="{ 'loader-overlay': overlay }">
    <div class="spinner"></div>
    <p v-if="message" class="loader-text">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    message: {
      type: String,
      default: 'Chargement...'
    },
    overlay: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
}

.loader-text {
  margin-top: var(--spacing-md);
  color: var(--text-color);
  font-size: var(--font-size);
}
</style>