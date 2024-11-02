<template>
  <div class="modal modal-open">
    <div class="modal-box w-11/12 max-w-5xl">
      <h3 class="text-lg font-bold">{{ catalogue ? 'Edit Catalogue' : 'New Catalogue' }}</h3>
      <div class="mt-4">
        <!-- Catalogue Name -->
        <div>
          <label for="name" class="block text-sm text-gray-500 dark:text-gray-300">Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            placeholder="Enter the catalogue name"
            class="mt-2 block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none"
          />
        </div>
        <!-- Catalogue Description -->
        <div class="mt-4">
          <label for="description" class="block text-sm text-gray-500 dark:text-gray-300">Description</label>
          <textarea
            v-model="description"
            placeholder="Enter description..."
            class="block mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          ></textarea>
          <p class="mt-3 text-xs text-gray-400 dark:text-gray-600">
            Provide a brief description of the catalogue.
          </p>
        </div>
        <!-- Drag and Drop Sections -->
        <div class="mt-6 flex flex-col md:flex-row md:space-x-6">
          <!-- Available Books -->
          <div class="flex-1">
            <h4 class="text-md font-semibold mb-2">Available Books</h4>
            <draggable
              v-model="availableBooks"
              group="books"
              item-key="id"
              class="p-4 border rounded-md min-h-[200px] bg-gray-50 dark:bg-gray-800"
            >
              <template #item="{ element }">
                <div
                  class="p-2 mb-2 bg-white rounded-md shadow-sm cursor-move dark:bg-gray-700"
                >
                  {{ element.title }}
                </div>
              </template>
            </draggable>
          </div>
          <!-- Books in Catalogue -->
          <div class="flex-1 mt-4 md:mt-0">
            <h4 class="text-md font-semibold mb-2">Books in Catalogue</h4>
            <draggable
              v-model="catalogueBooks"
              group="books"
              item-key="id"
              class="p-4 border rounded-md min-h-[200px] bg-gray-50 dark:bg-gray-800"
            >
              <template #item="{ element }">
                <div
                  class="p-2 mb-2 bg-white rounded-md shadow-sm cursor-move dark:bg-gray-700"
                >
                  {{ element.title }}
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
      <!-- Actions -->
      <div class="modal-action">
        <button @click="saveCatalogue" class="btn btn-primary">
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
import { supabase } from '../supabase';
import draggable from 'vuedraggable';

export default {
  name: 'CatalogueModal',
  components: {
    draggable,
  },
  props: {
    catalogue: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      name: '',
      description: '',
      availableBooks: [],
      catalogueBooks: [],
    };
  },
  methods: {
    async loadCatalogueData() {
      // Load all books
      const { data: allBooks, error: booksError } = await supabase
        .from('ebooks')
        .select('*');

      if (booksError) {
        console.error('Error fetching ebooks:', booksError.message);
        alert('Error fetching ebooks: ' + booksError.message);
        return;
      }

      if (this.catalogue) {
        // Editing existing catalogue
        this.name = this.catalogue.name;
        this.description = this.catalogue.description;

        // Fetch books in the catalogue
        const { data: catalogueBooksData, error: catalogueBooksError } = await supabase
          .from('ebook_sections')
          .select('ebook_id')
          .eq('section_id', this.catalogue.id);

        if (catalogueBooksError) {
          console.error('Error fetching catalogue books:', catalogueBooksError.message);
          alert('Error fetching catalogue books: ' + catalogueBooksError.message);
          return;
        }

        const catalogueBookIds = catalogueBooksData.map((item) => item.ebook_id);

        // Separate books into available and catalogue books
        this.catalogueBooks = allBooks.filter((book) => catalogueBookIds.includes(book.id));
        this.availableBooks = allBooks.filter((book) => !catalogueBookIds.includes(book.id));
      } else {
        // Creating new catalogue
        this.name = '';
        this.description = '';
        this.availableBooks = allBooks;
        this.catalogueBooks = [];
      }
    },
    async saveCatalogue() {
      // Validate inputs...
      if (!this.name.trim()) {
        alert('Name is required.');
        return;
      }

      try {
        let sectionId;

        if (this.catalogue) {
          // Update existing catalogue
          const { error: updateError } = await supabase
            .from('sections')
            .update({
              name: this.name,
              description: this.description,
            })
            .eq('id', this.catalogue.id);

          if (updateError) throw updateError;

          sectionId = this.catalogue.id;

          // Delete existing ebook_sections entries for this catalogue
          const { error: deleteError } = await supabase
            .from('ebook_sections')
            .delete()
            .eq('section_id', sectionId);

          if (deleteError) throw deleteError;
        } else {
          // Insert new catalogue
          const { data: insertData, error: insertError } = await supabase
            .from('sections')
            .insert({
              name: this.name,
              description: this.description,
            })
            .select();

          if (insertError) throw insertError;

          sectionId = insertData[0].id;
        }

        // Insert new ebook_sections entries
        const ebookSectionsData = this.catalogueBooks.map((book) => ({
          ebook_id: book.id,
          section_id: sectionId,
        }));

        if (ebookSectionsData.length > 0) {
          const { error: insertEbooksError } = await supabase
            .from('ebook_sections')
            .insert(ebookSectionsData);

          if (insertEbooksError) throw insertEbooksError;
        }

        // Notify parent component to refresh list
        this.$emit('save');
      } catch (error) {
        console.error('Error saving catalogue:', error.message);
        alert('Error saving catalogue: ' + error.message);
      }
    },
  },
  mounted() {
    this.loadCatalogueData();
  },
};
</script>


