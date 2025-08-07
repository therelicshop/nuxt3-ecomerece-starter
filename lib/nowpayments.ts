// NOWpayments API Integration
// Supports: BTC, LTC, ETH, XRP, USDT (TRC20/ERC20), SOL, TRX, TON

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1'
const API_KEY = process.env.NOWPAYMENTS_API_KEY
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET

export interface CreatePaymentRequest {
  price_amount: number
  price_currency: string // USD, EUR, etc.
  pay_currency: string // BTC, ETH, USDT, etc.
  order_id?: string
  order_description?: string
  ipn_callback_url?: string
  success_url?: string
  cancel_url?: string
}

export interface PaymentResponse {
  payment_id: string
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id: string
  order_description: string
  purchase_id: string
  created_at: string
  updated_at: string
  expiration_estimate_date: string
}

export interface PaymentStatus {
  payment_id: string
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  actually_paid: number
  outcome_amount: number
  outcome_currency: string
  order_id: string
  order_description: string
  purchase_id: string
  created_at: string
  updated_at: string
}

// Supported cryptocurrencies
export const SUPPORTED_CURRENCIES = [
  { code: 'BTC', name: 'Bitcoin', icon: '₿' },
  { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { code: 'LTC', name: 'Litecoin', icon: 'Ł' },
  { code: 'XRP', name: 'Ripple', icon: 'XRP' },
  { code: 'USDTTRC20', name: 'USDT (TRC20)', icon: '₮' },
  { code: 'USDTERC20', name: 'USDT (ERC20)', icon: '₮' },
  { code: 'SOL', name: 'Solana', icon: '◎' },
  { code: 'TRX', name: 'TRON', icon: 'TRX' },
  { code: 'TON', name: 'Toncoin', icon: 'TON' }
]

class NOWPaymentsAPI {
  private apiKey: string
  private baseURL: string

  constructor() {
    if (!API_KEY) {
      throw new Error('NOWpayments API key is required')
    }
    this.apiKey = API_KEY
    this.baseURL = NOWPAYMENTS_API_URL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(`NOWpayments API Error: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  // Get available currencies
  async getAvailableCurrencies() {
    return this.request('/currencies')
  }

  // Get current exchange rates
  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    return this.request(`/exchange-amount/${fromCurrency}-${toCurrency}`)
  }

  // Estimate payment amount
  async getEstimate(amount: number, fromCurrency: string, toCurrency: string) {
    return this.request('/estimate', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency_from: fromCurrency,
        currency_to: toCurrency
      })
    })
  }

  // Create payment
  async createPayment(paymentData: CreatePaymentRequest): Promise<PaymentResponse> {
    return this.request('/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.request(`/payment/${paymentId}`)
  }

  // Get payment history
  async getPayments(limit: number = 100, offset: number = 0) {
    return this.request(`/payment?limit=${limit}&offset=${offset}`)
  }

  // Verify IPN callback
  verifyIPN(payload: string, signature: string): boolean {
    if (!IPN_SECRET) {
      throw new Error('IPN secret is required for verification')
    }

    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha512', IPN_SECRET)
      .update(payload)
      .digest('hex')

    return expectedSignature === signature
  }
}

export const nowPayments = new NOWPaymentsAPI()

// Helper functions
export function formatCryptoAmount(amount: number, currency: string): string {
  const decimals = currency === 'BTC' ? 8 : currency === 'ETH' ? 6 : 4
  return amount.toFixed(decimals)
}

export function getCurrencyIcon(currency: string): string {
  const coin = SUPPORTED_CURRENCIES.find(c => c.code === currency)
  return coin?.icon || currency
}

export function formatPaymentStatus(status: string): { text: string, variant: string } {
  const statusMap = {
    'waiting': { text: 'Waiting for Payment', variant: 'outline' },
    'confirming': { text: 'Confirming Payment', variant: 'secondary' },
    'confirmed': { text: 'Payment Confirmed', variant: 'default' },
    'sending': { text: 'Processing Payment', variant: 'secondary' },
    'partially_paid': { text: 'Partially Paid', variant: 'destructive' },
    'failed': { text: 'Payment Failed', variant: 'destructive' },
    'refunded': { text: 'Refunded', variant: 'outline' },
    'expired': { text: 'Payment Expired', variant: 'destructive' }
  }
  
  return statusMap[status] || { text: status, variant: 'outline' }
}