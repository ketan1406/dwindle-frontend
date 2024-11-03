<template>
  <!-- Catalogues Section -->
  <section class="container px-4 mx-auto my-8">
    <h2 class="text-2xl font-bold mb-4">Available Catalogues</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Catalogue Card -->
      <div
        v-for="catalogue in catalogues"
        :key="catalogue.id"
        class="flex flex-col items-center justify-center w-full max-w-sm mx-auto"
      >
        <div
          class="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"
          :style="{
            backgroundImage: `url(${defaultCatalogueImage})`,
          }"
        ></div>
        <div
          class="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800"
        >
          <h3
            class="py-2 font-bold tracking-wide text-center text-gray-800 uppercase dark:text-white"
          >
            {{ catalogue.name }}
          </h3>
          <div
            class="flex items-center justify-between px-3 py-2 bg-gray-200 dark:bg-gray-700"
          >
            <!-- View Button -->
            <button
              @click="viewCatalogue(catalogue)"
              class="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-600 focus:bg-gray-700 dark:focus:bg-gray-600 focus:outline-none"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'UserCataloguesSection',
  data() {
    return {
      catalogues: [],
      defaultCatalogueImage:
        'https://via.placeholder.com/300x400', // Placeholder image URL
    };
  },
  methods: {
    async fetchCatalogues() {
      try {
        const { data, error } = await supabase
          .from('sections')
          .select('id, name');

        if (error) throw error;

        this.catalogues = data.map((catalogue) => ({
          ...catalogue,
          coverImageUrl:this.defaultCatalogueImage,
        }));
      } catch (error) {
        console.error('Error fetching catalogues:', error.message);
      }
    },
    viewCatalogue(catalogue) {
      // Implement the logic to view the catalogue, e.g., navigate to a CatalogueDetails page
      // For now, we'll just log the catalogue
      console.log('Viewing catalogue:', catalogue);
    },
  },
  created() {
    this.fetchCatalogues();
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
