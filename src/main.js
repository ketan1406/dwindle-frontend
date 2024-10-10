// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css'; // Ensure Tailwind CSS is properly configured
import  { supabase }  from './supabase'; // Import the Supabase client
import  store  from './store'; // Import the reactive store

// Function to handle user profile creation or update
const handleUserProfile = async (user) => {
  try {
    const lastSignin = user.last_sign_in_at;

    // Use upsert to insert or update the profile
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      username: user.user_metadata.username || user.email.split('@')[0],
      last_visited: lastSignin,
    });

    if (error) {
      console.error('Error upserting profile:', error.message);
    } else {
      console.log('Profile upserted successfully.');
    }
  } catch (error) {
    console.error('Unexpected error in handleUserProfile:', error.message);
  }
};

// Set up the authentication state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event);
  // Update the reactive store with the current user or null
  store.commit('SET_USER', session?.user || null);

  if (event === 'SIGNED_IN' && session?.user) {
    const user = session.user;
    console.log(`SIGNED_IN event detected for user: ${user.email}`);

    // Handle profile creation or update
    await handleUserProfile(user);

    // Redirect to the dashboard
    if (router.currentRoute.value.name !== 'UserDashboard') {
      router.push('/dashboard');
    }
  }

  if (event === 'SIGNED_OUT') {
    console.log('SIGNED_OUT event detected. Redirecting to Home.');
    // Redirect to the home page upon sign-out
    router.push('/');
  }
});

// Initialize the Vue application
const app = createApp(App);

// Make the reactive store available throughout the app
app.use(store);

// Use the router for navigation
app.use(router);

// Mount the app to the DOM
app.mount('#app');

console.log('Vue application has been mounted successfully.');
