<!-- src/views/UserDashboard.vue -->

<template>
  <div>
    <AppHeader />
    <div class="container mx-auto py-20">
      <h2 class="text-3xl font-bold text-center mb-8">Welcome to Your Dashboard</h2>
      <p class="text-center text-lg">This is where you can manage your account and access exclusive features.</p>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '../components/Header.vue';
import AppFooter from '../components/Footer.vue';

export default {
  name: 'UserDashboard',
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
