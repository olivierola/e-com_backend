import { defineStore } from "pinia";
import axios from "axios";

export const usePiniaStore = defineStore("pinia", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    userRole: (state) => state.role,
  },

  actions: {
    async login(email, password) {
      try {
        const response = await axios.post("https://exemple.fr/api/login", {
          email,
          password,
        });
        const { token, user, role } = response.data;
        this.token = token;
        this.user = user;
        this.role = role;
        this.isAuthenticated = true;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Erreur de connexion",
        };
      }
    },

    async register(email, firstName, lastName, birthDate, password) {
      try {
        const response = await axios.post("https://exemple.fr/api/register", {
          email,
          firstName,
          lastName,
          birthDate,
          password,
        });

        return { success: true, message: "Inscription réussie" };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Erreur lors de l'inscription",
        };
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },

    async fetchUserProfile() {
      try {
        if (!this.token) return { success: false, error: "Non authentifié" };

        const response = await axios.get("https://exemple.fr/api/profile", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return { success: true, user: response.data.user };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Erreur lors de la récupération du profil",
        };
      }
    },

    checkAuth() {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
        this.role = localStorage.getItem("role");
        this.isAuthenticated = true;
        return true;
      }

      return false;
    },
  },
});
