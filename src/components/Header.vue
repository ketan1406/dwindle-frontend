<!-- src/components/Header.vue -->

<template>
  <header class="bg-white shadow">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <h1 class="text-2xl font-bold text-gray-800">
        <router-link to="/">Dwindle</router-link>
      </h1>
      <nav class="space-x-4">
        <router-link to="/" class="text-gray-600 hover:text-blue-500">Home</router-link>
        <router-link to="/features" class="text-gray-600 hover:text-blue-500">Features</router-link>
        <router-link to="/login" class="text-gray-600 hover:text-blue-500">Login</router-link>
        <button @click="logout" class="text-gray-600 hover:text-blue-500">Logout</button>
      </nav>
    </div>
  </header>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'AppHeader',
  methods: {
    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        alert('Logout failed: ' + error.message);
      } else {
        this.$router.push('/login');
      }
    },
  },
};
</script>
