<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Product Catalog
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Manage your inventory across all platforms
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button variant="outline" @click="showBarcodeScanner = true">
                <Icon name="lucide:scan-line" class="w-4 h-4 mr-2" />
                Scan Barcode
              </Button>
              <Button @click="showAddProductModal = true">
                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                Add Product
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
                <Icon name="lucide:package" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalProducts }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                  <dd class="text-lg font-medium text-gray-900">${{ stats.totalValue.toFixed(2) }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.lowStockItems }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:check-circle" class="w-8 h-8 text-green-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Products</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.activeProducts }}</dd>
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
              <Label for="search">Search Products</Label>
              <Input 
                id="search" 
                v-model="filters.search" 
                placeholder="Name, SKU, or brand..."
                @input="debouncedSearch"
              />
            </div>
            <div>
              <Label for="category">Category</Label>
              <Select v-model="filters.category" @update:model-value="loadProducts">
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="platform">Platform</Label>
              <Select v-model="filters.platform" @update:model-value="loadProducts">
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
            <div class="flex items-end">
              <Button 
                variant="outline" 
                class="w-full"
                @click="toggleLowStockFilter"
                :class="{ 'bg-yellow-50 border-yellow-200 text-yellow-800': filters.lowStock }"
              >
                <Icon name="lucide:alert-triangle" class="w-4 h-4 mr-2" />
                {{ filters.lowStock ? 'Show All' : 'Low Stock Only' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU/Barcode
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platforms
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      v-if="product.images && product.images[0]" 
                      :src="product.images[0]" 
                      :alt="product.name"
                      class="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                    <div class="h-10 w-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center" v-else>
                      <Icon name="lucide:package" class="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">{{ product.brand }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ product.sku }}</div>
                  <div class="text-sm text-gray-500" v-if="product.barcode">{{ product.barcode }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span :class="getStockClass(product.stockQuantity, product.reorderPoint)" 
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ product.stockQuantity }}
                    </span>
                    <Icon v-if="product.stockQuantity <= product.reorderPoint" 
                          name="lucide:alert-triangle" 
                          class="w-4 h-4 text-yellow-500 ml-2" />
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Reorder: {{ product.reorderPoint }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${{ product.price.toFixed(2) }}</div>
                  <div class="text-xs text-gray-500" v-if="product.costPrice">
                    Cost: ${{ product.costPrice.toFixed(2) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex space-x-1">
                    <Badge v-if="product.platforms.ebay?.active" variant="default" class="text-xs">eBay</Badge>
                    <Badge v-if="product.platforms.woocommerce?.active" variant="secondary" class="text-xs">WooCommerce</Badge>
                    <Badge v-if="product.platforms.shopware?.active" variant="outline" class="text-xs">Shopware</Badge>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ product.supplier }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <Button variant="ghost" size="sm" @click="editProduct(product)">
                      <Icon name="lucide:edit" class="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" @click="duplicateProduct(product)">
                      <Icon name="lucide:copy" class="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" @click="deleteProduct(product)" class="text-red-600">
                      <Icon name="lucide:trash" class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && products.length === 0" class="text-center py-12">
        <Icon name="lucide:package" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p class="text-gray-500 mb-6">Get started by adding your first product.</p>
        <Button @click="showAddProductModal = true">
          <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>

    <!-- Add Product Modal -->
    <Dialog v-model:open="showAddProductModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</DialogTitle>
        </DialogHeader>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <Label for="product-name">Product Name</Label>
            <Input id="product-name" v-model="productForm.name" placeholder="Enter product name" />
          </div>
          <div>
            <Label for="product-sku">SKU</Label>
            <Input id="product-sku" v-model="productForm.sku" placeholder="Product SKU" />
          </div>
          <div>
            <Label for="product-barcode">Barcode</Label>
            <Input id="product-barcode" v-model="productForm.barcode" placeholder="Barcode (optional)" />
          </div>
          <div>
            <Label for="product-price">Price ($)</Label>
            <Input id="product-price" v-model="productForm.price" type="number" step="0.01" />
          </div>
          <div>
            <Label for="product-cost">Cost Price ($)</Label>
            <Input id="product-cost" v-model="productForm.costPrice" type="number" step="0.01" />
          </div>
          <div>
            <Label for="product-stock">Stock Quantity</Label>
            <Input id="product-stock" v-model="productForm.stockQuantity" type="number" />
          </div>
          <div>
            <Label for="product-reorder">Reorder Point</Label>
            <Input id="product-reorder" v-model="productForm.reorderPoint" type="number" />
          </div>
          <div class="col-span-2">
            <Label for="product-description">Description</Label>
            <textarea id="product-description" v-model="productForm.description" 
                     class="w-full border rounded-md p-2" rows="3"></textarea>
          </div>
          <div>
            <Label for="product-category">Category</Label>
            <Select v-model="productForm.category">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                <SelectItem value="Home & Garden">Home & Garden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="product-supplier">Supplier</Label>
            <Input id="product-supplier" v-model="productForm.supplier" placeholder="Supplier name" />
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <Button variant="outline" @click="closeProductModal">Cancel</Button>
          <Button @click="saveProduct">{{ editingProduct ? 'Update' : 'Create' }} Product</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Barcode Scanner Modal -->
    <Dialog v-model:open="showBarcodeScanner">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Barcode Scanner</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="barcode-input">Enter Barcode</Label>
            <div class="flex space-x-2">
              <Input id="barcode-input" v-model="barcodeInput" placeholder="Scan or enter barcode" />
              <Button @click="lookupBarcode" :disabled="!barcodeInput">
                <Icon name="lucide:search" class="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div v-if="barcodeResult" class="p-4 border rounded-lg">
            <div v-if="barcodeResult.success" class="text-green-800 bg-green-50 p-3 rounded">
              <h4 class="font-medium">Product Found!</h4>
              <p>{{ barcodeResult.product.name }} ({{ barcodeResult.product.sku }})</p>
              <p>Stock: {{ barcodeResult.product.stockQuantity }}</p>
            </div>
            <div v-else class="text-red-800 bg-red-50 p-3 rounded">
              <h4 class="font-medium">Product Not Found</h4>
              <p>No product found with barcode: {{ barcodeResult.barcode }}</p>
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
const products = ref([])
const stats = ref({
  totalProducts: 0,
  totalValue: 0,
  lowStockItems: 0,
  activeProducts: 0
})
const isLoading = ref(false)
const showAddProductModal = ref(false)
const showBarcodeScanner = ref(false)
const editingProduct = ref(null)

// Filters
const filters = ref({
  search: '',
  category: 'all',
  platform: 'all',
  lowStock: false
})

// Form data
const productForm = ref({
  name: '',
  sku: '',
  barcode: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  costPrice: 0,
  stockQuantity: 0,
  reorderPoint: 10,
  supplier: ''
})

// Barcode scanner
const barcodeInput = ref('')
const barcodeResult = ref(null)

// Load products on mount
onMounted(async () => {
  await loadProducts()
})

// Functions
async function loadProducts() {
  isLoading.value = true
  try {
    const queryParams = new URLSearchParams({
      userId: mockUserId,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.category !== 'all' && { category: filters.value.category }),
      ...(filters.value.platform !== 'all' && { platform: filters.value.platform }),
      ...(filters.value.lowStock && { lowStock: 'true' })
    })

    const response = await $fetch(`/api/inventory/products?${queryParams}`)
    if (response.success) {
      products.value = response.products
      stats.value = response.stats
    }
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    isLoading.value = false
  }
}

// Debounced search
const debouncedSearch = debounce(loadProducts, 300)

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function toggleLowStockFilter() {
  filters.value.lowStock = !filters.value.lowStock
  loadProducts()
}

function getStockClass(current, reorder) {
  if (current === 0) return 'bg-red-100 text-red-800'
  if (current <= reorder) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = { ...product }
  showAddProductModal.value = true
}

function duplicateProduct(product) {
  editingProduct.value = null
  productForm.value = { 
    ...product, 
    id: undefined,
    sku: `${product.sku}-copy`,
    name: `${product.name} (Copy)`
  }
  showAddProductModal.value = true
}

async function deleteProduct(product) {
  if (confirm(`Are you sure you want to delete ${product.name}?`)) {
    try {
      await $fetch(`/api/inventory/products/${product.id}?userId=${mockUserId}`, {
        method: 'DELETE'
      })
      await loadProducts()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}

async function saveProduct() {
  try {
    if (editingProduct.value) {
      await $fetch(`/api/inventory/products/${editingProduct.value.id}`, {
        method: 'PUT',
        body: { userId: mockUserId, product: productForm.value }
      })
    } else {
      await $fetch('/api/inventory/products', {
        method: 'POST',
        body: { userId: mockUserId, product: productForm.value }
      })
    }
    closeProductModal()
    await loadProducts()
  } catch (error) {
    console.error('Save failed:', error)
  }
}

function closeProductModal() {
  showAddProductModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    sku: '',
    barcode: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    costPrice: 0,
    stockQuantity: 0,
    reorderPoint: 10,
    supplier: ''
  }
}

async function lookupBarcode() {
  if (!barcodeInput.value) return
  
  try {
    const response = await $fetch(`/api/inventory/barcode/${barcodeInput.value}?userId=${mockUserId}`)
    barcodeResult.value = response
  } catch (error) {
    console.error('Barcode lookup failed:', error)
    barcodeResult.value = { success: false, message: 'Lookup failed' }
  }
}

// Page meta
definePageMeta({
  layout: 'default'
})
</script>