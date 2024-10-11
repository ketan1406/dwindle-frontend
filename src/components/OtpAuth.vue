<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div class="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-w-md mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Verify Your Email
      </h2>
      <p class="mb-4 text-center text-gray-600 dark:text-gray-400">
        An OTP has been sent to <strong>{{ email }}</strong>. Please enter it below to verify your account.
      </p>
      <form @submit.prevent="verifyOtp" class="space-y-4">
        <!-- OTP Input Fields -->
        <div class="flex justify-center space-x-2">
          <input
            v-for="(digit, index) in otpInputs"
            :key="index"
            ref="otpInput"
            v-model="otpInputs[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-12 h-12 text-center text-xl font-semibold border rounded-md
                   dark:bg-grey dark:text-gray-300 dark:border-gray-600
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
            @input="onInput($event, index)"
            @keydown.backspace="onBackspace($event)"
            @paste="onPaste($event)"
          />
        </div>

        <!-- Error Message Display -->
        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <!-- Verify Button -->
        <button type="submit" :disabled="loading"
                class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize
                transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-green-400
                focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50">
          <span v-if="loading">Verifying...</span>
          <span v-else>Verify</span>
        </button>

        <!-- Resend OTP Link -->
        <div class="mt-4 text-center">
          <button @click="resendOtp" :disabled="loading"
                  class="text-sm text-blue-500 hover:underline dark:text-blue-400">
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'OtpAuth',
  props: {
    email: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      otpInputs: ['', '', '', '', '', ''], // Array for 6-digit OTP
      loading: false, // Track loading state
      errorMessage: '', // Error message display
    };
  },
  methods: {
    onInput(event, index) {
      const input = event.target;
      const value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
      this.$set(this.otpInputs, index, value);

      if (value && input.nextElementSibling) {
        input.nextElementSibling.focus();
      }
    },
    onBackspace(event) {
      const input = event.target;
      if (!input.value && input.previousElementSibling) {
        input.previousElementSibling.focus();
      }
    },
    onPaste(event) {
      event.preventDefault();
      const pasteData = event.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
      this.otpInputs = pasteData.split('');
      this.$nextTick(() => {
        const lastFilledIndex = this.otpInputs.findIndex((digit) => digit === '');
        const focusIndex = lastFilledIndex !== -1 ? lastFilledIndex : 5;
        this.$refs.otpInput[focusIndex].focus();
      });
    },
    async verifyOtp() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const otp = this.otpInputs.join('');
        if (otp.length !== 6) {
          this.errorMessage = 'Please enter a 6-digit OTP.';
          this.loading = false;
          return;
        }

        const { data, error } = await supabase.auth.verifyOtp({
          email: this.email,
          token: otp,
          type: 'signup',
        });

        if (error) {
          throw error;
        }

        const user = data.user;

        if (!user) {
          throw new Error('User not found after OTP verification');
        }

        // Emit event to parent component to indicate successful verification
        this.$emit('verified');
        this.otpInputs = ['', '', '', '', '', ''];
      } catch (error) {
        console.error('OTP verification error:', error.message);
        this.errorMessage = 'OTP verification failed: ' + error.message;
      } finally {
        this.loading = false;
      }
    },
    async resendOtp() {
      this.loading = true; // Set loading to true while OTP is being resent
      this.errorMessage = '';
      try {
        const { error } = await supabase.auth.resend({
          email: this.email,
          type: 'signup',
        });

        if (error) {
          throw error;
        }

        alert('A new OTP has been sent to your email.');
      } catch (error) {
        console.error('Resend OTP error:', error.message);
        this.errorMessage = 'Failed to resend OTP: ' + error.message;
      } finally {
        this.loading = false; // Reset loading state after resending OTP
      }
    },
  },
};
</script>
