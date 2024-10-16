// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import UserDashboard from '../views/UserDashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import store from '../store';
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
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  console.log(`Navigating to ${to.name}, Authenticated: ${isAuthenticated}`);

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    // Ensure role is loaded
    if (store.state.role === null) {
      await store.dispatch('fetchUserRole');
    }
    if (store.getters.isAdmin) {
      next();
    } else {
      next({ name: 'UserDashboard' }); // Redirect non-admins to user dashboard
    }
  } else if (['Login', 'Signup'].includes(to.name) && isAuthenticated) {
    next({ name: 'UserDashboard' });
  } else {
    next();
  }
});

export default router;
