import { requireAuth } from '~/lib/auth'
import { prisma } from '~/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  costPrice: z.number().min(0, 'Cost price must be positive').optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be non-negative'),
  reorderPoint: z.number().int().min(0, 'Reorder point must be non-negative').default(10),
  supplierId: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0)
  }).optional(),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['active', 'inactive']).default('active'),
  platforms: z.record(z.object({
    active: z.boolean(),
    price: z.number().min(0),
    quantity: z.number().int().min(0)
  })).optional()
})

export default defineEventHandler(requireAuth(async (event) => {
  const body = await readBody(event)
  const user = event.context.user

  try {
    const validatedData = productSchema.parse(body.product)

    // Check if SKU already exists for this user
    const existingProduct = await prisma.product.findFirst({
      where: {
        userId: user.id,
        sku: validatedData.sku
      }
    })

    if (existingProduct) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A product with this SKU already exists'
      })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        sku: validatedData.sku,
        barcode: validatedData.barcode,
        description: validatedData.description,
        category: validatedData.category,
        brand: validatedData.brand,
        price: validatedData.price,
        costPrice: validatedData.costPrice,
        stockQuantity: validatedData.stockQuantity,
        reorderPoint: validatedData.reorderPoint,
        supplierId: validatedData.supplierId,
        weight: validatedData.weight,
        dimensions: validatedData.dimensions,
        images: validatedData.images,
        tags: validatedData.tags,
        status: validatedData.status
      },
      include: {
        supplier: {
          select: { name: true }
        }
      }
    })

    // Create platform products if specified
    if (validatedData.platforms) {
      const platformProducts = Object.entries(validatedData.platforms).map(([platform, data]) => ({
        productId: product.id,
        platform,
        platformId: `${platform}_${product.sku}`,
        active: data.active,
        price: data.price,
        quantity: data.quantity
      }))

      await prisma.platformProduct.createMany({
        data: platformProducts
      })
    }

    // Create low stock alert if needed
    if (product.stockQuantity <= product.reorderPoint) {
      await prisma.alert.create({
        data: {
          userId: user.id,
          productId: product.id,
          type: 'low_stock',
          severity: product.stockQuantity === 0 ? 'high' : 'medium',
          title: `${product.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'} Alert`,
          message: `${product.name} (${product.sku}) has ${product.stockQuantity === 0 ? 'no' : 'only ' + product.stockQuantity} units left`,
          data: {
            currentStock: product.stockQuantity,
            reorderPoint: product.reorderPoint,
            sku: product.sku
          }
        }
      })
    }

    return {
      success: true,
      message: 'Product created successfully',
      product: {
        ...product,
        supplier: product.supplier?.name || '',
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString()
      }
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Failed to create product'
    })
  }
}))