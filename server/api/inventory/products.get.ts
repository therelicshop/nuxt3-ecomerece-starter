import { requireAuth } from '~/lib/auth'
import { prisma } from '~/lib/prisma'

export default defineEventHandler(requireAuth(async (event) => {
  const query = getQuery(event)
  const user = event.context.user
  const search = query.search as string
  const category = query.category as string
  const platform = query.platform as string
  const lowStock = query.lowStock === 'true'

  try {
    // Build where clause
    const where: any = {
      userId: user.id,
      status: { not: 'deleted' }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (lowStock) {
      where.stockQuantity = { lte: { reorderPoint: true } }
    }

    // Fetch products with relations
    const products = await prisma.product.findMany({
      where,
      include: {
        supplier: {
          select: { name: true }
        },
        platformProducts: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Filter by platform if specified
    let filteredProducts = products
    if (platform && platform !== 'all') {
      filteredProducts = products.filter(product =>
        product.platformProducts.some(pp => pp.platform === platform && pp.active)
      )
    }

    // Transform data for frontend
    const transformedProducts = filteredProducts.map(product => ({
      id: product.id,
      userId: product.userId,
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      costPrice: product.costPrice,
      stockQuantity: product.stockQuantity,
      reorderPoint: product.reorderPoint,
      supplier: product.supplier?.name || '',
      platforms: product.platformProducts.reduce((acc, pp) => {
        acc[pp.platform] = {
          active: pp.active,
          price: pp.price,
          quantity: pp.quantity
        }
        return acc
      }, {} as any),
      images: product.images,
      weight: product.weight,
      dimensions: product.dimensions,
      tags: product.tags,
      status: product.status,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }))

    // Calculate stats
    const totalValue = transformedProducts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
    const lowStockCount = transformedProducts.filter(p => p.stockQuantity <= p.reorderPoint).length

    return {
      success: true,
      products: transformedProducts,
      total: transformedProducts.length,
      stats: {
        totalProducts: transformedProducts.length,
        totalValue: totalValue,
        lowStockItems: lowStockCount,
        activeProducts: transformedProducts.filter(p => p.status === 'active').length
      }
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch products: ${error.message}`
    })
  }
}))