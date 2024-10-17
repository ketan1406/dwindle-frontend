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
      <!-- Actions -->
      <div class="modal-action">
        <button @click="saveEbook" class="btn btn-primary">
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
    // Load existing ebook data when editing
    async loadEbookData() {
      if (this.isEditing && this.ebook) {
        this.title = this.ebook.title || '';
        this.authors = [...this.ebook.author]; // Assuming 'author' is the array field
        this.description = this.ebook.description || '';
      }
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.file = file;
        this.fileName = file.name;
        this.fileSelected = true;
      } else {
        alert('Please select a PDF file.');
        this.file = null;
        this.fileName = '';
        this.fileSelected = false;
      }
    },
    async saveEbook() {
      // Validate inputs...
      if (!this.title.trim()) {
        alert('Title is required.');
        return;
      }

      // Upload the PDF file to Supabase Storage
      let fileUrl = '';
      if (this.file) {
        const filePath = `ebooks/${this.file.name}`;
        const { error: fileError } = await supabase.storage
          .from('ebooks')
          .upload(filePath, this.file, {
            upsert: true,
          });

        if (fileError) {
          console.error('Error uploading file:', fileError.message);
          alert('Error uploading file: ' + fileError.message);
          return;
        }

        // Get the public URL of the uploaded file
        fileUrl = supabase.storage.from('ebooks').getPublicUrl(filePath).data.publicUrl;
      }

      // Prepare ebook data
      const ebookData = {
        title: this.title,
        author: this.authors,
        description: this.description,
        file_url: fileUrl,
        added_by: this.userId, // You need to pass the user ID
      };

      try {
        if (this.isEditing && this.ebook) {
          // Update existing ebook
          const { error } = await supabase
            .from('ebooks')
            .update(ebookData)
            .eq('id', this.ebook.id);

          if (error) {
            console.error('Error updating ebook:', error.message);
            alert('Error updating ebook: ' + error.message);
            return;
          }
        } else {
          // Insert new ebook
          const { error } = await supabase
            .from('ebooks')
            .insert(ebookData);

          if (error) {
            console.error('Error inserting ebook:', error.message);
            alert('Error inserting ebook: ' + error.message);
            return;
          }
        }

        // Emit the save event to refresh the ebooks list
        this.$emit('save');
      } catch (error) {
        console.error('Error saving ebook:', error.message);
        alert('Error saving ebook: ' + error.message);
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
