import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN = '7d'

export interface AuthUser {
  id: string
  email: string
  name: string
  plan: string
  status: string
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      status: user.status
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      plan: decoded.plan,
      status: decoded.status
    }
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Get user by ID
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      plan: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

// Get user by email
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

// Create new user
export async function createUser(data: {
  email: string
  name: string
  password: string
  plan?: string
}) {
  const hashedPassword = await hashPassword(data.password)
  
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      plan: data.plan || 'free'
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      status: true,
      createdAt: true
    }
  })
}

// Authenticate user
export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  
  if (!user || user.status !== 'active') {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    status: user.status
  }
}

// Extract user from request headers
export function extractUserFromHeaders(headers: Record<string, string>): AuthUser | null {
  const authHeader = headers.authorization || headers.Authorization
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

// Middleware to require authentication
export function requireAuth(handler: Function) {
  return async (event: any) => {
    const user = extractUserFromHeaders(event.node.req.headers)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Add user to event context
    event.context.user = user
    
    return handler(event)
  }
}