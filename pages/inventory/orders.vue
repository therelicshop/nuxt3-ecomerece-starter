<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Orders & Sales
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Track orders across all platforms
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button variant="outline">
                <Icon name="lucide:download" class="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
                Sync Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:shopping-cart" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalOrders }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:dollar-sign" class="w-8 h-8 text-green-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd class="text-lg font-medium text-gray-900">${{ stats.totalRevenue.toFixed(2) }}</dd>
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
                  <dd class="text-lg font-medium text-gray-900">${{ stats.averageOrderValue.toFixed(2) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:bitcoin" class="w-8 h-8 text-orange-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Crypto Orders</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.cryptoOrders }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label for="status-filter">Status</Label>
              <Select v-model="filters.status" @update:model-value="loadOrders">
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="platform-filter">Platform</Label>
              <Select v-model="filters.platform" @update:model-value="loadOrders">
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="ebay">eBay</SelectItem>
                  <SelectItem value="woocommerce">WooCommerce</SelectItem>
                  <SelectItem value="shopware">Shopware</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="date-filter">Date Range</Label>
              <Select v-model="filters.dateRange" @update:model-value="loadOrders">
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-end">
              <Button variant="outline" class="w-full" @click="resetFilters">
                <Icon name="lucide:x" class="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ order.orderNumber }}</div>
                    <div class="text-sm text-gray-500">{{ order.items.length }} items</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ order.customer.name }}</div>
                    <div class="text-sm text-gray-500">{{ order.customer.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :variant="getPlatformVariant(order.platform)">
                    {{ order.platform.toUpperCase() }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">${{ order.total.toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :variant="getStatusVariant(order.status)">
                    {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.paymentMethod }}</div>
                  <Badge v-if="order.paymentMethod.includes('Crypto')" variant="outline" class="mt-1">
                    <Icon name="lucide:bitcoin" class="w-3 h-3 mr-1" />
                    Crypto
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(order.orderDate) }}</div>
                  <div class="text-sm text-gray-500" v-if="order.trackingNumber">
                    Tracking: {{ order.trackingNumber }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <Button variant="ghost" size="sm" @click="viewOrder(order)">
                      <Icon name="lucide:eye" class="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" v-if="order.status === 'processing'" @click="markAsShipped(order)">
                      <Icon name="lucide:truck" class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Dialog v-model:open="showOrderModal">
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - {{ selectedOrder?.orderNumber }}</DialogTitle>
        </DialogHeader>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Order Summary -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Order Information</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-500">Order Number:</span>
                  <span class="font-medium">{{ selectedOrder.orderNumber }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Platform:</span>
                  <Badge :variant="getPlatformVariant(selectedOrder.platform)">
                    {{ selectedOrder.platform.toUpperCase() }}
                  </Badge>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Status:</span>
                  <Badge :variant="getStatusVariant(selectedOrder.status)">
                    {{ selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) }}
                  </Badge>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Order Date:</span>
                  <span>{{ formatDate(selectedOrder.orderDate) }}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-500">Name:</span>
                  <span class="font-medium">{{ selectedOrder.customer.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Email:</span>
                  <span>{{ selectedOrder.customer.email }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Address:</span>
                  <p class="text-sm mt-1">{{ selectedOrder.customer.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in selectedOrder.items" :key="item.productId">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ item.name }}</td>
                    <td class="px-4 py-2 text-sm text-gray-500">{{ item.sku }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ item.quantity }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">${{ item.price.toFixed(2) }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">${{ (item.quantity * item.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Totals -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>${{ selectedOrder.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax:</span>
                <span>${{ selectedOrder.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping:</span>
                <span>${{ selectedOrder.shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${{ selectedOrder.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
// Mock user ID
const mockUserId = 'user_123'

// Reactive data
const orders = ref([])
const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  cryptoOrders: 0
})
const isLoading = ref(false)
const showOrderModal = ref(false)
const selectedOrder = ref(null)

// Filters
const filters = ref({
  status: 'all',
  platform: 'all',
  dateRange: 'all'
})

// Load orders on mount
onMounted(async () => {
  await loadOrders()
})

// Functions
async function loadOrders() {
  isLoading.value = true
  try {
    const queryParams = new URLSearchParams({
      userId: mockUserId,
      ...(filters.value.status !== 'all' && { status: filters.value.status }),
      ...(filters.value.platform !== 'all' && { platform: filters.value.platform }),
      ...(filters.value.dateRange !== 'all' && { dateRange: filters.value.dateRange })
    })

    const response = await $fetch(`/api/inventory/orders?${queryParams}`)
    if (response.success) {
      orders.value = response.orders
      stats.value = response.stats
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    isLoading.value = false
  }
}

function resetFilters() {
  filters.value = {
    status: 'all',
    platform: 'all',
    dateRange: 'all'
  }
  loadOrders()
}

function getPlatformVariant(platform) {
  const variants = {
    ebay: 'default',
    woocommerce: 'secondary',
    shopware: 'outline'
  }
  return variants[platform] || 'default'
}

function getStatusVariant(status) {
  const variants = {
    pending: 'outline',
    processing: 'secondary',
    shipped: 'default',
    completed: 'default'
  }
  return variants[status] || 'outline'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function viewOrder(order) {
  selectedOrder.value = order
  showOrderModal.value = true
}

async function markAsShipped(order) {
  if (confirm(`Mark order ${order.orderNumber} as shipped?`)) {
    // TODO: Update order status
    console.log('Marking as shipped:', order.orderNumber)
    await loadOrders()
  }
}

// Page meta
definePageMeta({
  layout: 'default'
})
</script>