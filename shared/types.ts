// Shared types across frontend and backend
// Copy to both client/ and server/ as needed

export enum UserRole {
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum DietType {
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  HALAL = 'HALAL',
  KOSHER = 'KOSHER',
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
}

export interface AuthPayload {
  userId: string
  email: string
  role: UserRole
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data?: T
  message?: string
  errors?: Record<string, string>
}
