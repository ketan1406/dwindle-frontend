<template>
  <section class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
    <div class="container mx-auto text-center">
      <h2 class="text-5xl font-bold mb-6">Welcome to Dwindle</h2>
      <p class="text-xl mb-8">Manage your digital library effortlessly.</p>
      <button @click="getStarted" class="btn btn-primary btn-md text-white">
        Get Started
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  methods: {
    getStarted() {
      this.$router.push('/signup');
    },
  },
};
</script>
