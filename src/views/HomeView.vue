<template>
  <div>
    <HeroSection />
    <FeaturesSection />
  </div>
</template>

<script>
import HeroSection from '../components/Hero.vue';
import FeaturesSection from '../components/Features.vue';

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    FeaturesSection,
  },
};
</script>
