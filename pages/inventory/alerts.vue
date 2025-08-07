<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Alerts & Notifications
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Monitor your inventory and system alerts
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button variant="outline" @click="markAllAsRead">
                <Icon name="lucide:check" class="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" @click="loadAlerts">
                <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
                Refresh
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
                <Icon name="lucide:bell" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Alerts</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalAlerts }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:bell-ring" class="w-8 h-8 text-red-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Unread</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.unreadCount }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.lowStockAlerts }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:wifi-off" class="w-8 h-8 text-orange-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Sync Errors</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.syncErrors }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Filters -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label for="type-filter">Alert Type</Label>
              <Select v-model="filters.type" @update:model-value="filterAlerts">
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="sync_error">Sync Errors</SelectItem>
                  <SelectItem value="price_discrepancy">Price Issues</SelectItem>
                  <SelectItem value="new_order">New Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="severity-filter">Severity</Label>
              <Select v-model="filters.severity" @update:model-value="filterAlerts">
                <SelectTrigger>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="status-filter">Status</Label>
              <Select v-model="filters.status" @update:model-value="filterAlerts">
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="read">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="space-y-4">
        <div v-for="alert in filteredAlerts" :key="alert.id" 
             :class="[
               'bg-white shadow rounded-lg p-6 cursor-pointer transition-all hover:shadow-md',
               !alert.isRead ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-200'
             ]"
             @click="markAsRead(alert)">
          
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <!-- Alert Icon -->
              <div class="flex-shrink-0">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  getSeverityColors(alert.severity).bg
                ]">
                  <Icon :name="getAlertIcon(alert.type)" :class="[
                    'w-5 h-5',
                    getSeverityColors(alert.severity).text
                  ]" />
                </div>
              </div>

              <!-- Alert Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ alert.title }}
                  </h3>
                  <div class="flex items-center space-x-2">
                    <Badge :variant="getSeverityVariant(alert.severity)">
                      {{ alert.severity.toUpperCase() }}
                    </Badge>
                    <Badge v-if="!alert.isRead" variant="default" class="bg-blue-100 text-blue-800">
                      NEW
                    </Badge>
                  </div>
                </div>
                
                <p class="mt-2 text-gray-600">{{ alert.message }}</p>
                
                <!-- Alert Details -->
                <div class="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <Icon name="lucide:clock" class="w-4 h-4 mr-1" />
                    {{ formatDate(alert.createdAt) }}
                  </span>
                  <span v-if="alert.type === 'low_stock'" class="flex items-center">
                    <Icon name="lucide:package" class="w-4 h-4 mr-1" />
                    {{ alert.sku }} - Stock: {{ alert.currentStock }}
                  </span>
                  <span v-if="alert.platform" class="flex items-center">
                    <Icon name="lucide:globe" class="w-4 h-4 mr-1" />
                    {{ alert.platform.toUpperCase() }}
                  </span>
                </div>

                <!-- Action Buttons -->
                <div v-if="alert.type === 'low_stock'" class="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" @click.stop="viewProduct(alert.productId)">
                    <Icon name="lucide:eye" class="w-4 h-4 mr-1" />
                    View Product
                  </Button>
                  <Button size="sm" variant="outline" @click.stop="reorderProduct(alert.productId)">
                    <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-1" />
                    Reorder
                  </Button>
                </div>

                <div v-if="alert.type === 'new_order'" class="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" @click.stop="viewOrder(alert.orderId)">
                    <Icon name="lucide:eye" class="w-4 h-4 mr-1" />
                    View Order
                  </Button>
                  <span class="text-sm font-medium text-green-600">
                    ${{ alert.amount?.toFixed(2) }}
                  </span>
                </div>

                <div v-if="alert.type === 'sync_error'" class="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" @click.stop="retrySync(alert.platform)">
                    <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-1" />
                    Retry Sync
                  </Button>
                  <span class="text-sm text-gray-500">
                    Last sync: {{ formatDate(alert.lastSync) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAlerts.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <Icon name="lucide:bell-off" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p class="text-gray-500">All caught up! Check back later for new alerts.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mock user ID
const mockUserId = 'user_123'

// Reactive data
const alerts = ref([])
const filteredAlerts = ref([])
const stats = ref({
  totalAlerts: 0,
  unreadCount: 0,
  lowStockAlerts: 0,
  syncErrors: 0
})
const isLoading = ref(false)

// Filters
const filters = ref({
  type: 'all',
  severity: 'all',
  status: 'all'
})

// Load alerts on mount
onMounted(async () => {
  await loadAlerts()
})

// Functions
async function loadAlerts() {
  isLoading.value = true
  try {
    const response = await $fetch(`/api/inventory/alerts?userId=${mockUserId}`)
    if (response.success) {
      alerts.value = response.alerts
      stats.value = response.stats
      filterAlerts()
    }
  } catch (error) {
    console.error('Failed to load alerts:', error)
  } finally {
    isLoading.value = false
  }
}

function filterAlerts() {
  let filtered = [...alerts.value]

  if (filters.value.type !== 'all') {
    filtered = filtered.filter(a => a.type === filters.value.type)
  }

  if (filters.value.severity !== 'all') {
    filtered = filtered.filter(a => a.severity === filters.value.severity)
  }

  if (filters.value.status !== 'all') {
    if (filters.value.status === 'unread') {
      filtered = filtered.filter(a => !a.isRead)
    } else if (filters.value.status === 'read') {
      filtered = filtered.filter(a => a.isRead)
    }
  }

  // Sort by creation date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  filteredAlerts.value = filtered
}

function getAlertIcon(type) {
  const icons = {
    low_stock: 'lucide:alert-triangle',
    sync_error: 'lucide:wifi-off',
    price_discrepancy: 'lucide:dollar-sign',
    new_order: 'lucide:shopping-cart'
  }
  return icons[type] || 'lucide:bell'
}

function getSeverityColors(severity) {
  const colors = {
    high: { bg: 'bg-red-100', text: 'text-red-600' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    low: { bg: 'bg-blue-100', text: 'text-blue-600' },
    info: { bg: 'bg-gray-100', text: 'text-gray-600' }
  }
  return colors[severity] || colors.info
}

function getSeverityVariant(severity) {
  const variants = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
    info: 'outline'
  }
  return variants[severity] || 'outline'
}

function formatDate(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    return date.toLocaleDateString()
  }
}

async function markAsRead(alert) {
  if (!alert.isRead) {
    alert.isRead = true
    stats.value.unreadCount -= 1
    // TODO: Update in database
  }
}

async function markAllAsRead() {
  alerts.value.forEach(alert => {
    alert.isRead = true
  })
  stats.value.unreadCount = 0
  filterAlerts()
  // TODO: Update in database
}

function viewProduct(productId) {
  navigateTo(`/inventory/products?id=${productId}`)
}

function reorderProduct(productId) {
  console.log('Reordering product:', productId)
  // TODO: Implement reorder functionality
}

function viewOrder(orderId) {
  navigateTo(`/inventory/orders?id=${orderId}`)
}

async function retrySync(platform) {
  try {
    await $fetch('/api/integrations/sync', {
      method: 'POST',
      body: {
        userId: mockUserId,
        platforms: [platform]
      }
    })
    console.log(`Retrying sync for ${platform}`)
    // TODO: Show success message
  } catch (error) {
    console.error(`Sync retry failed for ${platform}:`, error)
  }
}

// Page meta
definePageMeta({
  layout: 'default'
})
</script>