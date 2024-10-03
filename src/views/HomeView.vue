<template>
  <div>
    <AppHeader />
    <HeroSection />
    <FeaturesSection />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '../components/Header.vue';
import HeroSection from '../components/Hero.vue';
import FeaturesSection from '../components/Features.vue';
import AppFooter from '../components/Footer.vue';

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    HeroSection,
    FeaturesSection,
    AppFooter,
  },
};
</script>
