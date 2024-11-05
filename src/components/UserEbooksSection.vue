<!--  src/components/UserEbooksSections -->
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
              @click="viewEbook(ebook)"
              class="px-2 py-1 text-xs font-bold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-700 dark:focus:bg-gray-600"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Modal for Ebook Details -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div class="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-w-7xl mx-auto relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Modal Content -->
      <div v-if="loadingEbook" class="text-center">
        <span class="loading loading-bars loading-lg"></span>
      </div>
      <div v-else-if="error">
        <p class="text-center text-red-500">{{ errorMessage }}</p>
      </div>
      <div v-else>
        <h1 class="text-2xl font-bold mb-4">{{ selectedEbook.title }}</h1>
        <!-- Display authors and other details if needed -->
        <p class="mb-4">By: {{ selectedEbook.authors.join(', ') }}</p>
        <!-- PDF Viewer -->
        <!-- Use iframe for simplicity -->
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          width="100%"
          height="700px"
          style="border: none;"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'UserEbooksSection',
  data() {
    return {
      ebooks: [],
      defaultCoverImage: 'https://via.placeholder.com/150', // Placeholder image URL
      showModal: false,
      selectedEbook: null,
      loadingEbook: false,
      error: false,
      errorMessage: '',
      pdfUrl: '',
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
    async fetchEbookDetails(ebookId) {
      try {
        console.log('Fetching ebook with id:', ebookId);

        // Fetch ebook details
        const { data: ebookData, error } = await supabase
          .from('ebooks')
          .select('*')
          .eq('id', ebookId)
          .single();

        if (error) {
          console.error('Error fetching ebook data:', error.message);
          this.error = true;
          this.errorMessage = 'Failed to fetch ebook details.';
          return;
        }

        if (!ebookData) {
          console.error('No ebook data found for id:', ebookId);
          this.error = true;
          this.errorMessage = 'Ebook not found.';
          return;
        }

        console.log('Ebook data:', ebookData);
        this.selectedEbook = ebookData;

        // Generate a signed URL for the PDF file
        await this.getSignedUrl(ebookData.file_url);
      } catch (error) {
        console.error('Error fetching ebook:', error.message);
        this.error = true;
        this.errorMessage = 'An error occurred while fetching the ebook.';
      } finally {
        this.loadingEbook = false;
        console.log('fetchEbookDetails completed, loadingEbook set to false');
      }
    },
    async getSignedUrl(fileUrl) {
      try {
        console.log('Original fileUrl:', fileUrl);

        // Extract the relative file path from the full URL
        const url = new URL(fileUrl);
        const fullPath = url.pathname;

        // Remove the leading parts of the path to get the relative path
        const prefix = '/storage/v1/object/public/ebooks/';
        const filePath = fullPath.startsWith(prefix) ? fullPath.slice(prefix.length) : fullPath;

        console.log('Extracted filePath:', filePath);

        const { data, error } = await supabase.storage
          .from('ebooks')
          .createSignedUrl(filePath, 60 * 60); // URL valid for 1 hour

        if (error) {
          console.error('Error generating signed URL:', error.message);
          this.error = true;
          this.errorMessage = 'Failed to generate signed URL for the ebook.';
          return;
        }

        this.pdfUrl = data.signedUrl;
        console.log('Generated signed URL:', this.pdfUrl);
      } catch (error) {
        console.error('Error generating signed URL:', error.message);
        this.error = true;
        this.errorMessage = 'An error occurred while generating the ebook URL.';
      }
    },
    async viewEbook(ebook) {
      console.log('viewEbook called with ebook:', ebook);
      this.selectedEbook = ebook;
      this.showModal = true;
      this.loadingEbook = true;
      this.error = false;
      this.errorMessage = '';
      this.pdfUrl = '';

      await this.fetchEbookDetails(ebook.id);
    },
    closeModal() {
      this.showModal = false;
      this.selectedEbook = null;
      this.pdfUrl = '';
      this.error = false;
      this.errorMessage = '';
      this.loadingEbook = false;
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
