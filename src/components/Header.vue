<template>
  <div class="navbar bg-gray-50">
    <!-- Left Side: Logo -->
    <div class="navbar-start">
      <router-link to="/" class="btn btn-ghost normal-case text-xl text-gray-800">Dwindle</router-link>
    </div>

    <!-- Right Side: Navigation Links -->
    <div class="navbar-end">
      <!-- When user is logged out -->
      <div v-if="!isAuthenticated" class="flex items-center space-x-2">
        <router-link to="/contact" class="btn btn-ghost text-gray-800 hover:bg-gray-200">Contact</router-link>
        <router-link to="/login" class="btn btn-primary">Login</router-link>
      </div>

      <!-- When user is logged in -->
      <div v-else class="flex items-center space-x-2">
        <!-- Show admin link if user is admin -->
        <router-link
          v-if="isAdmin"
          :to="dashboardLink"
          class="btn btn-ghost text-gray-800 hover:bg-gray-200">
          {{ dashboardText }}
        </router-link>

        <!-- Notification Icon -->
        <div class="dropdown dropdown-end">
          <button @click="toggleNotificationDropdown" aria-expanded="isNotificationOpen" class="btn btn-ghost btn-circle text-gray-800 hover:bg-gray-200">
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032
                  2.032 0 0118 14.158V11a6.002 6.002
                  0 00-4-5.659V5a2 2 0 10-4
                  0v.341C7.67 6.165 6 8.388 6
                  11v3.159c0 .538-.214 1.055-.595
                  1.436L4 17h5m6 0v1a3 3 0
                  11-6 0v-1m6 0H9" />
              </svg>
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <!-- Only show dropdown when isNotificationOpen is true -->
          <ul v-if="isNotificationOpen" tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52 solid-bg">
            <li><a>Notification 1</a></li>
            <li><a>Notification 2</a></li>
          </ul>
        </div>

        <!-- Avatar Icon -->
        <div class="dropdown dropdown-end">
          <button @click="toggleAvatarDropdown" aria-expanded="isAvatarOpen" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src="https://www.gravatar.com/avatar/?d=mp&f=y" alt="User Avatar" />
            </div>
          </button>
          <!-- Only show dropdown when isAvatarOpen is true -->
          <ul v-if="isAvatarOpen" tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52 solid-bg">
            <li><a @click.prevent="handleLogout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'AppHeader',
  data() {
    return {
      isNotificationOpen: false,
      isAvatarOpen: false,
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin']),
    dashboardLink() {
      if (!this.isAdmin) return null;
      return this.$route.path === '/dashboard' ? '/admin' : '/dashboard';
    },
    dashboardText() {
      if (!this.isAdmin) return '';
      return this.$route.path === '/dashboard' ? 'Back to Admin Dashboard' : 'User Dashboard';
    },
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/');
      } catch (error) {
        console.error('Logout error:', error.message);
        alert('Logout failed: ' + error.message);
      }
    },
    toggleNotificationDropdown() {
      this.isNotificationOpen = !this.isNotificationOpen;
      if (this.isNotificationOpen) {
        this.isAvatarOpen = false;
      }
    },
    toggleAvatarDropdown() {
      this.isAvatarOpen = !this.isAvatarOpen;
      if (this.isAvatarOpen) {
        this.isNotificationOpen = false;
      }
    },
  },
};
</script>
