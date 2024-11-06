<!-- src/components/EbookDetailsModal.vue -->
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
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
        <h1 class="text-2xl font-bold mb-4">{{ ebook.title }}</h1>
        <!-- Display authors and other details if needed -->
        <p class="mb-4">By: {{ ebook.authors.join(', ') }}</p>
        <!-- PDF Viewer -->
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          width="100%"
          height="600px"
          style="border: none;"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'EbookDetailsModal',
  props: {
    ebookId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ebook: null,
      loadingEbook: true,
      error: false,
      errorMessage: '',
      pdfUrl: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchEbookDetails() {
      try {
        console.log('Fetching ebook with id:', this.ebookId);

        // Fetch ebook details
        const { data: ebookData, error } = await supabase
          .from('ebooks')
          .select('*')
          .eq('id', this.ebookId)
          .single();

        if (error) {
          throw new Error('Failed to fetch ebook details: ' + error.message);
        }

        if (!ebookData) {
          throw new Error('Ebook not found.');
        }

        console.log('Ebook data:', ebookData);
        this.ebook = ebookData;

        // Generate a signed URL for the PDF file
        await this.getSignedUrl(ebookData.file_url);
      } catch (error) {
        console.error('Error in fetchEbookDetails:', error.message);
        this.error = true;
        this.errorMessage = error.message;
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
          throw new Error('Failed to generate signed URL: ' + error.message);
        }

        this.pdfUrl = data.signedUrl;
        console.log('Generated signed URL:', this.pdfUrl);
      } catch (error) {
        console.error('Error in getSignedUrl:', error.message);
        this.error = true;
        this.errorMessage = error.message;
      }
    },
  },
  watch: {
    ebookId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadingEbook = true;
          this.error = false;
          this.errorMessage = '';
          this.pdfUrl = '';
          this.fetchEbookDetails();
        }
      },
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
