<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="onPageChange(currentPage - 1)"
    >
      &laquo; Précédent
    </button>
    
    <div class="pagination-numbers">
      <button
        v-if="currentPage > 2"
        class="pagination-num"
        @click="onPageChange(1)"
      >
        1
      </button>
      
      <span v-if="currentPage > 3" class="pagination-ellipsis">...</span>
      
      <button
        v-if="currentPage > 1"
        class="pagination-num"
        @click="onPageChange(currentPage - 1)"
      >
        {{ currentPage - 1 }}
      </button>
      
      <button class="pagination-num pagination-current">
        {{ currentPage }}
      </button>
      
      <button
        v-if="currentPage < totalPages"
        class="pagination-num"
        @click="onPageChange(currentPage + 1)"
      >
        {{ currentPage + 1 }}
      </button>
      
      <span v-if="currentPage < totalPages - 2" class="pagination-ellipsis">...</span>
      
      <button
        v-if="currentPage < totalPages - 1"
        class="pagination-num"
        @click="onPageChange(totalPages)"
      >
        {{ totalPages }}
      </button>
    </div>
    
    <button
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="onPageChange(currentPage + 1)"
    >
      Suivant &raquo;
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: ['page-change'],
  methods: {
    onPageChange(page) {
      console.log('Pagination emitting page change to:', page);
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    }
  }
};
</script>


<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.pagination-btn,
.pagination-num {
  background-color: white;
  border: 1px solid var(--border-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  margin: 0 var(--spacing-xs);
  cursor: pointer;
  transition: var(--transition);
  border-radius: var(--border-radius);
}

.pagination-btn:hover:not(:disabled),
.pagination-num:hover:not(.pagination-current) {
  background-color: var(--bg-light);
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-current {
  background-color: var(--primary-color);
  color: white;
  font-weight: bold;
  cursor: default;
}

.pagination-numbers {
  display: flex;
  align-items: center;
}

.pagination-ellipsis {
  margin: 0 var(--spacing-xs);
}
</style>