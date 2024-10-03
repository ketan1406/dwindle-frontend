<template>
  <section class="py-16 bg-gray-100" id="features">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature Item 1 -->
        <div class="bg-white p-6 rounded shadow hover:shadow-lg transition duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <!-- SVG content -->
            </svg>
            <h3 class="text-xl font-semibold">Organize Books</h3>
          </div>
          <p class="text-gray-600">Keep track of all your digital books in one place.</p>
        </div>
        <!-- Feature Item 2 -->
        <div class="bg-white p-6 rounded shadow hover:shadow-lg transition duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <!-- SVG content -->
            </svg>
            <h3 class="text-xl font-semibold">Easy Search</h3>
          </div>
          <p class="text-gray-600">Find books quickly with our advanced search.</p>
        </div>
        <!-- Feature Item 3 -->
        <div class="bg-white p-6 rounded shadow hover:shadow-lg transition duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <!-- SVG content -->
            </svg>
            <h3 class="text-xl font-semibold">Cloud Sync</h3>
          </div>
          <p class="text-gray-600">Access your library from any device.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesSection',
};
</script>
