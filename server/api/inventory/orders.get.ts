export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  const status = query.status as string
  const platform = query.platform as string
  const dateRange = query.dateRange as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    // Mock order data
    let orders = [
      {
        id: 'order_001',
        userId: userId,
        orderNumber: 'ORD-2025-001',
        platform: 'ebay',
        customer: {
          name: 'Alice Johnson',
          email: 'alice@email.com',
          address: '123 Main St, New York, NY 10001'
        },
        items: [
          {
            productId: 'inv_001',
            sku: 'WBH-001',
            name: 'Wireless Bluetooth Headphones',
            quantity: 1,
            price: 94.99
          }
        ],
        subtotal: 94.99,
        tax: 8.55,
        shipping: 9.99,
        total: 113.53,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'PayPal',
        shippingMethod: 'Standard Shipping',
        trackingNumber: 'TRK123456789',
        notes: 'Customer requested expedited handling',
        orderDate: '2025-01-22T10:30:00Z',
        shippedDate: '2025-01-23T15:45:00Z',
        deliveredDate: '2025-01-25T14:20:00Z'
      },
      {
        id: 'order_002',
        userId: userId,
        orderNumber: 'ORD-2025-002',
        platform: 'woocommerce',
        customer: {
          name: 'Bob Smith',
          email: 'bob@email.com',
          address: '456 Oak Ave, Los Angeles, CA 90210'
        },
        items: [
          {
            productId: 'inv_002',
            sku: 'OCT-002',
            name: 'Organic Cotton T-Shirt',
            quantity: 3,
            price: 24.99
          }
        ],
        subtotal: 74.97,
        tax: 6.75,
        shipping: 7.99,
        total: 89.71,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        shippingMethod: 'Express Shipping',
        trackingNumber: null,
        notes: '',
        orderDate: '2025-01-23T14:15:00Z',
        shippedDate: null,
        deliveredDate: null
      },
      {
        id: 'order_003',
        userId: userId,
        orderNumber: 'ORD-2025-003',
        platform: 'shopware',
        customer: {
          name: 'Carol Davis',
          email: 'carol@email.com',
          address: '789 Pine St, Chicago, IL 60601'
        },
        items: [
          {
            productId: 'inv_003',
            sku: 'SHSC-003',
            name: 'Smart Home Security Camera',
            quantity: 2,
            price: 154.99
          }
        ],
        subtotal: 309.98,
        tax: 27.90,
        shipping: 12.99,
        total: 350.87,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'Bank Transfer',
        shippingMethod: 'Standard Shipping',
        trackingNumber: null,
        notes: 'Awaiting payment confirmation',
        orderDate: '2025-01-24T09:45:00Z',
        shippedDate: null,
        deliveredDate: null
      },
      {
        id: 'order_004',
        userId: userId,
        orderNumber: 'ORD-2025-004',
        platform: 'woocommerce',
        customer: {
          name: 'David Wilson',
          email: 'david@email.com',
          address: '321 Elm St, Miami, FL 33101'
        },
        items: [
          {
            productId: 'inv_004',
            sku: 'ACB-004',
            name: 'Artisan Coffee Beans',
            quantity: 5,
            price: 19.99
          },
          {
            productId: 'inv_001',
            sku: 'WBH-001',
            name: 'Wireless Bluetooth Headphones',
            quantity: 1,
            price: 89.99
          }
        ],
        subtotal: 189.94,
        tax: 17.09,
        shipping: 8.99,
        total: 216.02,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'Crypto (BTC)',
        shippingMethod: 'Express Shipping',
        trackingNumber: 'TRK987654321',
        notes: 'Crypto payment processed via NOWpayments',
        orderDate: '2025-01-21T16:20:00Z',
        shippedDate: '2025-01-22T11:30:00Z',
        deliveredDate: null
      }
    ]

    // Apply filters
    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status)
    }

    if (platform && platform !== 'all') {
      orders = orders.filter(o => o.platform === platform)
    }

    if (dateRange && dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }

      orders = orders.filter(o => new Date(o.orderDate) >= startDate)
    }

    // Calculate statistics
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    const statusCounts = orders.reduce((counts, o) => {
      counts[o.status] = (counts[o.status] || 0) + 1
      return counts
    }, {} as Record<string, number>)

    return {
      success: true,
      orders: orders,
      total: orders.length,
      stats: {
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        averageOrderValue: averageOrderValue,
        statusCounts: statusCounts,
        cryptoOrders: orders.filter(o => o.paymentMethod.includes('Crypto')).length
      }
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch orders: ${error.message}`
    })
  }
})