import { nowPayments } from '~/lib/nowpayments'
import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readRawBody(event, 'utf-8')
    const signature = getHeader(event, 'x-nowpayments-sig')

    if (!signature) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing signature header'
      })
    }

    // Verify webhook signature
    const isValid = nowPayments.verifyIPN(body, signature)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid signature'
      })
    }

    const webhookData = JSON.parse(body)
    const { payment_id, payment_status, actually_paid, outcome_amount } = webhookData

    // Find payment in database
    const cryptoPayment = await prisma.cryptoPayment.findFirst({
      where: {
        nowpaymentsId: payment_id
      },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    })

    if (!cryptoPayment) {
      console.warn(`Webhook received for unknown payment: ${payment_id}`)
      return { success: true, message: 'Payment not found' }
    }

    // Update payment status
    await prisma.cryptoPayment.update({
      where: { id: cryptoPayment.id },
      data: {
        status: payment_status,
        confirmations: payment_status === 'confirmed' ? 1 : 0,
        updatedAt: new Date()
      }
    })

    // Handle payment completion
    if (payment_status === 'confirmed' && actually_paid >= cryptoPayment.cryptoAmount) {
      // Create success alert for user
      await prisma.alert.create({
        data: {
          userId: cryptoPayment.userId,
          type: 'payment_confirmed',
          severity: 'info',
          title: 'Crypto Payment Confirmed',
          message: `Your ${cryptoPayment.currency} payment of ${cryptoPayment.cryptoAmount} has been confirmed`,
          data: {
            paymentId: cryptoPayment.id,
            currency: cryptoPayment.currency,
            amount: cryptoPayment.cryptoAmount,
            txHash: webhookData.outcome_transaction_hash
          }
        }
      })

      // TODO: Process order fulfillment here
      // - Update user's plan if it's a subscription payment
      // - Unlock premium features
      // - Send confirmation email
      
      console.log(`Payment confirmed for user ${cryptoPayment.user.email}: ${cryptoPayment.currency} ${cryptoPayment.cryptoAmount}`)
    }

    // Handle payment failures
    if (['failed', 'expired', 'refunded'].includes(payment_status)) {
      await prisma.alert.create({
        data: {
          userId: cryptoPayment.userId,
          type: 'payment_failed',
          severity: 'medium',
          title: 'Payment Issue',
          message: `Your crypto payment has ${payment_status}. Please contact support if you need assistance.`,
          data: {
            paymentId: cryptoPayment.id,
            status: payment_status,
            currency: cryptoPayment.currency
          }
        }
      })
    }

    return { success: true, message: 'Webhook processed successfully' }

  } catch (error: any) {
    console.error('Webhook processing error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process webhook'
    })
  }
})