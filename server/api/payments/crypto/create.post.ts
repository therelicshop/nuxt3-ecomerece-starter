import { requireAuth } from '~/lib/auth'
import { nowPayments } from '~/lib/nowpayments'
import { prisma } from '~/lib/prisma'
import { z } from 'zod'

const createPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'), // USD, EUR, etc.
  cryptoCurrency: z.string().min(1, 'Crypto currency is required'), // BTC, ETH, etc.
  orderId: z.string().optional(),
  description: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
})

export default defineEventHandler(requireAuth(async (event) => {
  const body = await readBody(event)
  const user = event.context.user

  try {
    const validatedData = createPaymentSchema.parse(body)
    const config = useRuntimeConfig()

    // Create payment with NOWpayments
    const paymentData = {
      price_amount: validatedData.amount,
      price_currency: validatedData.currency,
      pay_currency: validatedData.cryptoCurrency,
      order_id: validatedData.orderId || `user_${user.id}_${Date.now()}`,
      order_description: validatedData.description || 'Inventory Management Service',
      ipn_callback_url: `${config.public.siteUrl || 'http://localhost:3000'}/api/payments/crypto/webhook`,
      success_url: validatedData.successUrl,
      cancel_url: validatedData.cancelUrl
    }

    const payment = await nowPayments.createPayment(paymentData)

    // Store payment in database
    const cryptoPayment = await prisma.cryptoPayment.create({
      data: {
        userId: user.id,
        orderId: validatedData.orderId,
        nowpaymentsId: payment.payment_id,
        currency: validatedData.cryptoCurrency,
        amount: validatedData.amount,
        cryptoAmount: payment.pay_amount,
        address: payment.pay_address,
        status: payment.payment_status,
        expiresAt: new Date(payment.expiration_estimate_date)
      }
    })

    return {
      success: true,
      message: 'Crypto payment created successfully',
      payment: {
        id: cryptoPayment.id,
        nowpaymentsId: payment.payment_id,
        payAddress: payment.pay_address,
        amount: payment.pay_amount,
        currency: validatedData.cryptoCurrency,
        status: payment.payment_status,
        expiresAt: payment.expiration_estimate_date,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${payment.pay_address}`,
        explorerUrl: getExplorerUrl(validatedData.cryptoCurrency, payment.pay_address)
      }
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Failed to create crypto payment'
    })
  }
}))

// Helper function to get blockchain explorer URLs
function getExplorerUrl(currency: string, address: string): string {
  const explorers = {
    'BTC': `https://blockstream.info/address/${address}`,
    'ETH': `https://etherscan.io/address/${address}`,
    'USDTERC20': `https://etherscan.io/address/${address}`,
    'LTC': `https://blockchair.com/litecoin/address/${address}`,
    'XRP': `https://xrpscan.com/account/${address}`,
    'USDTTRC20': `https://tronscan.org/#/address/${address}`,
    'SOL': `https://solscan.io/account/${address}`,
    'TRX': `https://tronscan.org/#/address/${address}`,
    'TON': `https://tonscan.org/address/${address}`
  }
  
  return explorers[currency] || '#'
}