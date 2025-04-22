import { createRouter, createWebHistory } from "vue-router";
import Accueil from "./pages/client/Accueil.vue";
import Produit from "./pages/client/Produit.vue";
import Panier from "./pages/client/Panier.vue";
import Connexion from "./pages/client/Connexion.vue";
import Categorie from "./pages/client/Categorie.vue";
import Inscription from "./pages/client/Inscription.vue";
import Profil from "./pages/client/Profil.vue";
import Checkout from "./pages/client/Checkout.vue";
import { usePiniaStore } from "./pinia";
const routes = [
  {
    path: "/",
    name: "accueil",
    component: Accueil,
  },
  {
    path: "/connexion",
    name: "connexion",
    component: Connexion,
    meta: { requiresDisconnected: true },
  },
  {
    path: "/inscription",
    name: "inscription",
    component: Inscription,
    meta: { requiresDisconnected: true },
  },
  {
    path: "/panier",
    name: "panier",
    component: Panier,
    meta: { requiresAuth: true },
  },
  {
    path: "/profil",
    name: "profil",
    component: Profil,
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
    meta: { requiresAuth: true },
  },
  {
    path: "/categorie/:id",
    name: "categorie",
    component: Categorie,
  },
  {
    path: "/produit/:id",
    name: "page_produit",
    component: Produit,
    props: true,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const piniaStore = usePiniaStore();
  if (to.meta.requiresAuth && !piniaStore.isLoggedIn) {
    next("/login");
  } else {
    next();
  }
  if (to.meta.requiresDisconnected && piniaStore.isLoggedIn) {
    next("/");
  } else {
    next();
  }
});
export default router;
