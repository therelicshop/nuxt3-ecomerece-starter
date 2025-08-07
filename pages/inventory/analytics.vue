<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Analytics & Reports
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Insights into your inventory and sales performance
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Select v-model="selectedPeriod" @update:model-value="loadAnalytics">
                <SelectTrigger class="w-40">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Icon name="lucide:download" class="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:package" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.overview.totalProducts }}</dd>
                  <dt class="text-sm text-gray-500">Value: ${{ analytics.overview.totalValue.toFixed(2) }}</dt>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:shopping-cart" class="w-8 h-8 text-green-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.overview.totalOrders }}</dd>
                  <dt class="text-sm text-gray-500">Revenue: ${{ analytics.overview.totalRevenue.toFixed(2) }}</dt>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:trending-up" class="w-8 h-8 text-purple-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                  <dd class="text-lg font-medium text-gray-900">${{ analytics.overview.avgOrderValue.toFixed(2) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:alert-triangle" class="w-8 h-8 text-yellow-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Stock Issues</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.overview.lowStockItems + analytics.overview.outOfStockItems }}</dd>
                  <dt class="text-sm text-gray-500">Low: {{ analytics.overview.lowStockItems }}, Out: {{ analytics.overview.outOfStockItems }}</dt>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Over Time</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <Icon name="lucide:bar-chart" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">Revenue chart would be displayed here</p>
              <p class="text-sm text-gray-400 mt-2">
                Peak: ${{ Math.max(...analytics.revenueChart.map(d => d.revenue)).toFixed(2) }} |
                Avg: ${{ (analytics.revenueChart.reduce((sum, d) => sum + d.revenue, 0) / analytics.revenueChart.length).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Platform Distribution -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Sales by Platform</h3>
          <div class="space-y-4">
            <div v-for="platform in analytics.salesByPlatform" :key="platform.platform" 
                 class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" 
                     :class="getPlatformColor(platform.platform)"></div>
                <span class="text-sm font-medium text-gray-900">{{ platform.platform }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">${{ platform.revenue.toFixed(2) }}</div>
                  <div class="text-xs text-gray-500">{{ platform.orders }} orders</div>
                </div>
                <div class="w-20 bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all" 
                       :class="getPlatformColor(platform.platform)"
                       :style="{ width: `${platform.percentage}%` }"></div>
                </div>
                <span class="text-sm text-gray-500 w-12">{{ platform.percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products and Categories -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top Products -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
          <div class="space-y-4">
            <div v-for="(product, index) in analytics.topProducts" :key="product.id" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-sm font-bold text-blue-600">{{ index + 1 }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-xs text-gray-500">{{ product.sku }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">${{ product.revenue.toFixed(2) }}</div>
                <div class="text-xs text-gray-500">{{ product.unitsSold }} sold</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Categories by Value</h3>
          <div class="space-y-4">
            <div v-for="category in analytics.categoryBreakdown" :key="category.category" 
                 class="flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="lucide:tag" class="w-4 h-4 text-gray-400 mr-2" />
                <span class="text-sm font-medium text-gray-900">{{ category.category }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">${{ category.value.toFixed(2) }}</div>
                  <div class="text-xs text-gray-500">{{ category.products }} products</div>
                </div>
                <div class="w-20 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full transition-all" 
                       :style="{ width: `${category.percentage}%` }"></div>
                </div>
                <span class="text-sm text-gray-500 w-12">{{ category.percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods and Stock Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Payment Methods -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Payment Methods</h3>
            <Badge variant="outline" class="bg-green-50 text-green-700">
              <Icon name="lucide:bitcoin" class="w-3 h-3 mr-1" />
              Crypto Ready
            </Badge>
          </div>
          <div class="space-y-4">
            <div v-for="method in analytics.paymentMethods" :key="method.method" 
                 class="flex items-center justify-between">
              <div class="flex items-center">
                <Icon :name="getPaymentIcon(method.method)" class="w-4 h-4 text-gray-400 mr-2" />
                <span class="text-sm font-medium text-gray-900">{{ method.method }}</span>
                <Badge v-if="method.method === 'Crypto'" variant="outline" class="ml-2 text-xs">
                  BTC, ETH, USDT+
                </Badge>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">${{ method.revenue.toFixed(2) }}</div>
                  <div class="text-xs text-gray-500">{{ method.orders }} orders</div>
                </div>
                <div class="w-16 bg-gray-200 rounded-full h-2">
                  <div :class="getPaymentColor(method.method)" 
                       class="h-2 rounded-full transition-all" 
                       :style="{ width: `${method.percentage}%` }"></div>
                </div>
                <span class="text-sm text-gray-500 w-12">{{ method.percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock Status -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Stock Status Overview</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div class="flex items-center">
                <Icon name="lucide:x-circle" class="w-5 h-5 text-red-600 mr-3" />
                <span class="text-sm font-medium text-red-900">Critical (Out of Stock)</span>
              </div>
              <span class="text-lg font-bold text-red-600">{{ analytics.stockAlerts.critical }}</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div class="flex items-center">
                <Icon name="lucide:alert-triangle" class="w-5 h-5 text-yellow-600 mr-3" />
                <span class="text-sm font-medium text-yellow-900">Low Stock</span>
              </div>
              <span class="text-lg font-bold text-yellow-600">{{ analytics.stockAlerts.low }}</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div class="flex items-center">
                <Icon name="lucide:minus-circle" class="w-5 h-5 text-orange-600 mr-3" />
                <span class="text-sm font-medium text-orange-900">Medium Stock</span>
              </div>
              <span class="text-lg font-bold text-orange-600">{{ analytics.stockAlerts.medium }}</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div class="flex items-center">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-600 mr-3" />
                <span class="text-sm font-medium text-green-900">Good Stock</span>
              </div>
              <span class="text-lg font-bold text-green-600">{{ analytics.stockAlerts.good }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mock user ID
const mockUserId = 'user_123'

// Reactive data
const analytics = ref({
  overview: {},
  salesByPlatform: [],
  revenueChart: [],
  topProducts: [],
  categoryBreakdown: [],
  paymentMethods: [],
  stockAlerts: {}
})
const selectedPeriod = ref('30d')
const isLoading = ref(false)

// Load analytics on mount
onMounted(async () => {
  await loadAnalytics()
})

// Functions
async function loadAnalytics() {
  isLoading.value = true
  try {
    const response = await $fetch(`/api/inventory/analytics?userId=${mockUserId}&period=${selectedPeriod.value}`)
    if (response.success) {
      analytics.value = response.analytics
    }
  } catch (error) {
    console.error('Failed to load analytics:', error)
  } finally {
    isLoading.value = false
  }
}

function getPlatformColor(platform) {
  const colors = {
    eBay: 'bg-blue-500',
    WooCommerce: 'bg-purple-500',
    Shopware: 'bg-orange-500'
  }
  return colors[platform] || 'bg-gray-500'
}

function getPaymentIcon(method) {
  const icons = {
    'Credit Card': 'lucide:credit-card',
    'PayPal': 'lucide:wallet',
    'Crypto': 'lucide:bitcoin',
    'Bank Transfer': 'lucide:bank'
  }
  return icons[method] || 'lucide:credit-card'
}

function getPaymentColor(method) {
  const colors = {
    'Credit Card': 'bg-blue-500',
    'PayPal': 'bg-blue-600',
    'Crypto': 'bg-orange-500',
    'Bank Transfer': 'bg-gray-500'
  }
  return colors[method] || 'bg-gray-500'
}

// Page meta
definePageMeta({
  layout: 'default'
})
</script>