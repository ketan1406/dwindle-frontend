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
            backgroundImage: `url(${catalogue.coverImageUrl})`,
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

  <!-- Catalogue Ebooks Modal -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-w-5xl mx-auto relative"
    >
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <!-- Close Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Modal Content -->
      <div v-if="loadingEbooks" class="text-center">
        <span class="loading loading-bars loading-lg"></span>
      </div>
      <div v-else-if="error">
        <p class="text-center text-red-500">{{ errorMessage }}</p>
      </div>
      <div v-else>
        <h2 class="text-2xl font-bold mb-4">
          Ebooks in "{{ selectedCatalogue.name }}"
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Ebook Card -->
          <div
            v-for="ebook in catalogueEbooks"
            :key="ebook.id"
            class="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800"
          >
            <div
              class="w-1/3 bg-cover"
              :style="{
                backgroundImage: `url(${ebook.coverImageUrl || defaultCoverImage})`,
              }"
            ></div>
            <div class="w-2/3 p-4 md:p-4">
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">
                {{ ebook.title }}
              </h1>
              <!-- Optional: Add more details -->
              <div class="flex justify-between mt-3 items-center">
                <!-- View Button -->
                <button
                  @click="viewEbook(ebook.id)"
                  class="px-2 py-1 text-xs font-bold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-700 dark:focus:bg-gray-600"
                >
                  View
                </button>
              </div>
            </div>
          </div>
          <!-- Handle case when no ebooks are found -->
          <div v-if="catalogueEbooks.length === 0" class="text-center w-full">
            <p class="text-gray-500">No ebooks found in this catalogue.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Ebook Details Modal -->
  <EbookDetailsModal
    v-if="showEbookModal"
    :ebookId="selectedEbookId"
    @close="closeEbookModal"
  />
</template>

<script>
import { supabase } from '../supabase';
import EbookDetailsModal from './EbookDetailsModal.vue';

export default {
  name: 'UserCataloguesSection',
  components: {
    EbookDetailsModal,
  },
  data() {
    return {
      catalogues: [],
      defaultCatalogueImage: 'https://via.placeholder.com/300x400', // Placeholder image URL
      showModal: false,
      selectedCatalogue: null,
      catalogueEbooks: [],
      loadingEbooks: false,
      error: false,
      errorMessage: '',
      showEbookModal: false,
      selectedEbookId: null,
      defaultCoverImage: 'https://via.placeholder.com/150', // Placeholder image for ebooks
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
          coverImageUrl: this.defaultCatalogueImage,
        }));
      } catch (error) {
        console.error('Error fetching catalogues:', error.message);
      }
    },
    async fetchCatalogueEbooks(catalogueId) {
      try {
        this.loadingEbooks = true;
        this.error = false;
        this.errorMessage = '';
        this.catalogueEbooks = [];

        // Step 1: Fetch ebook_ids associated with the selected catalogue
        const { data: ebookSections, error: esError } = await supabase
          .from('ebook_sections')
          .select('ebook_id')
          .eq('section_id', catalogueId);

        if (esError) throw esError;

        const ebookIds = ebookSections.map(item => item.ebook_id);

        if (ebookIds.length === 0) {
          // No ebooks found for this catalogue
          this.catalogueEbooks = [];
          return;
        }

        // Step 2: Fetch ebooks by IDs
        const { data: ebooks, error: ebooksError } = await supabase
          .from('ebooks')
          .select('*')
          .in('id', ebookIds);

        if (ebooksError) throw ebooksError;

        this.catalogueEbooks = ebooks.map((ebook) => {
          return {
            ...ebook,
            coverImageUrl: this.defaultCoverImage,
          };
        });
      } catch (error) {
        console.error('Error fetching ebooks for catalogue:', error.message);
        this.error = true;
        this.errorMessage = 'Failed to fetch ebooks for this catalogue.';
      } finally {
        this.loadingEbooks = false;
      }
    },
    viewCatalogue(catalogue) {
      console.log('Viewing catalogue:', catalogue);
      this.selectedCatalogue = catalogue;
      this.showModal = true;
      this.fetchCatalogueEbooks(catalogue.id);
    },
    closeModal() {
      this.showModal = false;
      this.selectedCatalogue = null;
      this.catalogueEbooks = [];
      this.loadingEbooks = false;
      this.error = false;
      this.errorMessage = '';
    },
    viewEbook(ebookId) {
      this.selectedEbookId = ebookId;
      this.showEbookModal = true;
    },
    closeEbookModal() {
      this.showEbookModal = false;
      this.selectedEbookId = null;
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
