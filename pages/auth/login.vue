<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <div class="text-center mb-8">
        <Icon name="lucide:package" class="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p class="mt-2 text-gray-600">Sign in to your inventory dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
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
            placeholder="Enter your password"
            :disabled="isLoading"
          />
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
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </Button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
            Create one now
          </NuxtLink>
        </p>
      </div>

      <!-- Demo credentials -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-2">Quick Demo</h3>
        <p class="text-xs text-gray-500 mb-3">Use these credentials to explore the platform:</p>
        <div class="bg-gray-50 p-3 rounded-md text-xs space-y-1">
          <div><strong>Email:</strong> demo@inventorymanager.com</div>
          <div><strong>Password:</strong> demo123456</div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          class="w-full mt-3" 
          @click="fillDemoCredentials"
          :disabled="isLoading"
        >
          Use Demo Account
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Form data
const form = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

// Handle login
async function handleLogin() {
  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
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
    error.value = err.data?.statusMessage || 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}

// Fill demo credentials
function fillDemoCredentials() {
  form.value.email = 'demo@inventorymanager.com'
  form.value.password = 'demo123456'
}

// Page meta
definePageMeta({
  layout: false
})
</script>