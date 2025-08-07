<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-800">Multi-Platform Inventory Manager</h1>
          </div>
          <div class="flex items-center space-x-4">
            <Button variant="outline" @click="syncAllPlatforms">
              <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
              Sync All
            </Button>
            <Button>
              <Icon name="lucide:user" class="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Integration Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- eBay Integration -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <Icon name="lucide:shopping-bag" class="w-5 h-5 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">eBay</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ integrationStatus.ebay?.connected ? 'Connected' : 'Disconnected' }}
                  </dd>
                </dl>
              </div>
              <div class="flex-shrink-0">
                <Badge :variant="integrationStatus.ebay?.connected ? 'default' : 'destructive'">
                  {{ integrationStatus.ebay?.connected ? 'Active' : 'Inactive' }}
                </Badge>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-500">
                <span>Products: {{ integrationStatus.ebay?.productsCount || 0 }}</span>
                <span>API Calls: {{ integrationStatus.ebay?.apiCallsToday || 0 }}</span>
              </div>
              <div class="mt-2">
                <Button 
                  v-if="!integrationStatus.ebay?.connected" 
                  @click="connectEbay"
                  size="sm"
                  class="w-full"
                >
                  Connect eBay
                </Button>
                <Button 
                  v-else
                  @click="disconnectPlatform('ebay')"
                  variant="outline"
                  size="sm"
                  class="w-full"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- WooCommerce Integration -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
                  <Icon name="lucide:store" class="w-5 h-5 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">WooCommerce</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ integrationStatus.woocommerce?.connected ? 'Connected' : 'Disconnected' }}
                  </dd>
                </dl>
              </div>
              <div class="flex-shrink-0">
                <Badge :variant="integrationStatus.woocommerce?.connected ? 'default' : 'destructive'">
                  {{ integrationStatus.woocommerce?.connected ? 'Active' : 'Inactive' }}
                </Badge>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-500">
                <span>Products: {{ integrationStatus.woocommerce?.productsCount || 0 }}</span>
                <span>API Calls: {{ integrationStatus.woocommerce?.apiCallsToday || 0 }}</span>
              </div>
              <div class="mt-2">
                <Button 
                  v-if="!integrationStatus.woocommerce?.connected" 
                  @click="showWooCommerceModal = true"
                  size="sm"
                  class="w-full"
                >
                  Connect WooCommerce
                </Button>
                <Button 
                  v-else
                  @click="disconnectPlatform('woocommerce')"
                  variant="outline"
                  size="sm"
                  class="w-full"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Shopware Integration -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center">
                  <Icon name="lucide:shopping-cart" class="w-5 h-5 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Shopware</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ integrationStatus.shopware?.connected ? 'Connected' : 'Disconnected' }}
                  </dd>
                </dl>
              </div>
              <div class="flex-shrink-0">
                <Badge :variant="integrationStatus.shopware?.connected ? 'default' : 'destructive'">
                  {{ integrationStatus.shopware?.connected ? 'Active' : 'Inactive' }}
                </Badge>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-500">
                <span>Products: {{ integrationStatus.shopware?.productsCount || 0 }}</span>
                <span>API Calls: {{ integrationStatus.shopware?.apiCallsToday || 0 }}</span>
              </div>
              <div class="mt-2">
                <Button 
                  v-if="!integrationStatus.shopware?.connected" 
                  @click="showShopwareModal = true"
                  size="sm"
                  class="w-full"
                >
                  Connect Shopware
                </Button>
                <Button 
                  v-else
                  @click="disconnectPlatform('shopware')"
                  variant="outline"
                  size="sm"
                  class="w-full"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            All Products Across Platforms
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Unified view of your inventory across all connected platforms.
          </p>
        </div>
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sync
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in allProducts" :key="`${product.platform}-${product.id}`">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
                    <div class="text-sm text-gray-500">{{ product.category }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge :variant="getPlatformVariant(product.platform)">
                      {{ product.platform.toUpperCase() }}
                    </Badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ product.sku }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ product.price.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStockClass(product.quantity)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ product.quantity }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge :variant="getStatusVariant(product.status)">
                      {{ product.status }}
                    </Badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(product.lastSync) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- WooCommerce Connection Modal -->
    <Dialog v-model:open="showWooCommerceModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect WooCommerce Store</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="woo-url">Store URL</Label>
            <Input id="woo-url" v-model="wooCommerceForm.storeUrl" placeholder="https://yourstore.com" />
          </div>
          <div>
            <Label for="woo-key">Consumer Key</Label>
            <Input id="woo-key" v-model="wooCommerceForm.consumerKey" placeholder="ck_..." />
          </div>
          <div>
            <Label for="woo-secret">Consumer Secret</Label>
            <Input id="woo-secret" v-model="wooCommerceForm.consumerSecret" type="password" placeholder="cs_..." />
          </div>
          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="showWooCommerceModal = false">Cancel</Button>
            <Button @click="connectWooCommerce">Connect</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Shopware Connection Modal -->
    <Dialog v-model:open="showShopwareModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Shopware Store</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="shopware-url">Store URL</Label>
            <Input id="shopware-url" v-model="shopwareForm.storeUrl" placeholder="https://yourstore.com" />
          </div>
          <div>
            <Label for="shopware-token">Access Token</Label>
            <Input id="shopware-token" v-model="shopwareForm.accessToken" type="password" placeholder="SWSC..." />
          </div>
          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="showShopwareModal = false">Cancel</Button>
            <Button @click="connectShopware">Connect</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
