<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Supplier Management
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Manage your vendors and suppliers
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button variant="outline">
                <Icon name="lucide:download" class="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button @click="showAddSupplierModal = true">
                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                Add Supplier
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
                <Icon name="lucide:truck" class="w-8 h-8 text-blue-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Suppliers</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalSuppliers }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Suppliers</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.activeSuppliers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:dollar-sign" class="w-8 h-8 text-purple-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Spent</dt>
                  <dd class="text-lg font-medium text-gray-900">${{ stats.totalSpent.toLocaleString() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="lucide:star" class="w-8 h-8 text-yellow-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.averageRating.toFixed(1) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suppliers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="supplier in suppliers" :key="supplier.id" class="bg-white shadow rounded-lg p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">{{ supplier.name }}</h3>
              <p class="text-sm text-gray-500">{{ supplier.contactPerson }}</p>
            </div>
            <Badge :variant="supplier.status === 'active' ? 'default' : 'outline'">
              {{ supplier.status }}
            </Badge>
          </div>

          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm text-gray-500">
              <Icon name="lucide:mail" class="w-4 h-4 mr-2" />
              {{ supplier.email }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <Icon name="lucide:phone" class="w-4 h-4 mr-2" />
              {{ supplier.phone }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <Icon name="lucide:map-pin" class="w-4 h-4 mr-2" />
              {{ supplier.address.city }}, {{ supplier.address.state }}
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Orders:</span>
                <span class="font-medium ml-1">{{ supplier.totalOrders }}</span>
              </div>
              <div>
                <span class="text-gray-500">Spent:</span>
                <span class="font-medium ml-1">${{ supplier.totalSpent.toLocaleString() }}</span>
              </div>
              <div>
                <span class="text-gray-500">Rating:</span>
                <div class="flex items-center ml-1">
                  <div class="flex">
                    <Icon 
                      v-for="i in 5" 
                      :key="i" 
                      name="lucide:star" 
                      :class="i <= supplier.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                      class="w-4 h-4"
                    />
                  </div>
                  <span class="text-xs text-gray-500 ml-1">{{ supplier.rating }}</span>
                </div>
              </div>
              <div>
                <span class="text-gray-500">Payment:</span>
                <span class="font-medium ml-1">{{ supplier.paymentTerms }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex flex-wrap gap-1 mb-3">
              <Badge v-for="category in supplier.categories" :key="category" variant="outline" class="text-xs">
                {{ category }}
              </Badge>
            </div>
            <div class="flex space-x-2">
              <Button variant="outline" size="sm" class="flex-1" @click="viewSupplier(supplier)">
                <Icon name="lucide:eye" class="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" class="flex-1" @click="editSupplier(supplier)">
                <Icon name="lucide:edit" class="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          <div v-if="supplier.lastOrderDate" class="mt-2 text-xs text-gray-500">
            Last order: {{ formatDate(supplier.lastOrderDate) }}
          </div>
        </div>

        <!-- Add Supplier Card -->
        <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 cursor-pointer"
             @click="showAddSupplierModal = true">
          <Icon name="lucide:plus" class="w-12 h-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Add New Supplier</h3>
          <p class="text-sm text-gray-500">Start working with a new supplier</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Supplier Modal -->
    <Dialog v-model:open="showAddSupplierModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{ editingSupplier ? 'Edit Supplier' : 'Add New Supplier' }}</DialogTitle>
        </DialogHeader>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <Label for="supplier-name">Company Name</Label>
            <Input id="supplier-name" v-model="supplierForm.name" placeholder="Enter company name" />
          </div>
          <div>
            <Label for="contact-person">Contact Person</Label>
            <Input id="contact-person" v-model="supplierForm.contactPerson" placeholder="Contact person" />
          </div>
          <div>
            <Label for="supplier-email">Email</Label>
            <Input id="supplier-email" v-model="supplierForm.email" type="email" placeholder="email@company.com" />
          </div>
          <div>
            <Label for="supplier-phone">Phone</Label>
            <Input id="supplier-phone" v-model="supplierForm.phone" placeholder="+1-555-0123" />
          </div>
          <div>
            <Label for="payment-terms">Payment Terms</Label>
            <Select v-model="supplierForm.paymentTerms">
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Prepaid">Prepaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="col-span-2">
            <Label for="supplier-address">Address</Label>
            <Input id="supplier-address" v-model="supplierForm.address.street" placeholder="Street address" class="mb-2" />
            <div class="grid grid-cols-3 gap-2">
              <Input v-model="supplierForm.address.city" placeholder="City" />
              <Input v-model="supplierForm.address.state" placeholder="State" />
              <Input v-model="supplierForm.address.zipCode" placeholder="ZIP" />
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <Button variant="outline" @click="closeSupplierModal">Cancel</Button>
          <Button @click="saveSupplier">{{ editingSupplier ? 'Update' : 'Create' }} Supplier</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- View Supplier Modal -->
    <Dialog v-model:open="showViewSupplierModal">
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{{ selectedSupplier?.name }}</DialogTitle>
        </DialogHeader>
        <div v-if="selectedSupplier" class="space-y-6">
          <!-- Supplier Details -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
              <div class="space-y-2">
                <div><span class="text-gray-500">Contact Person:</span> {{ selectedSupplier.contactPerson }}</div>
                <div><span class="text-gray-500">Email:</span> {{ selectedSupplier.email }}</div>
                <div><span class="text-gray-500">Phone:</span> {{ selectedSupplier.phone }}</div>
                <div><span class="text-gray-500">Payment Terms:</span> {{ selectedSupplier.paymentTerms }}</div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Performance</h3>
              <div class="space-y-2">
                <div><span class="text-gray-500">Total Orders:</span> {{ selectedSupplier.totalOrders }}</div>
                <div><span class="text-gray-500">Total Spent:</span> ${{ selectedSupplier.totalSpent.toLocaleString() }}</div>
                <div><span class="text-gray-500">Rating:</span> {{ selectedSupplier.rating }}/5</div>
                <div><span class="text-gray-500">Last Order:</span> {{ formatDate(selectedSupplier.lastOrderDate) }}</div>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Address</h3>
            <p class="text-gray-600">
              {{ selectedSupplier.address.street }}<br>
              {{ selectedSupplier.address.city }}, {{ selectedSupplier.address.state }} {{ selectedSupplier.address.zipCode }}<br>
              {{ selectedSupplier.address.country }}
            </p>
          </div>

          <!-- Categories -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Categories</h3>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="category in selectedSupplier.categories" :key="category" variant="outline">
                {{ category }}
              </Badge>
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
const suppliers = ref([])
const stats = ref({
  totalSuppliers: 0,
  activeSuppliers: 0,
  totalSpent: 0,
  averageRating: 0
})
const isLoading = ref(false)
const showAddSupplierModal = ref(false)
const showViewSupplierModal = ref(false)
const editingSupplier = ref(null)
const selectedSupplier = ref(null)

// Form data
const supplierForm = ref({
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  paymentTerms: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  }
})

// Load suppliers on mount
onMounted(async () => {
  await loadSuppliers()
})

// Functions
async function loadSuppliers() {
  isLoading.value = true
  try {
    const response = await $fetch(`/api/inventory/suppliers?userId=${mockUserId}`)
    if (response.success) {
      suppliers.value = response.suppliers
      stats.value = response.stats
    }
  } catch (error) {
    console.error('Failed to load suppliers:', error)
  } finally {
    isLoading.value = false
  }
}

function viewSupplier(supplier) {
  selectedSupplier.value = supplier
  showViewSupplierModal.value = true
}

function editSupplier(supplier) {
  editingSupplier.value = supplier
  supplierForm.value = { ...supplier }
  showAddSupplierModal.value = true
}

async function saveSupplier() {
  try {
    // TODO: Save supplier to database
    console.log('Saving supplier:', supplierForm.value)
    closeSupplierModal()
    await loadSuppliers()
  } catch (error) {
    console.error('Save failed:', error)
  }
}

function closeSupplierModal() {
  showAddSupplierModal.value = false
  editingSupplier.value = null
  supplierForm.value = {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    paymentTerms: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

// Page meta
definePageMeta({
  layout: 'default'
})
</script>