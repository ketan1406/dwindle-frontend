<template>
  <div>
    <AppHeader />
    <div class="container mx-auto py-20">
      <h2 class="text-3xl font-bold text-center mb-8">Sign Up</h2>
      <form @submit.prevent="handleSignUp">
        <input v-model="email" type="email" placeholder="Email" required class="mb-4 p-2 border rounded w-full" />
        <input v-model="password" type="password" placeholder="Password" required
          class="mb-4 p-2 border rounded w-full" />
        <input v-model="username" type="text" placeholder="Username" required class="mb-4 p-2 border rounded w-full" />
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded w-full">
          Sign Up
        </button>
      </form>
    </div>

    <!-- Include the OtpAuth component -->
    <OtpAuth :email="email" :isVisible="showOtpModal" @verified="handleVerification" />
    <AppFooter />
  </div>
</template>

<script>
import { mapActions } from 'vuex'; // Import Vuex actions
import AppHeader from '../components/Header.vue';
import AppFooter from '../components/Footer.vue';
import OtpAuth from '../components/OtpAuth.vue';
import { supabase } from '../supabase';

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
    ...mapActions(['signUp']), // Map Vuex actions to methods

    async checkUsernameAvailability(username) {
      try {
        const { data, error } = await supabase.rpc('is_username_available', {
          _username: username,
        });

        if (error) {
          console.error('Error checking username availability:', error.message);
          throw error;
        }

        return data; // `data` will be `true` if available, `false` if not
      } catch (error) {
        console.error('Error in checkUsernameAvailability:', error.message);
        throw error;
      }
    },


    async handleSignUp() {
      try {
        // Check if username is available
        const isAvailable = await this.checkUsernameAvailability(this.username);
        if (!isAvailable) {
          alert('Username is already taken. Please choose another one.');
          return;
        }

        await this.signUp({
          email: this.email,
          password: this.password,
          username: this.username,
        });
        // Show OTP verification modal after signup
        this.showOtpModal = true;
      } catch (error) {
        console.error('Sign-up error:', error.message);
        alert('Sign-up failed: ' + error.message);
      }
    },

    handleVerification() {
      // Hide the OTP modal after verification
      this.showOtpModal = false;
    },
  },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
