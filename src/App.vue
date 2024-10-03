<!-- src/App.vue -->

<template>
  <router-view />
</template>

<script>
import { supabase } from './supabase';

export default {
  name: 'App',
  created() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
        // You can update user state or redirect if necessary
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        // Handle sign-out actions
      }
    });
  },
};
</script>
