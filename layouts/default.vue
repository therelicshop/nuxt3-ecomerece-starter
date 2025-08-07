<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div class="flex items-center h-16 px-6 bg-blue-600">
        <Icon name="lucide:package" class="w-8 h-8 text-white" />
        <h1 class="ml-3 text-lg font-semibold text-white">Inventory Manager</h1>
      </div>
      
      <nav class="mt-8">
        <div class="px-6">
          <div class="space-y-1">
            <!-- Dashboard -->
            <NuxtLink
              to="/dashboard"
              class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Icon name="lucide:layout-dashboard" class="w-5 h-5 mr-3" />
              Dashboard
            </NuxtLink>

            <!-- Products -->
            <NuxtLink
              to="/inventory/products"
              class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.includes('/inventory/products') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Icon name="lucide:package" class="w-5 h-5 mr-3" />
              Products
            </NuxtLink>

            <!-- Orders -->
            <NuxtLink
              to="/inventory/orders"
              class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.includes('/inventory/orders') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Icon name="lucide:shopping-cart" class="w-5 h-5 mr-3" />
              Orders
            </NuxtLink>

            <!-- Suppliers -->
            <NuxtLink
              to="/inventory/suppliers"
              class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.includes('/inventory/suppliers') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Icon name="lucide:truck" class="w-5 h-5 mr-3" />
              Suppliers
            </NuxtLink>

            <!-- Analytics -->
            <NuxtLink
              to="/inventory/analytics"
              class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.includes('/inventory/analytics') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Icon name="lucide:bar-chart-3" class="w-5 h-5 mr-3" />
              Analytics
            </NuxtLink>

            <!-- Crypto Payments -->
            <NuxtLink
              to="/payments/crypto"
              class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.includes('/payments/crypto') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Icon name="lucide:bitcoin" class="w-5 h-5 mr-3" />
              Crypto Payments
            </NuxtLink>

            <!-- Alerts -->
            <NuxtLink
              to="/inventory/alerts"
              class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="$route.path.includes('/inventory/alerts') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Icon name="lucide:bell" class="w-5 h-5 mr-3" />
              Alerts
              <Badge v-if="alertCount > 0" variant="destructive" class="ml-auto">
                {{ alertCount }}
              </Badge>
            </NuxtLink>
          </div>
        </div>

        <div class="mt-8 px-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Integrations
          </h3>
          <div class="mt-2 space-y-1">
            <div class="flex items-center px-2 py-2 text-sm text-gray-600">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              eBay Connected
            </div>
            <div class="flex items-center px-2 py-2 text-sm text-gray-600">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              WooCommerce Connected
            </div>
            <div class="flex items-center px-2 py-2 text-sm text-gray-600">
              <div class="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              Shopware Disconnected
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="pl-64">
      <slot />
    </div>

    <!-- Mobile menu backdrop -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 lg:hidden" @click="mobileMenuOpen = false">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </div>
  </div>
</template>

<script setup>
const alertCount = ref(3) // Mock alert count
const mobileMenuOpen = ref(false)

// Load alert count
onMounted(async () => {
  try {
    const response = await $fetch('/api/inventory/alerts?userId=user_123')
    if (response.success) {
      alertCount.value = response.stats.unreadCount
    }
  } catch (error) {
    console.warn('Failed to load alert count:', error)
  }
})
</script>