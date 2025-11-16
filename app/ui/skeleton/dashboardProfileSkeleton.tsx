export default function DashboardProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="border-b border-gray-700 pb-4">
        <div className="h-8 bg-gray-600 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-64"></div>
      </div>

      {/* User Information Card */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <div className="h-6 bg-gray-600 rounded w-40 mb-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="space-y-4">
            {/* Profile Picture */}
            <div>
              <div className="h-4 bg-gray-600 rounded w-24 mb-1"></div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
                <div className="flex-1 h-12 bg-gray-600 rounded"></div>
              </div>
            </div>

            {/* Name fields */}
            <div>
              <div className="h-4 bg-gray-600 rounded w-20 mb-1"></div>
              <div className="h-12 bg-gray-600 rounded"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-600 rounded w-20 mb-1"></div>
              <div className="h-12 bg-gray-600 rounded"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-600 rounded w-12 mb-1"></div>
              <div className="h-12 bg-gray-600 rounded"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-600 rounded w-16 mb-1"></div>
              <div className="h-12 bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Role & Additional Info */}
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-600 rounded w-24 mb-1"></div>
              <div className="h-8 bg-gray-600 rounded w-20"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-600 rounded w-28 mb-1"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
                <div className="flex-1 h-12 bg-gray-600 rounded"></div>
              </div>
            </div>

            <div>
              <div className="h-4 bg-gray-600 rounded w-16 mb-1"></div>
              <div className="h-12 bg-gray-600 rounded"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-600 rounded w-20 mb-1"></div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-24"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-6">
          <div className="h-4 bg-gray-600 rounded w-20 mb-1"></div>
          <div className="h-24 bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-gray-600 rounded"></div>
          <div className="h-12 bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <div className="h-6 bg-gray-600 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
            <div className="h-32 bg-gray-600 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
            <div className="h-32 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
