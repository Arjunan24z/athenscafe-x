import { Router, Request, Response } from 'express'
import { asyncHandler } from '../utils/errors.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  getMeController,
} from '../controllers/auth.js'

const router = Router()

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Parent/Student/Vendor/Admin)
 * @access  Public
 */
router.post('/register', asyncHandler(registerController))

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get access & refresh tokens
 * @access  Public
 */
router.post('/login', asyncHandler(loginController))

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', asyncHandler(refreshTokenController))

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post('/logout', authMiddleware, asyncHandler(logoutController))

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authMiddleware, asyncHandler(getMeController))

export default router
