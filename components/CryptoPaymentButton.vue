<template>
  <div>
    <!-- Payment Button -->
    <Button 
      @click="showPaymentModal = true"
      :disabled="disabled"
      :variant="variant"
      :size="size"
      class="relative"
    >
      <Icon name="lucide:bitcoin" class="w-4 h-4 mr-2" />
      {{ buttonText }}
    </Button>

    <!-- Payment Modal -->
    <Dialog v-model:open="showPaymentModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Pay with Cryptocurrency</DialogTitle>
          <DialogDescription>
            Choose your preferred cryptocurrency to complete the payment
          </DialogDescription>
        </DialogHeader>

        <!-- Amount Display -->
        <div class="text-center py-6 border rounded-lg bg-gray-50">
          <div class="text-3xl font-bold text-gray-900">${{ amount.toFixed(2) }}</div>
          <div class="text-sm text-gray-500">{{ description }}</div>
        </div>

        <!-- Currency Selection -->
        <div class="space-y-4">
          <Label>Select Cryptocurrency</Label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="currency in supportedCurrencies"
              :key="currency.code"
              @click="selectedCurrency = currency.code"
              :class="[
                'flex items-center p-3 border rounded-lg text-left transition-colors',
                selectedCurrency === currency.code 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <span class="text-xl mr-2">{{ currency.icon }}</span>
              <div>
                <div class="font-medium text-sm">{{ currency.code }}</div>
                <div class="text-xs text-gray-500">{{ currency.name }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Estimated Amount -->
        <div v-if="selectedCurrency && estimatedAmount" class="text-center text-sm text-gray-600">
          Estimated amount: {{ estimatedAmount }} {{ selectedCurrency }}
        </div>

        <!-- Loading State -->
        <div v-if="isProcessing" class="text-center py-4">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-2" />
          <p class="text-sm text-gray-600">Creating payment...</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showPaymentModal = false" :disabled="isProcessing">
            Cancel
          </Button>
          <Button @click="createPayment" :disabled="!selectedCurrency || isProcessing">
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Payment Processing Modal -->
    <Dialog v-model:open="showPaymentDetailsModal">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Send {{ paymentDetails?.cryptoAmount }} {{ paymentDetails?.currency }} to the address below
          </DialogDescription>
        </DialogHeader>

        <div v-if="paymentDetails" class="space-y-6">
          <!-- QR Code -->
          <div class="text-center">
            <div class="bg-white p-4 rounded-lg border inline-block">
              <img :src="paymentDetails.qrCode" alt="Payment QR Code" class="w-48 h-48" />
            </div>
            <p class="mt-2 text-sm text-gray-600">Scan with your {{ paymentDetails.currency }} wallet</p>
          </div>

          <!-- Payment Details -->
          <div class="space-y-3">
            <div>
              <Label>Amount to Send</Label>
              <div class="text-lg font-mono">
                {{ paymentDetails.cryptoAmount }} {{ paymentDetails.currency }}
              </div>
            </div>

            <div>
              <Label>Payment Address</Label>
              <div class="flex mt-1">
                <Input 
                  :value="paymentDetails.payAddress" 
                  readonly 
                  class="font-mono text-sm"
                />
                <Button variant="outline" size="sm" @click="copyAddress" class="ml-2">
                  <Icon name="lucide:copy" class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div class="text-sm text-gray-600">
              <Icon name="lucide:clock" class="w-4 h-4 inline mr-1" />
              Payment expires: {{ formatExpiryTime(paymentDetails.expiresAt) }}
            </div>
          </div>

          <!-- Status Check -->
          <div class="text-center">
            <Button variant="outline" @click="checkPaymentStatus" :disabled="isChecking">
              <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" :class="{ 'animate-spin': isChecking }" />
              Check Payment Status
            </Button>
          </div>

          <!-- Payment Instructions -->
          <div class="text-xs text-gray-500 space-y-1">
            <p>• Send the exact amount to complete the payment</p>
            <p>• Payment will be confirmed after network confirmations</p>
            <p>• Do not send from exchanges that don't support returns</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'Payment'
  },
  buttonText: {
    type: String,
    default: 'Pay with Crypto'
  },
  variant: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  onSuccess: {
    type: Function,
    default: () => {}
  },
  onError: {
    type: Function,
    default: () => {}
  }
})

// Reactive data
const showPaymentModal = ref(false)
const showPaymentDetailsModal = ref(false)
const selectedCurrency = ref('')
const estimatedAmount = ref(null)
const isProcessing = ref(false)
const isChecking = ref(false)
const paymentDetails = ref(null)

const supportedCurrencies = ref([
  { code: 'BTC', name: 'Bitcoin', icon: '₿' },
  { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { code: 'LTC', name: 'Litecoin', icon: 'Ł' },
  { code: 'USDTTRC20', name: 'USDT (TRC20)', icon: '₮' },
  { code: 'USDTERC20', name: 'USDT (ERC20)', icon: '₮' }
])

// Watch for currency selection to get estimate
watch(selectedCurrency, async (newCurrency) => {
  if (newCurrency) {
    // TODO: Get estimated amount from NOWpayments API
    // For now, show mock estimates
    const estimates = {
      'BTC': (props.amount / 50000).toFixed(8),
      'ETH': (props.amount / 3000).toFixed(6),
      'LTC': (props.amount / 100).toFixed(4),
      'USDTTRC20': props.amount.toFixed(2),
      'USDTERC20': props.amount.toFixed(2)
    }
    estimatedAmount.value = estimates[newCurrency] || '0'
  }
})

// Functions
async function createPayment() {
  if (!selectedCurrency.value) return

  isProcessing.value = true
  try {
    const response = await $fetch('/api/payments/crypto/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: {
        amount: props.amount,
        currency: 'USD',
        cryptoCurrency: selectedCurrency.value,
        description: props.description
      }
    })

    if (response.success) {
      paymentDetails.value = response.payment
      showPaymentModal.value = false
      showPaymentDetailsModal.value = true
      
      // Start checking payment status periodically
      startStatusChecking()
    }

  } catch (error) {
    console.error('Payment creation failed:', error)
    props.onError(error)
  } finally {
    isProcessing.value = false
  }
}

async function checkPaymentStatus() {
  if (!paymentDetails.value) return

  isChecking.value = true
  try {
    const response = await $fetch(`/api/payments/crypto/status/${paymentDetails.value.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })

    if (response.success) {
      paymentDetails.value = response.payment
      
      if (response.payment.status === 'confirmed') {
        showPaymentDetailsModal.value = false
        props.onSuccess(response.payment)
      }
    }

  } catch (error) {
    console.error('Status check failed:', error)
  } finally {
    isChecking.value = false
  }
}

async function copyAddress() {
  if (navigator.clipboard && paymentDetails.value?.payAddress) {
    await navigator.clipboard.writeText(paymentDetails.value.payAddress)
    // TODO: Show success toast
  }
}

function formatExpiryTime(expiryDate) {
  return new Date(expiryDate).toLocaleString()
}

function startStatusChecking() {
  // Check status every 30 seconds
  const interval = setInterval(async () => {
    if (!showPaymentDetailsModal.value) {
      clearInterval(interval)
      return
    }

    await checkPaymentStatus()
    
    if (paymentDetails.value?.status === 'confirmed') {
      clearInterval(interval)
    }
  }, 30000)
}
</script>