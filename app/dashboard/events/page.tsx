"use client";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminEventsPage() {
  const { user, session, loading, isAdmin } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      router.push("/dashboard");
    }
  }, [loading, session, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-lg">Access Denied: Admin Only</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Events Management</h1>
        <p className="text-gray-400 mt-2">Manage events and activities</p>
      </div>

      {/* Admin Verification */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Admin Access Verified</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">✅ Events admin route is working correctly</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">✅ Admin-only access enforced</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">✅ Current user: {user?.first_name} {user?.last_name}</span>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Events Management Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--t-dark-1)] p-4 rounded border border-gray-600">
            <h4 className="text-white font-medium mb-2">Create Events</h4>
            <p className="text-gray-400 text-sm">Schedule and organize new events</p>
          </div>
          <div className="bg-[var(--t-dark-1)] p-4 rounded border border-gray-600">
            <h4 className="text-white font-medium mb-2">Event Calendar</h4>
            <p className="text-gray-400 text-sm">View and manage event schedules</p>
          </div>
          <div className="bg-[var(--t-dark-1)] p-4 rounded border border-gray-600">
            <h4 className="text-white font-medium mb-2">Attendee Management</h4>
            <p className="text-gray-400 text-sm">Track registrations and attendance</p>
          </div>
          <div className="bg-[var(--t-dark-1)] p-4 rounded border border-gray-600">
            <h4 className="text-white font-medium mb-2">Event Analytics</h4>
            <p className="text-gray-400 text-sm">Monitor event performance and feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}