<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Crypto Payments
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Accept cryptocurrencies with NOWpayments integration
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Button @click="showCreatePaymentModal = true">
                <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
                Create Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Supported Currencies -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          <Icon name="lucide:bitcoin" class="w-5 h-5 inline mr-2" />
          Supported Cryptocurrencies
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="currency in supportedCurrencies" :key="currency.code"
               class="flex items-center p-3 border rounded-lg">
            <div class="text-2xl mr-3">{{ currency.icon }}</div>
            <div>
              <div class="font-medium text-sm">{{ currency.name }}</div>
              <div class="text-xs text-gray-500">{{ currency.code }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Payments -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Recent Crypto Payments</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              <tr v-for="payment in recentPayments" :key="payment.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-gray-900">{{ payment.id.slice(-8) }}</div>
                  <div class="text-xs text-gray-500">{{ payment.nowpaymentsId.slice(-12) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">${{ payment.amount.toFixed(2) }}</div>
                  <div class="text-xs text-gray-500">{{ payment.cryptoAmount }} {{ payment.currency }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-lg mr-2">{{ getCurrencyIcon(payment.currency) }}</span>
                    <span class="text-sm font-medium">{{ payment.currency }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :variant="getStatusVariant(payment.status)">
                    {{ getStatusText(payment.status) }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(payment.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="ghost" size="sm" @click="viewPayment(payment)">
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-if="recentPayments.length === 0" class="text-center py-12">
          <Icon name="lucide:bitcoin" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No crypto payments yet</h3>
          <p class="text-gray-500 mb-6">Create your first crypto payment to get started.</p>
          <Button @click="showCreatePaymentModal = true">
            <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
            Create Payment
          </Button>
        </div>
      </div>
    </div>

    <!-- Create Payment Modal -->
    <Dialog v-model:open="showCreatePaymentModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Crypto Payment</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="createPayment" class="space-y-4">
          <div>
            <Label for="amount">Amount (USD)</Label>
            <Input 
              id="amount" 
              v-model.number="paymentForm.amount" 
              type="number" 
              step="0.01" 
              min="0.01" 
              required 
              placeholder="Enter amount in USD"
            />
          </div>
          
          <div>
            <Label for="crypto-currency">Cryptocurrency</Label>
            <Select v-model="paymentForm.cryptoCurrency" required>
              <SelectTrigger>
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="currency in supportedCurrencies" 
                           :key="currency.code" 
                           :value="currency.code">
                  <div class="flex items-center">
                    <span class="mr-2">{{ currency.icon }}</span>
                    {{ currency.name }} ({{ currency.code }})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="description">Description (Optional)</Label>
            <Input 
              id="description" 
              v-model="paymentForm.description" 
              placeholder="Payment description"
            />
          </div>

          <div v-if="isCreating" class="text-center py-4">
            <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-2" />
            <p class="text-sm text-gray-600">Creating payment...</p>
          </div>

          <div class="flex justify-end space-x-2">
            <Button variant="outline" type="button" @click="showCreatePaymentModal = false" :disabled="isCreating">
              Cancel
            </Button>
            <Button type="submit" :disabled="isCreating">
              Create Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Payment Details Modal -->
    <Dialog v-model:open="showPaymentModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div v-if="selectedPayment" class="space-y-6">
          <!-- Payment Status -->
          <div class="text-center">
            <Badge :variant="getStatusVariant(selectedPayment.status)" class="text-lg px-4 py-2">
              {{ getStatusText(selectedPayment.status) }}
            </Badge>
          </div>

          <!-- QR Code and Address -->
          <div class="text-center" v-if="selectedPayment.status === 'waiting'">
            <div class="bg-white p-4 rounded-lg border inline-block">
              <img :src="selectedPayment.qrCode" alt="Payment QR Code" class="w-48 h-48 mx-auto" />
            </div>
            <p class="mt-2 text-sm text-gray-600">Scan QR code or copy address below</p>
          </div>

          <!-- Payment Information -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 mb-3">Payment Details</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Amount:</span>
                  <span class="font-medium">${{ selectedPayment.amount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Crypto Amount:</span>
                  <span class="font-medium">{{ selectedPayment.cryptoAmount }} {{ selectedPayment.currency }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Currency:</span>
                  <span class="font-medium">
                    {{ getCurrencyIcon(selectedPayment.currency) }} {{ selectedPayment.currency }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Status:</span>
                  <Badge :variant="getStatusVariant(selectedPayment.status)">
                    {{ getStatusText(selectedPayment.status) }}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-medium text-gray-900 mb-3">Transaction Info</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Created:</span>
                  <span>{{ formatDate(selectedPayment.createdAt) }}</span>
                </div>
                <div class="flex justify-between" v-if="selectedPayment.expiresAt">
                  <span class="text-gray-500">Expires:</span>
                  <span>{{ formatDate(selectedPayment.expiresAt) }}</span>
                </div>
                <div class="flex justify-between" v-if="selectedPayment.confirmations">
                  <span class="text-gray-500">Confirmations:</span>
                  <span>{{ selectedPayment.confirmations }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Address -->
          <div v-if="selectedPayment.address">
            <Label>Payment Address</Label>
            <div class="flex mt-1">
              <Input 
                :value="selectedPayment.address" 
                readonly 
                class="font-mono text-sm"
              />
              <Button variant="outline" size="sm" @click="copyToClipboard(selectedPayment.address)" class="ml-2">
                <Icon name="lucide:copy" class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between">
            <div class="space-x-2">
              <Button variant="outline" @click="refreshPaymentStatus" :disabled="isRefreshing">
                <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" :class="{ 'animate-spin': isRefreshing }" />
                Refresh Status
              </Button>
              <Button variant="outline" @click="openExplorer" v-if="selectedPayment.explorerUrl !== '#'">
                <Icon name="lucide:external-link" class="w-4 h-4 mr-2" />
                View on Blockchain
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
// Mock data - will be replaced with real API calls
const supportedCurrencies = ref([
  { code: 'BTC', name: 'Bitcoin', icon: '₿' },
  { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { code: 'LTC', name: 'Litecoin', icon: 'Ł' },
  { code: 'XRP', name: 'Ripple', icon: 'XRP' },
  { code: 'USDTTRC20', name: 'USDT (TRC20)', icon: '₮' },
  { code: 'USDTERC20', name: 'USDT (ERC20)', icon: '₮' },
  { code: 'SOL', name: 'Solana', icon: '◎' },
  { code: 'TRX', name: 'TRON', icon: 'TRX' },
  { code: 'TON', name: 'Toncoin', icon: 'TON' }
])

const recentPayments = ref([
  {
    id: 'crypto_001',
    nowpaymentsId: 'np_payment_123456',
    amount: 99.99,
    cryptoAmount: 0.00234567,
    currency: 'BTC',
    status: 'confirmed',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    createdAt: '2025-01-24T10:30:00Z',
    expiresAt: '2025-01-24T11:30:00Z',
    confirmations: 3,
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    explorerUrl: 'https://blockstream.info/address/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  }
])

const showCreatePaymentModal = ref(false)
const showPaymentModal = ref(false)
const selectedPayment = ref(null)
const isCreating = ref(false)
const isRefreshing = ref(false)

const paymentForm = ref({
  amount: 0,
  cryptoCurrency: '',
  description: ''
})

// Functions
async function createPayment() {
  isCreating.value = true
  try {
    const response = await $fetch('/api/payments/crypto/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: {
        amount: paymentForm.value.amount,
        currency: 'USD',
        cryptoCurrency: paymentForm.value.cryptoCurrency,
        description: paymentForm.value.description
      }
    })

    if (response.success) {
      showCreatePaymentModal.value = false
      selectedPayment.value = response.payment
      showPaymentModal.value = true
      
      // Reset form
      paymentForm.value = {
        amount: 0,
        cryptoCurrency: '',
        description: ''
      }
      
      // TODO: Add to recent payments list
    }

  } catch (error) {
    console.error('Failed to create payment:', error)
    // TODO: Show error toast
  } finally {
    isCreating.value = false
  }
}

function viewPayment(payment) {
  selectedPayment.value = payment
  showPaymentModal.value = true
}

async function refreshPaymentStatus() {
  if (!selectedPayment.value) return
  
  isRefreshing.value = true
  try {
    const response = await $fetch(`/api/payments/crypto/status/${selectedPayment.value.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })

    if (response.success) {
      selectedPayment.value = response.payment
      // TODO: Update in recent payments list
    }

  } catch (error) {
    console.error('Failed to refresh payment status:', error)
  } finally {
    isRefreshing.value = false
  }
}

function getCurrencyIcon(currency) {
  const coin = supportedCurrencies.value.find(c => c.code === currency)
  return coin?.icon || currency
}

function getStatusText(status) {
  const statusMap = {
    'waiting': 'Waiting for Payment',
    'confirming': 'Confirming Payment',
    'confirmed': 'Payment Confirmed',
    'sending': 'Processing Payment',
    'partially_paid': 'Partially Paid',
    'failed': 'Payment Failed',
    'refunded': 'Refunded',
    'expired': 'Payment Expired'
  }
  return statusMap[status] || status
}

function getStatusVariant(status) {
  const variantMap = {
    'waiting': 'outline',
    'confirming': 'secondary',
    'confirmed': 'default',
    'sending': 'secondary',
    'partially_paid': 'destructive',
    'failed': 'destructive',
    'refunded': 'outline',
    'expired': 'destructive'
  }
  return variantMap[status] || 'outline'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

async function copyToClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    // TODO: Show success toast
  }
}

function openExplorer() {
  if (selectedPayment.value?.explorerUrl && selectedPayment.value.explorerUrl !== '#') {
    window.open(selectedPayment.value.explorerUrl, '_blank')
  }
}

// Page meta
definePageMeta({
  layout: 'default'
})
</script>