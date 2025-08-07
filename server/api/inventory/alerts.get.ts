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
    // Mock alert data
    const alerts = [
      {
        id: 'alert_001',
        userId: userId,
        type: 'low_stock',
        severity: 'high',
        title: 'Critical Low Stock Alert',
        message: 'Artisan Coffee Beans (ACB-004) has only 2 units left (reorder point: 12)',
        productId: 'inv_004',
        productName: 'Artisan Coffee Beans',
        sku: 'ACB-004',
        currentStock: 2,
        reorderPoint: 12,
        isRead: false,
        createdAt: '2025-01-24T08:30:00Z'
      },
      {
        id: 'alert_002',
        userId: userId,
        type: 'low_stock',
        severity: 'medium',
        title: 'Low Stock Warning',
        message: 'Organic Cotton T-Shirt (OCT-002) has only 5 units left (reorder point: 15)',
        productId: 'inv_002',
        productName: 'Organic Cotton T-Shirt',
        sku: 'OCT-002',
        currentStock: 5,
        reorderPoint: 15,
        isRead: false,
        createdAt: '2025-01-23T15:45:00Z'
      },
      {
        id: 'alert_003',
        userId: userId,
        type: 'sync_error',
        severity: 'medium',
        title: 'Platform Sync Issue',
        message: 'Failed to sync inventory with eBay. Last successful sync: 2 hours ago',
        platform: 'ebay',
        lastSync: '2025-01-24T06:00:00Z',
        isRead: false,
        createdAt: '2025-01-24T08:15:00Z'
      },
      {
        id: 'alert_004',
        userId: userId,
        type: 'price_discrepancy',
        severity: 'low',
        title: 'Price Discrepancy Detected',
        message: 'Wireless Bluetooth Headphones has different prices across platforms',
        productId: 'inv_001',
        productName: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        platformPrices: {
          base: 89.99,
          ebay: 94.99,
          woocommerce: 89.99,
          shopware: 0
        },
        isRead: true,
        createdAt: '2025-01-23T12:20:00Z'
      },
      {
        id: 'alert_005',
        userId: userId,
        type: 'new_order',
        severity: 'info',
        title: 'New Order Received',
        message: 'New order ORD-2025-004 received from WooCommerce ($216.02)',
        orderId: 'order_004',
        orderNumber: 'ORD-2025-004',
        platform: 'woocommerce',
        amount: 216.02,
        isRead: true,
        createdAt: '2025-01-21T16:20:00Z'
      }
    ]

    const unreadCount = alerts.filter(a => !a.isRead).length
    const severityCounts = alerts.reduce((counts, a) => {
      counts[a.severity] = (counts[a.severity] || 0) + 1
      return counts
    }, {} as Record<string, number>)

    return {
      success: true,
      alerts: alerts,
      total: alerts.length,
      stats: {
        totalAlerts: alerts.length,
        unreadCount: unreadCount,
        severityCounts: severityCounts,
        lowStockAlerts: alerts.filter(a => a.type === 'low_stock').length,
        syncErrors: alerts.filter(a => a.type === 'sync_error').length
      }
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch alerts: ${error.message}`
    })
  }
})