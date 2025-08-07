import { requireAuth } from '~/lib/auth'
import { getUserById } from '~/lib/auth'

export default defineEventHandler(requireAuth(async (event) => {
  try {
    const user = event.context.user
    const userDetails = await getUserById(user.id)

    if (!userDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    return {
      success: true,
      user: userDetails
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user details'
    })
  }
}))