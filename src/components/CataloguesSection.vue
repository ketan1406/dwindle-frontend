<!-- src/components/CataloguesSection.vue -->
<template>
  <section class="container px-4 mx-auto">
    <!-- Action Buttons Above the Cards -->
    <div class="flex justify-between items-center mb-4">
      <!-- New Catalogue Button -->
      <button @click="openModal(null)" class="btn btn-primary">
        New Catalogue +
      </button>
    </div>

    <!-- Catalogues Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="catalogue in catalogues" :key="catalogue.id" class="flex flex-col items-center">
        <div class="w-full bg-white rounded-lg shadow-md dark:bg-gray-800">
          <!-- Image Placeholder -->
          <div class="h-40 bg-gray-300 rounded-t-lg"></div>
          <!-- Catalogue Details -->
          <div class="p-4">
            <h3 class="text-xl font-bold text-center text-gray-800 dark:text-white">
              {{ catalogue.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {{ truncateText(catalogue.description, 100) }}
            </p>
            <!-- Action Buttons -->
            <div class="flex justify-center mt-4">
              <button @click="openModal(catalogue)" class="btn btn-sm btn-outline mr-2">
                Edit
              </button>
              <button @click="deleteCatalogue(catalogue.id)" class="btn btn-sm btn-outline btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Catalogue Modal -->
    <CatalogueModal
      v-if="showModal"
      :catalogue="selectedCatalogue"
      @close="closeModal"
      @save="handleSaveCatalogue"
    />
  </section>
</template>

<script>
import { supabase } from '../supabase';
import CatalogueModal from './CatalogueModal.vue';

export default {
  name: 'CataloguesSection',
  components: {
    CatalogueModal,
  },
  data() {
    return {
      catalogues: [],
      loading: false,
      error: null,
      showModal: false,
      selectedCatalogue: null,
    };
  },
  async created() {
    await this.fetchCatalogues();
  },
  methods: {
    async fetchCatalogues() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        this.catalogues = data;
      } catch (error) {
        console.error('Error fetching catalogues:', error.message);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    openModal(catalogue) {
      this.selectedCatalogue = catalogue;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedCatalogue = null;
    },
    async handleSaveCatalogue() {
      await this.fetchCatalogues();
      this.closeModal();
    },
    async deleteCatalogue(id) {
      if (confirm('Are you sure you want to delete this catalogue?')) {
        try {
          const { error } = await supabase
            .from('sections')
            .delete()
            .eq('id', id);

          if (error) throw error;

          // Refresh the list
          await this.fetchCatalogues();
        } catch (error) {
          console.error('Error deleting catalogue:', error.message);
          alert('Error deleting catalogue: ' + error.message);
        }
      }
    },
    truncateText(text, length) {
      if (text.length <= length) {
        return text;
      }
      return text.substring(0, length) + '...';
    },
  },
};
</script>
