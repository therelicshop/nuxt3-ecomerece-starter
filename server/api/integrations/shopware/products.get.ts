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
    // TODO: Get user's Shopware API credentials from database
    // For now, we'll return mock data
    const mockProducts = [
      {
        id: 'shopware_product_1',
        platform: 'shopware',
        title: 'Shopware Product 1',
        sku: 'SW-001',
        price: 42.00,
        quantity: 12,
        active: true,
        category: 'Sports',
        stockLevel: 'medium',
        lastSync: new Date().toISOString()
      },
      {
        id: 'shopware_product_2',
        platform: 'shopware',
        title: 'Shopware Product 2',
        sku: 'SW-002',
        price: 67.25,
        quantity: 3,
        active: true,
        category: 'Tools',
        stockLevel: 'low',
        lastSync: new Date().toISOString()
      }
    ]

    return {
      success: true,
      platform: 'shopware',
      products: mockProducts,
      total: mockProducts.length
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch Shopware products: ${error.message}`
    })
  }
})