<!-- src/App.vue -->

<template>
  <div id="app" class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="flex-grow">
      <!-- The router-view will render the components for the current route -->
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/Header.vue';
import AppFooter from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>
