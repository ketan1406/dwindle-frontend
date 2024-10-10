<template>
  <header class="bg-white shadow">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <h1 class="text-2xl font-bold text-gray-800">
        <router-link to="/">Dwindle</router-link>
      </h1>
      <nav class="space-x-4">
        <router-link to="/" class="text-gray-600 hover:text-blue-500">Home</router-link>
        <router-link to="/login" class="text-gray-600 hover:text-blue-500" v-if="!isAuthenticated">Login</router-link>
        <button v-if="isAuthenticated" @click="handleLogout" class="text-gray-600 hover:text-blue-500">Logout</button>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapGetters(['isAuthenticated']), // Map isAuthenticated getter to check if user is logged in
  },
  methods: {
    ...mapActions(['logout']), // Map Vuex logout action
    async handleLogout() {
      try {
        await this.logout(); // Call Vuex action to log out
        this.$router.push('/'); // Redirect to home after logout
      } catch (error) {
        console.error('Logout error:', error.message);
        alert('Logout failed: ' + error.message);
      }
    },
  },
};
</script>
