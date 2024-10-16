<!-- src/views/AdminDashboard.vue -->

<template>
  <div class="container mx-auto py-10">
    <!-- DaisyUI Tabs with Radio Buttons -->
    <div role="tablist" class="tabs tabs-lifted custom-tabs">
      <!-- Tab 1: Ebooks -->
      <input
        type="radio"
        name="admin_tabs"
        id="tab-ebooks"
        class="hidden"
        v-model="activeTab"
        value="ebooks"
      />
      <label
        for="tab-ebooks"
        :class="[
          'tab',
          activeTab === 'ebooks' ? 'tab-active custom-active-tab' : 'custom-tab',
        ]"
        aria-label="Ebooks"
      >
        Ebooks
      </label>

      <!-- Tab 2: Catalogues -->
      <input
        type="radio"
        name="admin_tabs"
        id="tab-catalogues"
        class="hidden"
        v-model="activeTab"
        value="catalogues"
      />
      <label
        for="tab-catalogues"
        :class="[
          'tab',
          activeTab === 'catalogues' ? 'tab-active custom-active-tab' : 'custom-tab',
        ]"
        aria-label="Catalogues"
      >
        Catalogues
      </label>

      <!-- Tab 3: Requests -->
      <input
        type="radio"
        name="admin_tabs"
        id="tab-requests"
        class="hidden"
        v-model="activeTab"
        value="requests"
      />
      <label
        for="tab-requests"
        :class="[
          'tab',
          activeTab === 'requests' ? 'tab-active custom-active-tab' : 'custom-tab',
        ]"
        aria-label="Requests"
      >
        Requests
      </label>

      <!-- Tab 4: Stats -->
      <input
        type="radio"
        name="admin_tabs"
        id="tab-stats"
        class="hidden"
        v-model="activeTab"
        value="stats"
      />
      <label
        for="tab-stats"
        :class="[
          'tab',
          activeTab === 'stats' ? 'tab-active custom-active-tab' : 'custom-tab',
        ]"
        aria-label="Stats"
      >
        Statistics
      </label>
    </div>

    <!-- Tab Contents -->
    <div class="custom-tab-content bg-base-100 border-base-300 rounded-box p-6 mt-6">
      <div v-if="activeTab === 'ebooks'">
        <EbooksSection />
      </div>
      <div v-else-if="activeTab === 'catalogues'">
        <CataloguesSection />
      </div>
      <div v-else-if="activeTab === 'requests'">
        <RequestsSection />
      </div>
      <div v-else-if="activeTab === 'stats'">
        <StatsSection />
      </div>
    </div>
  </div>
</template>

<script>
import EbooksSection from '../components/EbooksSection.vue';
import CataloguesSection from '../components/CataloguesSection.vue';
import RequestsSection from '../components/RequestsSection.vue';
import StatsSection from '../components/StatsSection.vue';

export default {
  name: 'AdminDashboard',
  components: {
    EbooksSection,
    CataloguesSection,
    RequestsSection,
    StatsSection,
  },
  data() {
    return {
      activeTab: 'ebooks', // Default active tab
    };
  },
};
</script>
