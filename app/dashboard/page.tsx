"use client";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import UpdateProfileForm from "@/app/ui/dashboard/updateProfileForm";
import ChangePasswordForm from "@/app/ui/dashboard/changePasswordForm";
import DashboardProfileSkeleton from "@/app/ui/skeleton/dashboardProfileSkeleton";
import Image from "next/image";

export default function Dashboard() {
  const { user, session, loading, isAdmin, isTeam } = useCurrentUser();

  if (loading) {
    return <DashboardProfileSkeleton />;
  }

  if (!session || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-lg">
          Unable to load user information
        </div>
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
        <h2 className="text-xl font-semibold text-white mb-4">
          Your Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                {user.img_url ? (
                  <div className="relative w-16 h-16">
                    <Image
                      src={user.img_url}
                      alt={`${user.first_name} ${user.last_name} profile picture`}
                      fill
                      className="rounded-full object-cover border-2 border-gray-600"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
                <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600 flex-1 text-sm">
                  {user.img_url || "No profile picture set"}
                </div>
              </div>
            </div>

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
                {user.last_name || "Not provided"}
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

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Pronouns
              </label>
              <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600">
                {user.pronouns || "Not specified"}
              </div>
            </div>
          </div>

          {/* Role & Additional Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Access Level
              </label>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    user.auth_level === "admin"
                      ? "bg-red-600 text-white"
                      : user.auth_level === "team"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {user.auth_level.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Favorite Color
              </label>
              <div className="flex items-center space-x-3">
                {user.fav_color ? (
                  <div
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: user.fav_color }}
                  ></div>
                ) : (
                  <div className="w-8 h-8 rounded border border-gray-600 bg-gray-500 flex items-center justify-center">
                    <span className="text-gray-300 text-xs">N/A</span>
                  </div>
                )}
                <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600 flex-1">
                  {user.fav_color || "Not set"}
                </div>
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
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isAdmin ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-white text-sm">Admin Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isTeam ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-white text-sm">Team Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {user.description && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <div className="text-white bg-[var(--t-dark-1)] p-3 rounded border border-gray-600">
              {user.description}
            </div>
          </div>
        )}
      </div>

      {/* Actions Card */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UpdateProfileForm
            user={user}
            onUpdate={() => window.location.reload()}
          />
          <ChangePasswordForm />
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Debug Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Session Data:
            </h3>
            <pre className="text-xs text-gray-300 bg-[var(--t-dark-1)] p-3 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              User Data:
            </h3>
            <pre className="text-xs text-gray-300 bg-[var(--t-dark-1)] p-3 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
