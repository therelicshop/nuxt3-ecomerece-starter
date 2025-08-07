export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, product } = body

  if (!userId || !product) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID and product data are required'
    })
  }

  try {
    // Validate required fields
    const requiredFields = ['name', 'sku', 'price', 'stockQuantity']
    for (const field of requiredFields) {
      if (!product[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `${field} is required`
        })
      }
    }

    // Generate new product ID
    const newProduct = {
      id: `inv_${Date.now()}`,
      userId: userId,
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || '',
      description: product.description || '',
      category: product.category || 'Uncategorized',
      brand: product.brand || '',
      price: parseFloat(product.price),
      costPrice: parseFloat(product.costPrice) || 0,
      stockQuantity: parseInt(product.stockQuantity),
      reorderPoint: parseInt(product.reorderPoint) || 10,
      supplier: product.supplier || '',
      platforms: product.platforms || {
        ebay: { active: false, price: 0, quantity: 0 },
        woocommerce: { active: false, price: 0, quantity: 0 },
        shopware: { active: false, price: 0, quantity: 0 }
      },
      images: product.images || [],
      weight: parseFloat(product.weight) || 0,
      dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
      tags: product.tags || [],
      status: product.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // TODO: Save to database
    console.log('Created new product:', newProduct)

    return {
      success: true,
      message: 'Product created successfully',
      product: newProduct
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create product: ${error.message}`
    })
  }
})