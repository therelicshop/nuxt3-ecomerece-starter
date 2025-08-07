export default defineEventHandler(async (event) => {
  const barcode = getRouterParam(event, 'code')
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId || !barcode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID and barcode are required'
    })
  }

  try {
    // Mock barcode lookup - in real implementation, search database
    const mockProducts = [
      {
        id: 'inv_001',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        barcode: '1234567890123',
        price: 89.99,
        stockQuantity: 25
      },
      {
        id: 'inv_002',
        name: 'Organic Cotton T-Shirt',
        sku: 'OCT-002',
        barcode: '1234567890124',
        price: 24.99,
        stockQuantity: 5
      }
    ]

    const product = mockProducts.find(p => p.barcode === barcode)

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        barcode: barcode
      }
    }

    return {
      success: true,
      message: 'Product found',
      barcode: barcode,
      product: product
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Barcode lookup failed: ${error.message}`
    })
  }
})