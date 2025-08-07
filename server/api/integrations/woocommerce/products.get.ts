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
    // TODO: Get user's WooCommerce API credentials from database
    // For now, we'll return mock data
    const mockProducts = [
      {
        id: 'woo_product_1',
        platform: 'woocommerce',
        title: 'WooCommerce Product 1',
        sku: 'WOO-001',
        price: 35.99,
        quantity: 22,
        status: 'publish',
        category: 'Clothing',
        stockStatus: 'instock',
        lastSync: new Date().toISOString()
      },
      {
        id: 'woo_product_2',
        platform: 'woocommerce',
        title: 'WooCommerce Product 2',
        sku: 'WOO-002',
        price: 18.75,
        quantity: 5,
        status: 'publish',
        category: 'Accessories',
        stockStatus: 'lowstock',
        lastSync: new Date().toISOString()
      }
    ]

    return {
      success: true,
      platform: 'woocommerce',
      products: mockProducts,
      total: mockProducts.length
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch WooCommerce products: ${error.message}`
    })
  }
})