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
    // Mock supplier data
    const suppliers = [
      {
        id: 'sup_001',
        userId: userId,
        name: 'TechSupplier Co.',
        contactPerson: 'John Smith',
        email: 'john@techsupplier.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Tech Avenue',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        },
        paymentTerms: 'Net 30',
        rating: 4.8,
        totalOrders: 45,
        totalSpent: 125000.00,
        categories: ['Electronics', 'Accessories'],
        status: 'active',
        createdAt: '2024-08-15T10:00:00Z',
        lastOrderDate: '2025-01-20T14:30:00Z'
      },
      {
        id: 'sup_002',
        userId: userId,
        name: 'Organic Textiles Ltd.',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@organictextiles.com',
        phone: '+1-555-0124',
        address: {
          street: '456 Organic Way',
          city: 'Portland',
          state: 'OR',
          zipCode: '97205',
          country: 'USA'
        },
        paymentTerms: 'Net 45',
        rating: 4.9,
        totalOrders: 32,
        totalSpent: 85000.00,
        categories: ['Clothing', 'Textiles'],
        status: 'active',
        createdAt: '2024-09-10T08:00:00Z',
        lastOrderDate: '2025-01-18T16:45:00Z'
      },
      {
        id: 'sup_003',
        userId: userId,
        name: 'Security Solutions Inc.',
        contactPerson: 'Mike Wilson',
        email: 'mike@securitysolutions.com',
        phone: '+1-555-0125',
        address: {
          street: '789 Security Blvd',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          country: 'USA'
        },
        paymentTerms: 'Net 15',
        rating: 4.6,
        totalOrders: 28,
        totalSpent: 95000.00,
        categories: ['Electronics', 'Security'],
        status: 'active',
        createdAt: '2024-07-22T12:00:00Z',
        lastOrderDate: '2025-01-15T10:20:00Z'
      },
      {
        id: 'sup_004',
        userId: userId,
        name: 'Colombian Coffee Co.',
        contactPerson: 'Carlos Rodriguez',
        email: 'carlos@colombiancoffee.com',
        phone: '+57-1-555-0126',
        address: {
          street: 'Calle 123 #45-67',
          city: 'Bogotá',
          state: 'Cundinamarca',
          zipCode: '110111',
          country: 'Colombia'
        },
        paymentTerms: 'Prepaid',
        rating: 5.0,
        totalOrders: 15,
        totalSpent: 35000.00,
        categories: ['Food & Beverages'],
        status: 'active',
        createdAt: '2024-11-05T15:00:00Z',
        lastOrderDate: '2025-01-12T09:30:00Z'
      }
    ]

    const totalSpent = suppliers.reduce((sum, s) => sum + s.totalSpent, 0)
    const averageRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length

    return {
      success: true,
      suppliers: suppliers,
      total: suppliers.length,
      stats: {
        totalSuppliers: suppliers.length,
        activeSuppliers: suppliers.filter(s => s.status === 'active').length,
        totalSpent: totalSpent,
        averageRating: averageRating
      }
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch suppliers: ${error.message}`
    })
  }
})