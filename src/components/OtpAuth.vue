<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
      <p class="mb-4 text-center">An OTP has been sent to {{ email }}. Please enter it below to verify your account.</p>
      <form @submit.prevent="verifyOtp">
        <input v-model="otp" type="text" placeholder="Enter OTP" required
          class="mb-4 p-2 border rounded w-full text-center text-xl tracking-widest" maxlength="6" />
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded w-full" :disabled="loading">
          <span v-if="loading">Verifying...</span>
          <span v-else>Verify</span>
        </button>
      </form>
      <button @click="resendOtp" class="mt-4 text-blue-500 underline w-full text-center" :disabled="loading">
        Resend OTP
      </button>
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
      otp: '',
      loading: false, // Track loading state
    };
  },
  methods: {
    // OtpAuth.vue
    async verifyOtp() {
      this.loading = true;
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: this.email,
          token: this.otp,
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
        this.otp = '';
      } catch (error) {
        console.error('OTP verification error:', error.message);
        alert('OTP verification failed: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
    async resendOtp() {
      this.loading = true; // Set loading to true while OTP is being resent
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
        alert('Failed to resend OTP: ' + error.message);
      } finally {
        this.loading = false; // Reset loading state after resending OTP
      }
    },
  },
};
</script>

<style scoped>
/* Modal styles */
.fixed {
  position: fixed;
  z-index: 50;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.bg-black {
  background-color: rgba(0, 0, 0, 0.5);
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.w-11\/12 {
  width: 91.666667%;
}

.max-w-md {
  max-width: 28rem;
}
</style>
