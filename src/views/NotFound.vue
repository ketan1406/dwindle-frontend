<!-- src/views/NotFound.vue -->
<template>
  <div class="container mx-auto py-20 text-center">
    <h1 class="text-5xl font-bold mb-6">404 - Page Not Found</h1>
    <p class="text-lg text-gray-700 dark:text-gray-300">
      Oops! The page you're looking for doesn't exist.
    </p>
    <router-link to="/" class="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
      Go Back Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
