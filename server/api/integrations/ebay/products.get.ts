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
    // TODO: Get user's eBay access token from database
    // For now, we'll return mock data
    const mockProducts = [
      {
        id: 'ebay_product_1',
        platform: 'ebay',
        title: 'Sample eBay Product 1',
        sku: 'EBAY-001',
        price: 29.99,
        quantity: 15,
        condition: 'New',
        category: 'Electronics',
        listingStatus: 'Active',
        lastSync: new Date().toISOString()
      },
      {
        id: 'ebay_product_2',
        platform: 'ebay',
        title: 'Sample eBay Product 2',
        sku: 'EBAY-002',
        price: 45.50,
        quantity: 8,
        condition: 'New',
        category: 'Home & Garden',
        listingStatus: 'Active',
        lastSync: new Date().toISOString()
      }
    ]

    return {
      success: true,
      platform: 'ebay',
      products: mockProducts,
      total: mockProducts.length
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch eBay products: ${error.message}`
    })
  }
})