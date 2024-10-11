<template>
  <div>
    <AppHeader />
    <section class="bg-white dark:bg-gray-900">
      <div class="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form @submit.prevent="handleLogin" class="w-full max-w-md">
          <!-- Logo or Branding -->
          <!-- You can replace the img src with your logo -->

          <h1 align="centre" class="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white text-center">Sign In</h1>

          <!-- Email Input Field -->
          <div class="relative flex items-center mt-8">
            <span class="absolute">
              <!-- Email Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>

            <input v-model="email" type="email"
                   class="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300
                   dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none
                   focus:ring focus:ring-opacity-40" placeholder="Email address" required>
          </div>

          <!-- Password Input Field -->
          <div class="relative flex items-center mt-4">
            <span class="absolute">
              <!-- Lock Icon -->
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                   fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
                      00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0
                      00-8 0v4h8z" />
              </svg>
            </span>

            <input v-model="password" :type="showPassword ? 'text' : 'password'"
                   class="block w-full px-11 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900
                   dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300
                   focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                   placeholder="Password" required>

            <!-- Password Visibility Toggle Button -->
            <button type="button" @click="togglePassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg"
                   class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" stroke-width="2">
                <!-- Eye Icon -->
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12
                      5s8.268 2.943 9.542 7c-1.274 4.057-5.065
                      7-9.542 7S3.732 16.057 2.458 12z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg"
                   class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" stroke-width="2">
                <!-- Eye Off Icon -->
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112
                      19c-4.478 0-8.269-2.943-9.542-7a9.973
                      9.973 0 011.384-3.023m1.796-1.796A9.973
                      9.973 0 0112 5c4.478 0 8.269 2.943
                      9.542 7a9.976 9.976 0 01-1.512
                      3.17M15 12a3 3 0 00-4.157-2.829M9.878
                      9.88l4.242 4.242" />
              </svg>
            </button>
          </div>

          <!-- Sign In Button -->
          <div class="mt-6">
            <button type="submit"
                    class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize
                    transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400
                    focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Sign in
            </button>

            <p class="mt-4 text-center text-gray-600 dark:text-gray-400">or sign in with</p>

            <!-- Google Sign In Button -->
            <button @click="handleLoginWithGoogle"
                    class="flex items-center justify-center px-6 py-3 mt-4 text-gray-600
                    transition-colors duration-300 transform border rounded-lg dark:border-gray-700
                    dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 w-full">
              <!-- Google Icon -->
              <svg class="w-6 h-6 mx-2" viewBox="0 0 40 40">
                <!-- SVG Paths for Google Icon -->
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
              </svg>

              <span class="mx-2">Sign in with Google</span>
            </button>

            <div class="mt-6 text-center ">
              <router-link to="/signup" class="text-sm text-blue-500 hover:underline dark:text-blue-400">
                Don’t have an account yet? Sign up
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </section>
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
      showPassword: false,
    };
  },
  methods: {
    ...mapActions(['login', 'loginWithGoogle']),  // Map Vuex actions

    async handleLogin() {
      try {
        await this.login({ email: this.email, password: this.password });
        console.log('Login successful');
        this.$router.push('/dashboard');  // Redirect after successful login
      } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
      }
    },

    async handleLoginWithGoogle() {
      try {
        await this.loginWithGoogle();  // Call the Vuex action for Google login
        console.log('Google login successful');
        this.$router.push('/dashboard');  // Redirect after successful Google login
      } catch (error) {
        console.error('Google login error:', error.message);
        alert('Google login failed: ' + error.message);
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>
