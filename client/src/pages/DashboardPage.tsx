import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">Welcome, {user?.firstName}!</h1>
            <p className="text-gray-600 mt-2">
              Role: <span className="font-semibold capitalize">{user?.role.toLowerCase()}</span>
            </p>
          </div>

          <div className="space-x-2">
            {user?.role === 'ADMIN' && (
              <button 
                onClick={() => navigate('/admin')} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Admin Panel
              </button>
            )}
            <button onClick={logout} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
              Logout
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="text-lg font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">User ID</p>
              <p className="text-lg font-mono text-gray-500">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Coming Soon</h2>
          <p className="text-blue-800">
            More features are being developed. Check back soon for:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-blue-800">
            <li>Menu management (for vendors)</li>
            <li>Food ordering system</li>
            <li>Wallet & payments</li>
            <li>Analytics dashboards</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
