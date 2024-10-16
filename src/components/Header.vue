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
        <router-link v-if="isAdmin" to="/admin" class="btn btn-ghost text-gray-800 hover:bg-gray-200">
          Admin Dashboard
        </router-link>
        <!-- Notification Icon -->
        <div class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost btn-circle text-gray-800 hover:bg-gray-200">
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
              <!-- Notification Badge (optional) -->
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52">
            <!-- Notification Items -->
            <li><a>Notification 1</a></li>
            <li><a>Notification 2</a></li>
            <!-- Add more notifications as needed -->
          </ul>
        </div>

        <!-- Avatar Icon -->
        <div class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img
                src="https://img.daisyui.com/avatars/placeholder-avatar.jpg"
                alt="User Avatar"
              />
            </div>
          </button>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52">
            <!-- Logout Option -->
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
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin']), // Map isAuthenticated getter to check if user is logged in
  },
  methods: {
    ...mapActions(['logout']), // Map Vuex logout action
    async handleLogout() {
      try {
        await this.logout(); // Call Vuex action to log out
        this.$router.push('/'); // Redirect to home after logout
      } catch (error) {
        console.error('Logout error:', error.message);
        alert('Logout failed: ' + error.message);
      }
    },
  },
};
</script>
