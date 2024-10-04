<template>
  <div>
    <AppHeader />
    <div class="container mx-auto py-20">
      <h2 class="text-3xl font-bold text-center mb-8">Sign Up</h2>
      <form @submit.prevent="signUp">
        <input v-model="email" type="email" placeholder="Email" required class="mb-4 p-2 border rounded w-full" />
        <input v-model="password" type="password" placeholder="Password" required
          class="mb-4 p-2 border rounded w-full" />
        <input v-model="username" type="text" placeholder="Username" required class="mb-4 p-2 border rounded w-full" />
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded w-full">
          Sign Up
        </button>
      </form>
    </div>
    <!-- Include the OtpVerify component -->
    <OtpAuth :email="email" :isVisible="showOtpModal" @verified="handleVerification" />
    <AppFooter />
  </div>
</template>

<script>
import { supabase } from '../supabase';
import AppHeader from '../components/Header.vue';
import AppFooter from '../components/Footer.vue';
import OtpAuth from '../components/OtpAuth.vue';

export default {
  name: 'SignupView',
  components: {
    AppHeader,
    AppFooter,
    OtpAuth,
  },
  data() {
    return {
      email: '',
      password: '',
      username: '',
      showOtpModal: false,
    };
  },
  methods: {
    async signUp() {
      try {
        const { error } = await supabase.auth.signUp(
          {
            email: this.email,
            password: this.password,
            options: {
              data: {
                username: this.username,
              },
            },
          },
          {
            emailRedirectTo: window.location.origin,
          }
        );

        if (error) {
          throw error;
        }

        // Show the OTP verification modal
        this.showOtpModal = true;
      } catch (error) {
        console.error('Sign-up error:', error.message);
        alert('Sign-up failed: ' + error.message);
      }
    },
    handleVerification() {
      // Hide the OTP modal
      this.showOtpModal = false;

      // Redirect to dashboard
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
