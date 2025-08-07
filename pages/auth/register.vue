<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <div class="text-center mb-8">
        <Icon name="lucide:package" class="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
        <p class="mt-2 text-gray-600">Join the multi-platform inventory revolution</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <Label for="name">Full Name</Label>
          <Input 
            id="name" 
            v-model="form.name" 
            type="text" 
            required 
            placeholder="Enter your full name"
            :disabled="isLoading"
          />
        </div>

        <div>
          <Label for="email">Email Address</Label>
          <Input 
            id="email" 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </div>

        <div>
          <Label for="password">Password</Label>
          <Input 
            id="password" 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="Create a strong password (8+ characters)"
            :disabled="isLoading"
          />
        </div>

        <div>
          <Label for="plan">Plan</Label>
          <Select v-model="form.plan" :disabled="isLoading">
            <SelectTrigger>
              <SelectValue placeholder="Choose your plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free - 10 products</SelectItem>
              <SelectItem value="pro">Pro - Unlimited products ($29/month)</SelectItem>
              <SelectItem value="enterprise">Enterprise - Custom features ($99/month)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <Icon name="lucide:alert-circle" class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          class="w-full" 
          :disabled="isLoading"
        >
          <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 mr-2 animate-spin" />
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </Button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </NuxtLink>
        </p>
      </div>

      <!-- Features preview -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-4">What you'll get:</h3>
        <div class="space-y-2">
          <div class="flex items-center text-sm text-gray-600">
            <Icon name="lucide:check" class="w-4 h-4 text-green-500 mr-2" />
            Multi-platform integration (eBay, WooCommerce, Shopware)
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <Icon name="lucide:check" class="w-4 h-4 text-green-500 mr-2" />
            Crypto payment processing (BTC, ETH, USDT+)
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <Icon name="lucide:check" class="w-4 h-4 text-green-500 mr-2" />
            Real-time inventory sync & alerts
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <Icon name="lucide:check" class="w-4 h-4 text-green-500 mr-2" />
            Advanced analytics & reporting
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Form data
const form = ref({
  name: '',
  email: '',
  password: '',
  plan: 'free'
})

const isLoading = ref(false)
const error = ref('')

// Handle registration
async function handleRegister() {
  if (form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      // Store token in localStorage
      if (process.client) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }

      // Redirect to dashboard
      await navigateTo('/dashboard')
    }

  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Page meta
definePageMeta({
  layout: false
})
</script>