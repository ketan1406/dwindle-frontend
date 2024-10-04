<template>
  <section class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
    <div class="container mx-auto text-center">
      <h2 class="text-4xl font-bold mb-4">Welcome to Dwindle</h2>
      <p class="text-xl mb-8">Manage your digital library effortlessly.</p>
      <button @click="getStarted"
        class="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition duration-300">
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
