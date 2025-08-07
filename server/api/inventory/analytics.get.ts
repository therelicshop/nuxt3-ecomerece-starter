export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  const period = query.period as string || '30d'

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    // Mock analytics data
    const analytics = {
      overview: {
        totalProducts: 124,
        totalValue: 15750.50,
        lowStockItems: 8,
        outOfStockItems: 2,
        totalOrders: 45,
        totalRevenue: 3420.75,
        avgOrderValue: 76.02
      },
      salesByPlatform: [
        { platform: 'eBay', orders: 18, revenue: 1425.30, percentage: 41.7 },
        { platform: 'WooCommerce', orders: 20, revenue: 1544.85, percentage: 45.2 },
        { platform: 'Shopware', orders: 7, revenue: 450.60, percentage: 13.1 }
      ],
      revenueChart: [
        { date: '2025-01-01', revenue: 125.50, orders: 3 },
        { date: '2025-01-02', revenue: 234.75, orders: 5 },
        { date: '2025-01-03', revenue: 156.20, orders: 2 },
        { date: '2025-01-04', revenue: 389.90, orders: 8 },
        { date: '2025-01-05', revenue: 278.15, orders: 6 },
        { date: '2025-01-06', revenue: 445.30, orders: 9 },
        { date: '2025-01-07', revenue: 198.75, orders: 4 }
      ],
      topProducts: [
        {
          id: 'inv_001',
          name: 'Wireless Bluetooth Headphones',
          sku: 'WBH-001',
          unitsSold: 28,
          revenue: 2519.72,
          profit: 1259.72
        },
        {
          id: 'inv_003',
          name: 'Smart Home Security Camera',
          sku: 'SHSC-003',
          unitsSold: 15,
          revenue: 2324.85,
          profit: 1199.85
        },
        {
          id: 'inv_002',
          name: 'Organic Cotton T-Shirt',
          sku: 'OCT-002',
          unitsSold: 22,
          revenue: 549.78,
          profit: 285.78
        }
      ],
      categoryBreakdown: [
        { category: 'Electronics', products: 45, value: 8950.25, percentage: 56.8 },
        { category: 'Clothing', products: 32, value: 2840.15, percentage: 18.0 },
        { category: 'Home & Garden', products: 28, value: 2450.80, percentage: 15.6 },
        { category: 'Food & Beverages', products: 19, value: 1509.30, percentage: 9.6 }
      ],
      paymentMethods: [
        { method: 'Credit Card', orders: 18, revenue: 1450.25, percentage: 42.4 },
        { method: 'PayPal', orders: 15, revenue: 1120.80, percentage: 32.8 },
        { method: 'Crypto', orders: 8, revenue: 680.50, percentage: 19.9 },
        { method: 'Bank Transfer', orders: 4, revenue: 169.20, percentage: 4.9 }
      ],
      stockAlerts: {
        critical: 3,  // 0 stock
        low: 5,       // Below reorder point
        medium: 12,   // Close to reorder point
        good: 104     // Above reorder point
      }
    }

    return {
      success: true,
      period: period,
      analytics: analytics,
      generatedAt: new Date().toISOString()
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch analytics: ${error.message}`
    })
  }
})