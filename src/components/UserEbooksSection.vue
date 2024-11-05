<!-- src/components/UserEbooksSection.vue -->
<template>
  <!-- Ebooks Section -->
  <section class="container px-4 mx-auto my-8">
    <h2 class="text-2xl font-bold mb-4">Available Ebooks</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Ebook Card -->
      <div
        v-for="ebook in ebooks"
        :key="ebook.id"
        class="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800"
      >
        <div
          class="w-1/3 bg-cover"
          :style="{
            backgroundImage: `url(${defaultCoverImage})`,
          }"
        ></div>
        <div class="w-2/3 p-4 md:p-4">
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ ebook.title }}
          </h1>
          <!-- Optional: Add rating stars or any other info here -->
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
    </div>
  </section>

  <!-- Ebook Details Modal -->
  <EbookDetailsModal
    v-if="showModal"
    :ebookId="selectedEbookId"
    @close="closeModal"
  />
</template>

<script>
import { supabase } from '../supabase';
import EbookDetailsModal from './EbookDetailsModal.vue';

export default {
  name: 'UserEbooksSection',
  components: {
    EbookDetailsModal,
  },
  data() {
    return {
      ebooks: [],
      defaultCoverImage: 'https://via.placeholder.com/150', // Placeholder image URL
      showModal: false,
      selectedEbookId: null,
    };
  },
  methods: {
    async fetchEbooks() {
      try {
        const { data, error } = await supabase
          .from('ebooks')
          .select('id, title, file_url');

        if (error) throw error;

        this.ebooks = data.map((ebook) => ({
          ...ebook,
          coverImageUrl: this.defaultCoverImage,
        }));
      } catch (error) {
        console.error('Error fetching ebooks:', error.message);
      }
    },
    viewEbook(ebookId) {
      console.log('viewEbook called with ebookId:', ebookId);
      this.selectedEbookId = ebookId;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedEbookId = null;
    },
  },
  created() {
    this.fetchEbooks();
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
