// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import UserDashboard from '../views/UserDashboard.vue';
import { store } from '../store.js';
// Import other views as needed

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  {
    path: '/dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.user) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else if (to.name === 'Login' && store.user) {
    next({ name: 'UserDashboard' });  // Redirect authenticated users to the dashboard
  } else {
    next();
  }
});

export default router;
