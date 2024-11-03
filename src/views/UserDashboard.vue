<!-- src/views/UserDashboard.vue -->

<template>
  <div class="container mx-auto py-10">
    <!-- Ebooks Section -->
    <UserEbooksSection />

    <!-- Catalogues Section -->
    <UserCataloguesSection />
  </div>
</template>


<script>
import UserEbooksSection from '../components/UserEbooksSection.vue';
import UserCataloguesSection from '../components/UserCataloguesSection.vue';

export default {
  name: 'UserDashboard',
  components: {
    UserEbooksSection,
    UserCataloguesSection,
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
