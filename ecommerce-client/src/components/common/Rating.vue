<template>
  <div class="rating">
    <span v-for="star in stars" :key="star" class="star" @click="setRating(star)">
      <i :class="star <= currentRating ? 'fas fa-star' : 'far fa-star'"></i>
    </span>
    <span class="rating-value">{{ currentRating }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentRating: this.value,
      stars: [1, 2, 3, 4, 5]
    };
  },
  methods: {
    setRating(star) {
      this.currentRating = star;
      this.$emit('input', star);
    }
  }
}
</script>

<style scoped>
.rating {
  display: flex;
  align-items: center;
}

.star {
  cursor: pointer;
  color: var(--primary-color);
  margin-right: 5px;
}

.rating-value {
  margin-left: 10px;
  font-weight: bold;
}
</style>
