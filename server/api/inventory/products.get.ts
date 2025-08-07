export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  const search = query.search as string
  const category = query.category as string
  const platform = query.platform as string
  const lowStock = query.lowStock as boolean

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    // Mock comprehensive product catalog
    let products = [
      {
        id: 'inv_001',
        userId: userId,
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        barcode: '1234567890123',
        description: 'High-quality wireless headphones with noise cancellation',
        category: 'Electronics',
        brand: 'TechAudio',
        price: 89.99,
        costPrice: 45.00,
        stockQuantity: 25,
        reorderPoint: 10,
        supplier: 'TechSupplier Co.',
        platforms: {
          ebay: { active: true, price: 94.99, quantity: 8 },
          woocommerce: { active: true, price: 89.99, quantity: 12 },
          shopware: { active: false, price: 0, quantity: 0 }
        },
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'],
        weight: 0.5,
        dimensions: { length: 20, width: 18, height: 8 },
        tags: ['wireless', 'bluetooth', 'audio'],
        status: 'active',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-20T15:30:00Z'
      },
      {
        id: 'inv_002',
        userId: userId,
        name: 'Organic Cotton T-Shirt',
        sku: 'OCT-002',
        barcode: '1234567890124',
        description: 'Comfortable organic cotton t-shirt in multiple colors',
        category: 'Clothing',
        brand: 'EcoWear',
        price: 24.99,
        costPrice: 12.00,
        stockQuantity: 5, // Low stock
        reorderPoint: 15,
        supplier: 'Organic Textiles Ltd.',
        platforms: {
          ebay: { active: true, price: 29.99, quantity: 2 },
          woocommerce: { active: true, price: 24.99, quantity: 3 },
          shopware: { active: true, price: 26.99, quantity: 0 }
        },
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'],
        weight: 0.2,
        dimensions: { length: 30, width: 25, height: 1 },
        tags: ['organic', 'cotton', 'clothing'],
        status: 'active',
        createdAt: '2025-01-10T08:00:00Z',
        updatedAt: '2025-01-22T09:15:00Z'
      },
      {
        id: 'inv_003',
        userId: userId,
        name: 'Smart Home Security Camera',
        sku: 'SHSC-003',
        barcode: '1234567890125',
        description: '1080p HD security camera with night vision and mobile app',
        category: 'Electronics',
        brand: 'SecureHome',
        price: 149.99,
        costPrice: 75.00,
        stockQuantity: 18,
        reorderPoint: 8,
        supplier: 'Security Solutions Inc.',
        platforms: {
          ebay: { active: true, price: 159.99, quantity: 6 },
          woocommerce: { active: true, price: 149.99, quantity: 8 },
          shopware: { active: true, price: 154.99, quantity: 4 }
        },
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300'],
        weight: 1.2,
        dimensions: { length: 15, width: 10, height: 8 },
        tags: ['security', 'camera', 'smart-home'],
        status: 'active',
        createdAt: '2025-01-08T14:00:00Z',
        updatedAt: '2025-01-21T11:45:00Z'
      },
      {
        id: 'inv_004',
        userId: userId,
        name: 'Artisan Coffee Beans',
        sku: 'ACB-004',
        barcode: '1234567890126',
        description: 'Premium single-origin coffee beans from Colombia',
        category: 'Food & Beverages',
        brand: 'Mountain Roasters',
        price: 19.99,
        costPrice: 8.50,
        stockQuantity: 2, // Very low stock
        reorderPoint: 12,
        supplier: 'Colombian Coffee Co.',
        platforms: {
          ebay: { active: false, price: 0, quantity: 0 },
          woocommerce: { active: true, price: 19.99, quantity: 2 },
          shopware: { active: false, price: 0, quantity: 0 }
        },
        images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300'],
        weight: 0.5,
        dimensions: { length: 15, width: 8, height: 3 },
        tags: ['coffee', 'organic', 'single-origin'],
        status: 'active',
        createdAt: '2025-01-12T16:00:00Z',
        updatedAt: '2025-01-23T10:20:00Z'
      }
    ]

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category)
    }

    if (platform && platform !== 'all') {
      products = products.filter(p => p.platforms[platform]?.active)
    }

    if (lowStock) {
      products = products.filter(p => p.stockQuantity <= p.reorderPoint)
    }

    // Calculate totals
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
    const lowStockCount = products.filter(p => p.stockQuantity <= p.reorderPoint).length

    return {
      success: true,
      products: products,
      total: products.length,
      stats: {
        totalProducts: products.length,
        totalValue: totalValue,
        lowStockItems: lowStockCount,
        activeProducts: products.filter(p => p.status === 'active').length
      }
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch products: ${error.message}`
    })
  }
})