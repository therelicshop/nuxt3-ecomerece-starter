<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <Icon name="lucide:package" class="w-8 h-8 text-blue-600" />
            <h1 class="ml-2 text-xl font-bold text-gray-900">Multi-Platform Inventory</h1>
          </div>
          <div class="flex items-center space-x-4">
            <Button variant="ghost" @click="navigateTo('/auth/login')">Login</Button>
            <Button @click="navigateTo('/auth/register')">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Manage Your Inventory
          <span class="text-blue-600">Across All Platforms</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Unified inventory management for eBay, WooCommerce, and Shopware. 
          Accept crypto payments and manage everything from one dashboard.
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div class="rounded-md shadow">
            <Button size="lg" class="w-full" @click="navigateTo('/dashboard')">
              View Dashboard
            </Button>
          </div>
          <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Button variant="outline" size="lg" class="w-full">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="mt-20">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Multi-Platform Integration -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
              <Icon name="lucide:link" class="w-6 h-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Multi-Platform Integration</h3>
            <p class="mt-2 text-base text-gray-500">
              Connect eBay, WooCommerce, and Shopware accounts with OAuth 2.0 security.
            </p>
          </div>

          <!-- Crypto Payments -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
              <Icon name="lucide:bitcoin" class="w-6 h-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Crypto Payments</h3>
            <p class="mt-2 text-base text-gray-500">
              Accept BTC, ETH, USDT, SOL, and 6+ cryptocurrencies via NOWpayments.
            </p>
          </div>

          <!-- Real-time Sync -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
              <Icon name="lucide:refresh-cw" class="w-6 h-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Real-time Sync</h3>
            <p class="mt-2 text-base text-gray-500">
              Automatic inventory synchronization across all your selling platforms.
            </p>
          </div>

          <!-- Stock Management -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mx-auto">
              <Icon name="lucide:package-check" class="w-6 h-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Smart Stock Alerts</h3>
            <p class="mt-2 text-base text-gray-500">
              Get notified when stock is low and never miss a sale opportunity.
            </p>
          </div>

          <!-- Barcode Support -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
              <Icon name="lucide:scan-line" class="w-6 h-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Barcode Scanning</h3>
            <p class="mt-2 text-base text-gray-500">
              Quick product lookup and inventory updates with barcode scanning.
            </p>
          </div>

          <!-- Analytics -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
              <Icon name="lucide:bar-chart-3" class="w-6 h-6" />
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Sales Analytics</h3>
            <p class="mt-2 text-base text-gray-500">
              Track performance across platforms with detailed analytics and reports.
            </p>
          </div>
        </div>
      </div>

      <!-- Platform Logos -->
      <div class="mt-20">
        <h2 class="text-center text-lg font-semibold text-gray-600 mb-8">
          Integrated with leading e-commerce platforms
        </h2>
        <div class="flex justify-center items-center space-x-12 opacity-60">
          <div class="text-center">
            <div class="bg-blue-100 p-4 rounded-lg">
              <Icon name="lucide:shopping-bag" class="w-8 h-8 text-blue-600 mx-auto" />
            </div>
            <p class="mt-2 text-sm font-medium text-gray-600">eBay</p>
          </div>
          <div class="text-center">
            <div class="bg-purple-100 p-4 rounded-lg">
              <Icon name="lucide:store" class="w-8 h-8 text-purple-600 mx-auto" />
            </div>
            <p class="mt-2 text-sm font-medium text-gray-600">WooCommerce</p>
          </div>
          <div class="text-center">
            <div class="bg-orange-100 p-4 rounded-lg">
              <Icon name="lucide:shopping-cart" class="w-8 h-8 text-orange-600 mx-auto" />
            </div>
            <p class="mt-2 text-sm font-medium text-gray-600">Shopware</p>
          </div>
        </div>
      </div>

      <!-- Status Messages -->
      <div v-if="$route.query.ebay_connected" class="mt-8">
        <div v-if="$route.query.ebay_connected === 'success'" 
             class="rounded-md bg-green-50 p-4 max-w-md mx-auto">
          <div class="flex">
            <Icon name="lucide:check-circle" class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">
                eBay account connected successfully!
              </p>
            </div>
          </div>
        </div>
        <div v-else-if="$route.query.ebay_connected === 'error'" 
             class="rounded-md bg-red-50 p-4 max-w-md mx-auto">
          <div class="flex">
            <Icon name="lucide:x-circle" class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">
                Failed to connect eBay account. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: false
})
</script>