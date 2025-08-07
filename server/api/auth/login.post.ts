import { z } from 'zod'
import { authenticateUser, generateToken } from '~/lib/auth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = loginSchema.parse(body)

    // Authenticate user
    const user = await authenticateUser(email, password)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Generate token
    const token = generateToken(user)

    return {
      success: true,
      message: 'Login successful',
      user: user,
      token: token
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Login failed'
    })
  }
})