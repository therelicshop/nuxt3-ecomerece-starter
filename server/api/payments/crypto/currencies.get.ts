import { nowPayments, SUPPORTED_CURRENCIES } from '~/lib/nowpayments'

export default defineEventHandler(async (event) => {
  try {
    // Get available currencies from NOWpayments
    const availableCurrencies = await nowPayments.getAvailableCurrencies()
    
    // Filter to only our supported currencies
    const supportedCodes = SUPPORTED_CURRENCIES.map(c => c.code)
    const filteredCurrencies = availableCurrencies.currencies?.filter((currency: string) => 
      supportedCodes.includes(currency)
    ) || []

    // Combine with our metadata
    const currencies = SUPPORTED_CURRENCIES.filter(currency => 
      filteredCurrencies.includes(currency.code)
    ).map(currency => ({
      ...currency,
      available: true
    }))

    return {
      success: true,
      currencies: currencies,
      total: currencies.length
    }

  } catch (error: any) {
    // Return our supported currencies even if API call fails
    return {
      success: true,
      currencies: SUPPORTED_CURRENCIES.map(currency => ({
        ...currency,
        available: false // Mark as unavailable if API failed
      })),
      total: SUPPORTED_CURRENCIES.length,
      warning: 'Could not verify currency availability'
    }
  }
})