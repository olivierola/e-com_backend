// src/store/index.js
import { createPinia } from 'pinia'
import { useAuthStore } from './auth'
import { useCartStore } from './cart'
import { useProductStore } from './product'

const pinia = createPinia()

export { pinia, useAuthStore, useCartStore, useProductStore }