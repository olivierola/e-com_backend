<template>
  <header>
    <nav>
      <div class="brandname"><span>brand</span>name</div>
      <ul>
        <router-link :to="{ name: 'accueil' }">Accueil </router-link>
        <router-link :to="{ name: 'categorie', params: { id: 1 } }"
          >Catégorie 1
        </router-link>
        <router-link :to="{ name: 'categorie', params: { id: 1 } }"
          >Catégorie 2
        </router-link>
        <router-link :to="{ name: 'categorie', params: { id: 1 } }"
          >Catégorie 3
        </router-link>
      </ul>
      <div class="btn-container">
        <template v-if="isLoggedIn">
          <router-link :to="{ name: 'profil' }">My Profile </router-link>
          <a @click.prevent="logout">Disconnect </a>
        </template>
        <template v-else>
          <router-link :to="{ name: 'inscription' }">Inscription </router-link>
          <router-link :to="{ name: 'connexion' }">Connexion </router-link>
        </template>
      </div>
      <div id="burgerToggle" :class="active ? 'active' : ''">
        <span></span>
      </div>
    </nav>
    <div :class="'hamburgermenu ' + active ? 'active' : ''"></div>
  </header>
</template>

<script>
import { storeToRefs } from "pinia";
import { usePiniaStore } from "../pinia";
export default {
  setup() {
    const piniaStore = usePiniaStore();
    const { isLoggedIn } = storeToRefs(piniaStore);
    piniaStore.checkAuth();
    const logout = () => {
      authStore.logout();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    };

    return {
      isLoggedIn,
      logout,
    };
  },
  data() {
    return { active: false };
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
    },
  },
};
</script>

<style scoped>
.hamburgermenu {
  display: none;
}
header {
  position: relative;
  width: 100%;
  color: white;
}
nav {
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 204, 255, 1);
  gap: 30px;
  z-index: 10;
  position: relative;
}
nav,
ul,
.btn-container {
  display: flex;
  justify-content: space-evenly;
  gap: 15px;
  align-items: center;
}

.brandname,
.btn-container {
  text-transform: uppercase;
}
.brandname span {
  font-weight: 700;
}
ul {
  list-style: none;
}
ul a {
  text-decoration: none;
  color: white;
}
.btn-container button {
  padding: 7px 15px;
  border: 1px solid white;
  border-radius: 12px;
}

.btn-container a:nth-child(1) button {
  background-color: transparent;
  color: white;
}
.btn-container a:nth-child(2) button {
  background-color: white;
  color: rgba(0, 204, 255, 1);
}
#burgerToggle {
  display: none;
}
#burgerToggle span {
  width: 30px;
  height: 1px;
  background-color: white;
  display: inline-block;
  position: relative;
}
#burgerToggle span::after,
#burgerToggle span::before {
  content: "";
  width: 100%;
  height: 1px;
  position: absolute;
  margin-top: -7px;
  background-color: white;
}
#burgerToggle span::after {
  margin-top: -7px;
}
#burgerToggle span::before {
  margin-top: 7px;
}

@media (max-width: 768px) {
  nav > ul,
  nav > .btn-container {
    display: none;
  }
  #burgerToggle {
    display: block;
  }
  .hamburgermenu {
    display: block;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 204, 255, 1);
    position: absolute;
    top: 0;
    left: 100%;
    transition: all 0.5s;
  }
  .hamburgermenu.active {
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 70px;
    gap: 30px;
  }
  .hamburgermenu.active ul,
  .hamburgermenu.active .btn-container {
    flex-direction: column;
    visibility: visible;
  }
  nav {
    justify-content: space-between;
  }
}
</style>
