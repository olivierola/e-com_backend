<template>
  <div v-if="message" :class="['alert', `alert-${type}`]">
    {{ message }}
    <button v-if="dismissible" class="close-btn" @click="dismiss">×</button>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'info', 'warning', 'danger'].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 0 // 0 means stay until dismissed
    }
  },
  mounted() {
    if (this.duration > 0) {
      setTimeout(() => {
        this.dismiss()
      }, this.duration)
    }
  },
  methods: {
    dismiss() {
      this.$emit('dismiss')
    }
  }
}
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.5;
  transition: var(--transition);
}

.close-btn:hover {
  opacity: 1;
}
</style>