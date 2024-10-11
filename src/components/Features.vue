<template>
  <section class="py-16 bg-gray-100" id="features">
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature Item 1 -->
        <div class="card bg-white shadow hover:shadow-lg transition duration-300">
          <div class="card-body">
            <div class="flex items-center mb-4">
              <div class="text-primary mr-4">
                <!-- SVG Icon -->
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <!-- Example SVG content -->
                  <path d="M5 3v4h14V3H5zm0 6h14v4H5V9zm0 6h14v4H5v-4z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold">Organize Books</h3>
            </div>
            <p class="text-gray-600">Keep track of all your digital books in one place.</p>
          </div>
        </div>
        <!-- Feature Item 2 -->
        <div class="card bg-white shadow hover:shadow-lg transition duration-300">
          <div class="card-body">
            <div class="flex items-center mb-4">
              <div class="text-primary mr-4">
                <!-- SVG Icon -->
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <!-- Example SVG content -->
                  <path d="M10 2v2H3v2h7v2l3-3-3-3zm4 4v2h7v2h-7v2l-3-3 3-3zm-7 8v-2H3v-2h7v-2l3 3-3 3zm4 4v-2h7v-2h-7v-2l-3 3 3 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold">Easy Search</h3>
            </div>
            <p class="text-gray-600">Find books quickly with our advanced search.</p>
          </div>
        </div>
        <!-- Feature Item 3 -->
        <div class="card bg-white shadow hover:shadow-lg transition duration-300">
          <div class="card-body">
            <div class="flex items-center mb-4">
              <div class="text-primary mr-4">
                <!-- SVG Icon -->
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <!-- Example SVG content -->
                  <path d="M12 2a10 10 0 00-7.905 16.32l1.414-1.414A8 8 0 1120 12h2a10 10 0 00-10-10zm1 5h-2v6h6v-2h-4z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold">Cloud Sync</h3>
            </div>
            <p class="text-gray-600">Access your library from any device.</p>
          </div>
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
