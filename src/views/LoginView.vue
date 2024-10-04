<template>
  <div>
    <AppHeader />
    <div class="container mx-auto py-20">
      <h2 class="text-3xl font-bold text-center mb-8">Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required class="mb-4 p-2 border rounded w-full" />
        <input v-model="password" type="password" placeholder="Password" required
          class="mb-4 p-2 border rounded w-full" />
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
      <div class="mt-6">
        <button @click="loginWithGoogle" class="bg-red-500 text-white py-2 px-4 rounded">
          Login with Google
        </button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import { supabase } from '../supabase';
import AppHeader from '../components/Header.vue';
import AppFooter from '../components/Footer.vue';
import { store } from '../store.js';

export default {
  name: 'LoginView',
  components: { AppHeader, AppFooter },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      const { data,error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });
      if (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
      } else {
        store.user = data.user; // Update store with authenticated user
        this.$router.push('/dashboard');  // Redirect to dashboard or home page
      }
    },
    async loginWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error('Google login error:', error.message);
        alert('Google login failed: ' + error.message);
      }
    },
  },
};
</script>
