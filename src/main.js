import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import './assets/tailwind.css';
import { supabase } from './supabase';
import { store } from './store';

supabase.auth.onAuthStateChange((event, session) => {
  store.user = session?.user || null;
});

createApp(App).use(router).mount('#app');
