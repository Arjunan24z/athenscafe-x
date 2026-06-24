import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import axios, { AxiosInstance } from 'axios'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'PARENT' | 'STUDENT' | 'VENDOR' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: User['role']
  ) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Load tokens from localStorage on mount
  useEffect(() => {
    const loadTokens = () => {
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')

      if (storedAccessToken && storedRefreshToken && storedUser) {
        setAccessToken(storedAccessToken)
        setRefreshToken(storedRefreshToken)
        setUser(JSON.parse(storedUser))
      }

      setIsLoading(false)
    }

    loadTokens()
  }, [])

  // Add auth header to requests
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor)
    }
  }, [accessToken])

  // Handle 401 responses with token refresh
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            if (refreshToken) {
              await refreshAccessToken()
              return apiClient(originalRequest)
            } else {
              logout()
            }
          } catch (err) {
            logout()
            return Promise.reject(err)
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor)
    }
  }, [accessToken, refreshToken])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password })
      const { data } = response.data

      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setUser(data.user)

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      throw error
    }
  }

  const register = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: User['role']
  ) => {
    try {
      const response = await apiClient.post('/api/auth/register', {
        email,
        firstName,
        lastName,
        password,
        role,
      })
      const { data } = response.data

      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setUser(data.user)

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout()
      throw new Error('No refresh token available')
    }

    try {
      const response = await apiClient.post('/api/auth/refresh', { refreshToken })
      const { accessToken: newAccessToken } = response.data.data

      setAccessToken(newAccessToken)
      localStorage.setItem('accessToken', newAccessToken)
    } catch (error) {
      logout()
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    login,
    register,
    logout,
    refreshAccessToken,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
