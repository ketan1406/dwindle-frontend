// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import { store } from '../store.js';
// Import other views as needed

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  // Protected route example:
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: DashboardView,
  //   meta: { requiresAuth: true },
  // },
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
  } else {
    next();
  }
});

export default router;