// Mock user ID - will be replaced with real authentication
const mockUserId = 'user_123'

// Reactive data
const integrationStatus = ref({
  ebay: { connected: false, productsCount: 0, apiCallsToday: 0 },
  woocommerce: { connected: false, productsCount: 0, apiCallsToday: 0 },
  shopware: { connected: false, productsCount: 0, apiCallsToday: 0 }
})

const allProducts = ref([])
const isLoading = ref(false)
const showWooCommerceModal = ref(false)
const showShopwareModal = ref(false)

// Form data for connections
const wooCommerceForm = ref({
  storeUrl: '',
  consumerKey: '',
  consumerSecret: ''
})

const shopwareForm = ref({
  storeUrl: '',
  accessToken: ''
})

// Load integration status and products on mount
onMounted(async () => {
  await loadIntegrationStatus()
  await loadAllProducts()
})

// Functions
async function loadIntegrationStatus() {
  try {
    const response = await $fetch(`/api/integrations/status?userId=${mockUserId}`)
    if (response.success) {
      integrationStatus.value = response.data.platforms
    }
  } catch (error) {
    console.error('Failed to load integration status:', error)
  }
}

async function loadAllProducts() {
  isLoading.value = true
  try {
    const platforms = ['ebay', 'woocommerce', 'shopware']
    const products = []
    
    for (const platform of platforms) {
      try {
        const response = await $fetch(`/api/integrations/${platform}/products?userId=${mockUserId}`)
        if (response.success) {
          products.push(...response.products)
        }
      } catch (error) {
        console.warn(`Failed to load ${platform} products:`, error)
      }
    }
    
    allProducts.value = products
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    isLoading.value = false
  }
}

async function syncAllPlatforms() {
  try {
    const response = await $fetch('/api/integrations/sync', {
      method: 'POST',
      body: {
        userId: mockUserId,
        platforms: ['ebay', 'woocommerce', 'shopware']
      }
    })
    
    if (response.success) {
      await loadIntegrationStatus()
      await loadAllProducts()
      // TODO: Show success toast
    }
  } catch (error) {
    console.error('Sync failed:', error)
    // TODO: Show error toast
  }
}

function connectEbay() {
  // Redirect to eBay OAuth flow
  window.location.href = `/api/auth/ebay/connect?userId=${mockUserId}`
}

async function connectWooCommerce() {
  try {
    // TODO: Save WooCommerce credentials and test connection
    console.log('Connecting WooCommerce:', wooCommerceForm.value)
    showWooCommerceModal.value = false
    await loadIntegrationStatus()
  } catch (error) {
    console.error('WooCommerce connection failed:', error)
  }
}

async function connectShopware() {
  try {
    // TODO: Save Shopware credentials and test connection
    console.log('Connecting Shopware:', shopwareForm.value)
    showShopwareModal.value = false
    await loadIntegrationStatus()
  } catch (error) {
    console.error('Shopware connection failed:', error)
  }
}

async function disconnectPlatform(platform) {
  try {
    await $fetch('/api/integrations/disconnect', {
      method: 'POST',
      body: { userId: mockUserId, platform }
    })
    await loadIntegrationStatus()
  } catch (error) {
    console.error(`Failed to disconnect ${platform}:`, error)
  }
}

// Utility functions
function getPlatformVariant(platform) {
  const variants = {
    ebay: 'default',
    woocommerce: 'secondary',
    shopware: 'outline'
  }
  return variants[platform] || 'default'
}

function getStockClass(quantity) {
  if (quantity === 0) return 'bg-red-100 text-red-800'
  if (quantity < 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

function getStatusVariant(status) {
  const activeStatuses = ['active', 'publish', 'Active']
  return activeStatuses.includes(status) ? 'default' : 'secondary'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>