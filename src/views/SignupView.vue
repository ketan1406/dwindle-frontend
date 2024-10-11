<template>
  <div>
    <AppHeader />
    <section class="bg-white dark:bg-gray-900">
      <div class="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form @submit.prevent="handleSignUp" class="w-full max-w-md">
          <!-- Logo or Branding -->
          <!-- You can replace the img src with your logo -->
          <!-- <img class="w-auto h-7 sm:h-8" src="your-logo.svg" alt="Logo"> -->

          <h1 class="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white text-center">
            Sign Up
          </h1>

          <!-- Username Input Field -->
          <div class="relative flex items-center mt-8">
            <span class="absolute">
              <!-- User Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5.121 17.804A15.953 15.953 0 0112 15c2.133 0
                  4.158.417 6 1.17M15 11a3 3 0 11-6 0 3 3 0 016
                  0z"
                />
              </svg>
            </span>

            <input
              v-model="username"
              type="text"
              class="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11
              dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400
              dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring
              focus:ring-opacity-40"
              placeholder="Username"
              required
            />
          </div>

          <!-- Email Input Field -->
          <div class="relative flex items-center mt-4">
            <span class="absolute">
              <!-- Email Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22
                  0L21 8M5 19h14a2 2 0 002-2V7a2 2 0
                  00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>

            <input
              v-model="email"
              type="email"
              class="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11
              dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400
              dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring
              focus:ring-opacity-40"
              placeholder="Email address"
              required
            />
          </div>

          <!-- Password Input Field -->
          <div class="relative flex items-center mt-4">
            <span class="absolute">
              <!-- Lock Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0
                  002-2v-6a2 2 0 00-2-2H6a2 2 0
                  00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0
                  00-8 0v4h8z"
                />
              </svg>
            </span>

            <input
              v-model="password"
              type="password"
              class="block w-full px-11 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900
              dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300
              focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Password"
              required
              @copy.prevent
              @paste.prevent
              @cut.prevent
            />
          </div>

          <!-- Confirm Password Input Field -->
          <div class="relative flex items-center mt-4">
            <span class="absolute">
              <!-- Lock Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0
                  002-2v-6a2 2 0 00-2-2H6a2 2 0
                  00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0
                  00-8 0v4h8z"
                />
              </svg>
            </span>

            <input
              v-model="confirmPassword"
              type="password"
              class="block w-full px-11 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900
              dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300
              focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Confirm Password"
              required
              @copy.prevent
              @paste.prevent
              @cut.prevent
            />
          </div>

          <!-- Error Message Display -->
          <div v-if="errorMessage" class="mt-2 text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>

          <!-- Sign Up Button -->
          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize
              transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-green-400
              focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50"
            >
              <span v-if="loading">
                <!-- Loading Spinner -->
                <span class="loading loading-bars loading-md"></span>
              </span>
              <span v-else>
                Sign Up
              </span>
            </button>

            <div class="mt-6 text-center">
              <router-link
                to="/login"
                class="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Already have an account? Log in
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </section>

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
      confirmPassword: '',
      username: '',
      showOtpModal: false,
      errorMessage: '',
      loading: false,
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
      this.loading = true;
      try {
        // Clear previous error message
        this.errorMessage = '';

        // Check if passwords match
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Passwords do not match.';
          this.loading = false;
          return;
        }

        // Check if username is available
        const isAvailable = await this.checkUsernameAvailability(this.username);
        if (!isAvailable) {
          this.errorMessage = 'Username is already taken. Please choose another one.';
          this.loading = false;
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
        this.errorMessage = 'Sign-up failed: ' + error.message;
      } finally {
        this.loading = false;
      }
    },

    handleVerification() {
      // Hide the OTP modal after verification
      this.showOtpModal = false;

      // Optionally, redirect the user after successful verification
      // this.$router.push('/dashboard');
    },
  },
};
</script>
