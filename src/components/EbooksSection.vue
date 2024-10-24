<!-- src/components/EbooksSection.vue -->

<template>
  <section class="container px-4 mx-auto">
    <div v-if="loading" class="text-center py-10">
      <!-- Loading Spinner -->
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else>
      <!-- Action Buttons Above the Table -->
      <div class="flex justify-between items-center mb-4">
        <!-- New Ebook Button -->
        <button @click="addNewEbook" class="btn btn-primary">
          New Ebook +
        </button>
        <!-- Delete Button -->
        <button @click="deleteSelectedEbooks" :disabled="selectedEbooks.length === 0" class="btn btn-danger">
          Delete
        </button>
      </div>

      <!-- Ebooks Table -->
      <div class="flex flex-col">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <!-- Table Head -->
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <!-- Select All Checkbox and Name Column -->
                    <th scope="col"
                      class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <div class="flex items-center gap-x-3">
                        <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
                          class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                        <span>Title</span>
                      </div>
                    </th>

                    <!-- Authors Column -->
                    <th scope="col"
                      class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Authors
                    </th>

                    <!-- Description Column -->
                    <th scope="col"
                      class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Description
                    </th>

                    <!-- Added By Column -->
                    <th scope="col"
                      class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Added By
                    </th>

                    <!-- Added On Column -->
                    <th scope="col"
                      class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Added On
                    </th>

                    <!-- Actions Column -->
                    <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <!-- Table Body -->
                <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  <!-- Display Ebooks if Available -->
                  <template v-if="ebooks.length > 0">
                    <tr v-for="ebook in ebooks" :key="ebook.id">
                      <!-- Checkbox and Name -->
                      <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        <div class="flex items-center gap-x-3">
                          <input type="checkbox" v-model="selectedEbooks" :value="ebook.id"
                            class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                          <span>{{ ebook.title }}</span>
                        </div>
                      </td>

                      <!-- Authors -->
                      <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {{ ebook.authors.join(', ') }}
                      </td>

                      <!-- Description -->
                      <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">

                        {{ truncateText(ebook.description, 50) }}

                      </td>

                      <!-- Added By -->
                      <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {{ ebook.added_by }}
                      </td>

                      <!-- Added On -->
                      <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {{ formatDate(ebook.added_on) }}
                      </td>

                      <!-- Actions -->
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div class="flex items-center gap-x-4">
                          <button @click="editEbook(ebook.id)"
                            class="text-blue-500 hover:text-blue-700 focus:outline-none">
                            Edit
                          </button>
                          <button @click="deleteEbook(ebook.id)"
                            class="text-red-500 hover:text-red-700 focus:outline-none">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </template>

                  <!-- Display "No Ebooks Available" if None -->
                  <tr v-else>
                    <td colspan="6" class="px-4 py-4 text-center text-gray-500 dark:text-gray-400 text-lg">
                      No Ebooks Available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6">
          <!-- Previous Button -->
          <button @click="prevPage" :disabled="currentPage === 1"
            class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>

            <span>Previous</span>
          </button>

          <!-- Page Numbers -->
          <div class="items-center hidden md:flex gap-x-3">
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
              'px-2 py-1 text-sm rounded-md',
              currentPage === page
                ? 'text-blue-500 bg-blue-100/60 dark:bg-gray-800'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
            ]">
              {{ page }}
            </button>
          </div>

          <!-- Next Button -->
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <span>Next</span>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
  <EbookModal v-if="showModal" :is-editing="isEditing" :ebook="selectedEbook" :userId="currentUserId"
    @close="closeModal" @save="handleSaveEbook" />
</template>

<script>
import { supabase } from '../supabase'; // Import Supabase client
import EbookModal from './EbookModal.vue';

export default {
  name: 'EbooksSection',
  components: {
    EbookModal, // Register the component here
  },
  data() {
    return {
      ebooks: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      totalEbooks: 0,
      totalPages: 1,
      sortOrder: 'asc',
      selectedEbooks: [], // For storing selected ebook IDs
      showModal: false,
      isEditing: false,
      selectedEbook: null,
      
      currentUserId: '', // Add this to store current user ID
    };
  },
  computed: {
    isAllSelected() {
      return this.selectedEbooks.length === this.ebooks.length && this.ebooks.length > 0;
    },
  },
  async created() {
    await this.fetchEbooks();
    this.setCurrentUserId();
  },
  methods: {
    async fetchEbooks() {
      this.loading = true;
      try {
        const from = (this.currentPage - 1) * this.pageSize;
        const to = from + this.pageSize - 1;

        const { data, error, count } = await supabase
          .from('ebooks')
          .select('*', { count: 'exact' })
          .order('title', { ascending: this.sortOrder === 'asc' })
          .range(from, to);
          
        this.ebooks = data;
        console.log('Fetched ebooks:', this.ebooks);

        if (error) throw error;

        this.ebooks = data;
        this.totalEbooks = count;
        this.totalPages = Math.ceil(count / this.pageSize);

        // Reset selected ebooks when data is fetched
        this.selectedEbooks = [];
      } catch (error) {
        console.error('Error fetching ebooks:', error.message);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    setCurrentUserId() {
      this.currentUserId = this.$store.state.user ? this.$store.state.user.id : '';
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchEbooks();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchEbooks();
      }
    },
    async goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        await this.fetchEbooks();
      }
    },
    async sortByName() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      await this.fetchEbooks();
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async deleteEbook(id) {
      if (confirm('Are you sure you want to delete this ebook?')) {
        try {
          const { error } = await supabase
            .from('ebooks')
            .delete()
            .eq('id', id);

          if (error) throw error;

          // Refresh the list
          await this.fetchEbooks();
        } catch (error) {
          console.error('Error deleting ebook:', error.message);
          alert('Error deleting ebook: ' + error.message);
        }
      }
    },
    addNewEbook() {
      this.isEditing = false;
      this.selectedEbook = null;
      this.showModal = true;
    },
    editEbook(ebookId) {
      this.isEditing = true;
      this.selectedEbook = this.ebooks.find((ebook) => ebook.id === ebookId);
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async handleSaveEbook(ebookData) {
      // Save the ebook data (insert or update)
      console.log('Ebook data saved:', ebookData);
      await this.fetchEbooks();
      this.showModal = false;
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedEbooks = this.ebooks.map((ebook) => ebook.id);
      } else {
        this.selectedEbooks = [];
      }
    },
    async deleteSelectedEbooks() {
      if (confirm('Are you sure you want to delete the selected ebooks?')) {
        try {
          const { error } = await supabase
            .from('ebooks')
            .delete()
            .in('id', this.selectedEbooks);

          if (error) throw error;

          // Refresh the list
          await this.fetchEbooks();
        } catch (error) {
          console.error('Error deleting ebooks:', error.message);
          alert('Error deleting ebooks: ' + error.message);
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
  watch: {
    '$store.state.user'(newUser) {
      this.currentUserId = newUser ? newUser.id : '';
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */

/* Loading Spinner Styles */
.loading-spinner {
  display: inline-block;
  width: 80px;
  height: 80px;
}

.loading-spinner:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #445760;
  border-color: #445760 transparent #445760 transparent;
  animation: loading-spinner 1.2s linear infinite;
}

@keyframes loading-spinner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
