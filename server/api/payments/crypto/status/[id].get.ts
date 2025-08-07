import { requireAuth } from '~/lib/auth'
import { nowPayments } from '~/lib/nowpayments'
import { prisma } from '~/lib/prisma'

export default defineEventHandler(requireAuth(async (event) => {
  const paymentId = getRouterParam(event, 'id')
  const user = event.context.user

  if (!paymentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment ID is required'
    })
  }

  try {
    // Get payment from database
    const cryptoPayment = await prisma.cryptoPayment.findFirst({
      where: {
        id: paymentId,
        userId: user.id
      }
    })

    if (!cryptoPayment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Payment not found'
      })
    }

    // Get updated status from NOWpayments
    const paymentStatus = await nowPayments.getPaymentStatus(cryptoPayment.nowpaymentsId)

    // Update local database if status changed
    if (paymentStatus.payment_status !== cryptoPayment.status) {
      await prisma.cryptoPayment.update({
        where: { id: paymentId },
        data: {
          status: paymentStatus.payment_status,
          txHash: paymentStatus.outcome_amount > 0 ? 'confirmed' : null,
          updatedAt: new Date()
        }
      })
    }

    return {
      success: true,
      payment: {
        id: cryptoPayment.id,
        nowpaymentsId: cryptoPayment.nowpaymentsId,
        currency: cryptoPayment.currency,
        amount: cryptoPayment.amount,
        cryptoAmount: cryptoPayment.cryptoAmount,
        address: cryptoPayment.address,
        status: paymentStatus.payment_status,
        actuallyPaid: paymentStatus.actually_paid,
        confirmations: cryptoPayment.confirmations,
        txHash: cryptoPayment.txHash,
        createdAt: cryptoPayment.createdAt.toISOString(),
        expiresAt: cryptoPayment.expiresAt?.toISOString(),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cryptoPayment.address}`,
        explorerUrl: getExplorerUrl(cryptoPayment.currency, cryptoPayment.address || '')
      }
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to get payment status'
    })
  }
}))

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