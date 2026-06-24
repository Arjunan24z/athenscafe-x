import { Request, Response } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/auth.js'
import { RegisterSchema, LoginSchema } from '../utils/validation.js'
import { AppError } from '../utils/errors.js'

/**
 * POST /api/auth/register
 * Register a new user
 */
export const registerController = async (req: Request, res: Response) => {
  // Validate input
  const input = RegisterSchema.parse(req.body)

  // Register user
  const result = await AuthService.register(input)

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: result,
  })
}

/**
 * POST /api/auth/login
 * Login user and get tokens
 */
export const loginController = async (req: Request, res: Response) => {
  // Validate input
  const input = LoginSchema.parse(req.body)

  // Login user
  const result = await AuthService.login(input)

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: result,
  })
}

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new AppError(400, 'Refresh token is required')
  }

  // Verify refresh token format (in production, verify JWT signature)
  // For now, we're relying on JWT verification in middleware

  if (!req.userId) {
    throw new AppError(401, 'Invalid refresh token')
  }

  const tokens = await AuthService.refreshAccessToken(req.userId)

  res.status(200).json({
    status: 'success',
    message: 'Token refreshed successfully',
    data: tokens,
  })
}

/**
 * POST /api/auth/logout
 * Logout user
 */
export const logoutController = async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new AppError(401, 'Not authenticated')
  }

  const result = await AuthService.logout(req.userId)

  res.status(200).json({
    status: 'success',
    message: result.message,
  })
}

/**
 * GET /api/auth/me
 * Get current user
 */
export const getMeController = async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new AppError(401, 'Not authenticated')
  }

  const user = await AuthService.getUserById(req.userId)

  res.status(200).json({
    status: 'success',
    data: user,
  })
}
