export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    // TODO: Get actual connection status from database
    // For now, return mock status
    const integrationStatus = {
      userId: userId,
      platforms: {
        ebay: {
          connected: true,
          lastSync: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: 'active',
          productsCount: 25,
          apiCallsToday: 45,
          apiLimit: 1000
        },
        woocommerce: {
          connected: true,
          lastSync: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          status: 'active',
          productsCount: 38,
          apiCallsToday: 12,
          apiLimit: 'unlimited'
        },
        shopware: {
          connected: false,
          lastSync: null,
          status: 'disconnected',
          productsCount: 0,
          apiCallsToday: 0,
          apiLimit: 500
        }
      },
      overallStatus: 'partial', // 'connected', 'partial', 'disconnected'
      totalProducts: 63,
      lastGlobalSync: new Date(Date.now() - 3600000).toISOString()
    }

    return {
      success: true,
      data: integrationStatus
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to get integration status: ${error.message}`
    })
  }
})