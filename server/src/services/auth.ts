import { prisma } from '../lib/prisma.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { generateTokens } from '../utils/jwt.js'
import { AppError } from '../utils/errors.js'
import type { UserRole } from '../types/shared.js'

interface RegisterInput {
  email: string
  firstName: string
  lastName: string
  password: string
  role: UserRole
}

interface LoginInput {
  email: string
  password: string
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(input: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      throw new AppError(409, 'Email already registered')
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        password: hashedPassword,
        role: input.role,
      },
    })

    // Create role-specific profile
    switch (input.role) {
      case 'PARENT':
        await prisma.parent.create({
          data: {
            userId: user.id,
          },
        })
        break

      case 'STUDENT':
        // Students must be linked to a parent - we'll handle this in a separate endpoint
        break

      case 'VENDOR':
        await prisma.vendor.create({
          data: {
            userId: user.id,
            shopName: '',
            openingTime: '09:00',
            closingTime: '17:00',
          },
        })
        break

      case 'ADMIN':
        await prisma.admin.create({
          data: {
            userId: user.id,
            permissions: ['manage_users', 'manage_vendors', 'view_analytics'],
          },
        })
        break
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
      },
      ...tokens,
    }
  }

  /**
   * Login user
   */
  static async login(input: LoginInput) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (!user) {
      throw new AppError(401, 'Invalid email or password')
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(403, 'User account is deactivated')
    }

    // Verify password
    const isPasswordValid = await comparePassword(input.password, user.password)

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password')
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
      },
      ...tokens,
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return user
  }

  /**
   * Verify refresh token and issue new access token
   */
  static async refreshAccessToken(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid refresh token')
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    })

    return tokens
  }

  /**
   * Logout user (in case we need to invalidate tokens server-side)
   */
  static async logout(_userId: string) {
    // In a production app, you might blacklist the token in Redis
    // For now, logout happens client-side by removing tokens
    return { message: 'Logged out successfully' }
  }
}
