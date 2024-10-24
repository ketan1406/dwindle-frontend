<!-- src/components/EbookModal.vue -->

<template>
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="text-lg font-bold">{{ isEditing ? 'Edit Ebook' : 'New Ebook' }}</h3>
      <div>
        <label for="title" class="block text-sm text-gray-500 dark:text-gray-300">Title</label>
        <input v-model="title" type="text" id="title" placeholder="Enter the ebook title"
          class="mt-2 block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none" />
      </div>
      <div>
        <label for="authors" class="block text-sm text-gray-500 dark:text-gray-300">Authors</label>
        <div class="mt-2 flex flex-wrap gap-2">
          <div v-for="(author, index) in authors" :key="index" class="badge badge-info gap-2">
            {{ author }}
            <svg @click="removeAuthor(index)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-4 w-4 stroke-current cursor-pointer">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
        <input v-model="authorInput" @keyup.enter="addAuthor" type="text" placeholder="Add an author and press Enter"
          class="mt-2 block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none" />
      </div>
      <div>
        <label for="description" class="block text-sm text-gray-500 dark:text-gray-300">Description</label>
        <textarea v-model="description" placeholder="Enter description..."
          class="block mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"></textarea>
        <p class="mt-3 text-xs text-gray-400 dark:text-gray-600">
          Provide a brief description of the ebook.
        </p>
      </div>
      <div>
        <label for="file" class="block text-sm text-gray-500 dark:text-gray-300">File</label>
        <label for="file-upload"
          class="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl"
          :class="{ 'border-green-500': fileSelected }">
          <input id="file-upload" type="file" accept=".pdf" @change="handleFileUpload" class="hidden" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            :stroke="fileSelected ? 'green' : 'currentColor'" class="w-8 h-8 text-gray-500 dark:text-gray-400">
            <!-- SVG Path -->
          </svg>
          <h2 class="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
            {{ fileName || 'Upload or drag & drop your PDF file' }}
          </h2>
        </label>
      </div>
      <!-- Progress Bar -->
      <div v-if="isUploading" class="my-4 flex justify-center">
        <progress class="progress progress-accent w-56"></progress>
      </div>
      <!-- Actions -->
      <div class="modal-action">
        <button @click="saveEbook" :disabled="isUploading" class="btn btn-primary">
          Save Changes
        </button>
        <button @click="$emit('close')" class="btn">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Import Supabase client
import { supabase } from '../supabase';
import { toast } from 'vue3-toastify';

export default {
  name: 'EbookModal',
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    ebook: {
      type: Object,
      default: null,
    },
    userId: { // Define the userId prop
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: '',
      authors: [],
      authorInput: '',
      description: '',
      file: null,
      fileName: '',
      fileSelected: false,
      isUploading: false,
    };
  },
  methods: {
    addAuthor() {
      const trimmedInput = this.authorInput.trim();
      if (trimmedInput) {
        this.authors.push(trimmedInput);
        this.authorInput = '';
      }
    },
    removeAuthor(index) {
      this.authors.splice(index, 1);
    },
    async loadEbookData() {
      if (this.isEditing && this.ebook) {
        this.title = this.ebook.title || '';
        this.authors = [...this.ebook.authors]; // Ensure correct field name
        this.description = this.ebook.description || '';
        this.file_url = this.ebook.file_url || '';
      }
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.file = file;
        this.fileName = file.name;
        this.fileSelected = true;
      } else {
        toast.error('Please select a PDF file.');
        this.file = null;
        this.fileName = '';
        this.fileSelected = false;
      }
    },
    async saveEbook() {
      console.log('Save Ebook button clicked');

      // Validate inputs...
      if (!this.title.trim()) {
        console.log('Validation failed: Title is required.');
        toast.error('Title is required.');
        return;
      }

      if (this.authors.length === 0) {
        console.log('Validation failed: At least one author is required.');
        toast.error('At least one author is required.');
        return;
      }

      // Upload the PDF file to Supabase Storage
      let fileUrl = '';
      if (this.file) {
      //   const originalFileName = this.file.name;
      //   const sanitizedFileName = originalFileName
      //     .replace(/\s+/g, '_') // Replace spaces with underscores
      //     .replace(/[^\w\-\.]/g, ''); // Remove all non-word characters except dash and dot
        const filePath = `${this.file.name}`;
        this.isUploading = true;
        console.log('Uploading file to Supabase Storage:', filePath);
        const { error: fileError } = await supabase.storage
          .from('ebooks')
          .upload(filePath, this.file, {
            upsert: true,
          });

        if (fileError) {
          console.error('Error uploading file:', fileError.message);
          toast.error('Error uploading file: ' + fileError.message);
          this.isUploading = false;
          return;
        }

        // Get the public URL of the uploaded file
        const { data, error: urlError } = supabase.storage.from('ebooks').getPublicUrl(filePath);
        if (urlError) {
          console.error('Error getting public URL:', urlError.message);
          toast.error('Error getting public URL of the uploaded file.');
          this.isUploading = false; // Hide the progress bar
          return;
        }
        fileUrl = data.publicUrl;
        toast.success('File uploaded successfully.');
        console.log('File uploaded successfully. URL:', fileUrl);
        this.isUploading = false;
      }

      // Prepare ebook data
      const ebookData = {
        title: this.title,
        authors: this.authors, // Ensure 'authors' matches your Supabase schema
        description: this.description,
        file_url: fileUrl || this.ebook?.file_url || '',
        added_by: this.userId, // Use the correctly passed user ID
      };
      console.log('Prepared ebook data:', ebookData);

      try {
        if (this.isEditing && this.ebook) {
          console.log('Updating existing ebook with ID:', this.ebook.id);
          // Update existing ebook
          const { error } = await supabase
            .from('ebooks')
            .update(ebookData)
            .eq('id', this.ebook.id);

          if (error) {
            console.error('Error updating ebook:', error.message);
            toast.error('Error updating ebook: ' + error.message);
            return;
          }
        } else {
          console.log('Inserting new ebook');
          // Insert new ebook
          const { error } = await supabase
            .from('ebooks')
            .insert(ebookData);

          if (error) {
            console.error('Error inserting ebook:', error.message);
            toast.error('Error inserting ebook: ' + error.message);
            return;
          }
        }

        console.log('Ebook saved successfully.');
        toast.success('Ebook saved successfully.');
        // Emit the save event to refresh the ebooks list
        this.$emit('save');
      } catch (error) {
        console.error('Error saving ebook:', error.message);
        toast.error('Error saving ebook: ' + error.message);
      }
    },
  },
  mounted() {
    this.loadEbookData();
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
