export default defineEventHandler(async (event) => {
  const productId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId || !productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID and product ID are required'
    })
  }

  try {
    // TODO: Verify product exists and user owns it
    // TODO: Delete from database
    console.log(`Deleted product ${productId} for user ${userId}`)

    return {
      success: true,
      message: 'Product deleted successfully',
      deletedId: productId
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete product: ${error.message}`
    })
  }
})