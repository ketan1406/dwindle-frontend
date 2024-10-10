<template>
  <div>
    <AppHeader />
    <div class="container mx-auto py-20">
      <h2 class="text-3xl font-bold text-center mb-8">Login</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required class="mb-4 p-2 border rounded w-full" />
        <input v-model="password" type="password" placeholder="Password" required
          class="mb-4 p-2 border rounded w-full" />
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
      <div class="mt-6">
        <button @click="handleLoginWithGoogle" class="bg-red-500 text-white py-2 px-4 rounded">
          Login with Google
        </button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AppHeader from '../components/Header.vue';
import AppFooter from '../components/Footer.vue';

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
    ...mapActions(['login', 'loginWithGoogle']),  // Map Vuex actions

    async handleLogin() {
      try {
        await this.login({ email: this.email, password: this.password });
        console.log('Login successful');
      } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
      }
    },

    async handleLoginWithGoogle() {
      try {
        await this.loginWithGoogle();  // Call the Vuex action for Google login
        this.$router.push('/dashboard');  // Redirect after successful Google login
      } catch (error) {
        console.error('Google login error:', error.message);
        alert('Google login failed: ' + error.message);
      }
    },
  },
};
</script>
