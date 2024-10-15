<template>
  <div>
    <AppHeader />
    <div class="container mx-auto py-20">
      <h2 class="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
      <p class="text-center text-lg">This is where you can manage the application as an admin.</p>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '../components/Header.vue';
import AppFooter from '../components/Footer.vue';

export default {
  name: 'AdminDashboard',
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>
