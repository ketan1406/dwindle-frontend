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
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded">
          Sign Up
        </button>
      </form>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import { supabase } from '../supabase';
import AppHeader from '../components/Header.vue';
import AppFooter from '../components/Footer.vue';

export default {
  name: 'SignupView',
  components: { AppHeader, AppFooter },
  data() {
    return {
      email: '',
      password: '',
      username: '',
    };
  },
  methods: {
    async signUp() {
      const { user, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
      });
      if (error) {
        console.error('Sign-up error:', error.message);
        alert('Sign-up failed: ' + error.message);
      } else {
        // Create a profile entry
        const { error: profileError } = await supabase.from('profiles').insert({
          id: user.id,
          email: this.email,
          username: this.username,
        });
        if (profileError) {
          console.error('Profile creation error:', profileError.message);
          alert('Profile creation failed: ' + profileError.message);
        } else {
          // Redirect to home or login
          this.$router.push('/');
        }
      }
    },
  },
};
</script>
