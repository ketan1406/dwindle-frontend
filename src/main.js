import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import './assets/tailwind.css';
import { supabase } from './supabase.js';
import { store } from './store';

createApp(App).use(router).mount('#app');

supabase.auth.onAuthStateChange((event, session) => {
  store.user = session?.user || null;
});
