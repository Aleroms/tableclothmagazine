export default function SidebarSkeleton() {
  return (
    <aside className="w-64 md:w-72 lg:w-80 flex flex-col p-4 bg-[var(--t-dark-2)] min-h-full animate-pulse">
      {/* Welcome message skeleton */}
      <div className="mb-6">
        <div className="h-8 md:h-10 lg:h-12 bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
      </div>
      
      {/* Divider */}
      <div className="h-px bg-gray-600 mb-3"></div>
      
      {/* Navigation skeleton */}
      <nav className="space-y-2 flex flex-col flex-1">
        {/* Profile link */}
        <div className="h-10 bg-gray-600 rounded"></div>
        
        {/* Admin section */}
        <div className="mt-4 mb-2">
          <div className="h-4 bg-gray-600 rounded w-16 mb-2"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-600 rounded"></div>
            <div className="h-10 bg-gray-600 rounded"></div>
            <div className="h-10 bg-gray-600 rounded"></div>
            <div className="h-10 bg-gray-600 rounded"></div>
          </div>
        </div>
        
        {/* Team section */}
        <div className="mt-4 mb-2">
          <div className="h-4 bg-gray-600 rounded w-12 mb-2"></div>
          <div className="h-10 bg-gray-600 rounded"></div>
        </div>
        
        {/* Sign out button skeleton */}
        <div className="mt-auto pt-6">
          <div className="h-10 bg-gray-600 rounded"></div>
        </div>
      </nav>
    </aside>
  );
}