"use client";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export default function Dashboard() {
  const { user, session, loading, isAdmin, isTeam } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading user information...</div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-lg">Unable to load user information</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user.first_name}!</p>
      </div>

      {/* User Information Card */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                First Name
              </label>
              <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600">
                {user.first_name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Last Name
              </label>
              <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600">
                {user.last_name || 'Not provided'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600">
                {user.email}
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Access Level
              </label>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  user.auth_level === 'admin' 
                    ? 'bg-red-600 text-white' 
                    : user.auth_level === 'team'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}>
                  {user.auth_level.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                User ID
              </label>
              <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600 font-mono text-sm">
                {user.id}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Permissions
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white text-sm">Admin Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isTeam ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white text-sm">Team Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition-colors">
            Update Profile
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded transition-colors">
            Change Password
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors">
            View Activity
          </button>
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Debug Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Session Data:</h3>
            <pre className="text-xs text-gray-300 bg-[var(--t-dark-1)] p-3 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">User Data:</h3>
            <pre className="text-xs text-gray-300 bg-[var(--t-dark-1)] p-3 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
