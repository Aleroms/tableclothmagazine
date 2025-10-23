"use client";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/app/lib/definitions";
import Image from "next/image";

export default function AdminTeamPage() {
  const { user, session, loading, isAdmin } = useCurrentUser();
  const router = useRouter();
  const [team, setTeam] = useState<User[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      router.push("/dashboard");
    }
  }, [loading, session, isAdmin, router]);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!session || !isAdmin) return;

      try {
        setTeamLoading(true);
        setTeamError(null);

        const response = await fetch("/api/admin/team");

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          } else if (response.status === 403) {
            throw new Error("Admin access required");
          } else {
            throw new Error("Failed to fetch team members");
          }
        }

        const teamData = await response.json();
        setTeam(teamData);
      } catch (error) {
        console.error("Error fetching team:", error);
        setTeamError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setTeamLoading(false);
      }
    };

    // Only fetch team data when user is authenticated and is admin
    if (session && isAdmin && !loading) {
      fetchTeam();
    }
  }, [session, isAdmin, loading]);

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
        <h1 className="text-3xl font-bold text-white">Team Management</h1>
        <p className="text-gray-400 mt-2">Manage team members and roles</p>
      </div>

      {/* Admin Verification */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Admin Access Verified
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">
              ✅ Admin route is working correctly
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">✅ Access control is functioning</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">
              ✅ User role: {user?.auth_level?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Total Team Members</h3>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {teamLoading ? "..." : team.length}
          </p>
        </div>
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Admins</h3>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {teamLoading
              ? "..."
              : team.filter((m) => m.auth_level === "admin").length}
          </p>
        </div>
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Team Members</h3>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {teamLoading
              ? "..."
              : team.filter((m) => m.auth_level === "team").length}
          </p>
        </div>
      </div>

      {/* Team Overview */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Team Overview</h2>
          <button
            onClick={() => {
              // Refetch team data
              if (session && isAdmin) {
                const fetchTeam = async () => {
                  try {
                    setTeamLoading(true);
                    setTeamError(null);

                    const response = await fetch("/api/admin/team");

                    if (!response.ok) {
                      throw new Error("Failed to fetch team members");
                    }

                    const teamData = await response.json();
                    setTeam(teamData);
                  } catch (error) {
                    console.error("Error fetching team:", error);
                    setTeamError(
                      error instanceof Error
                        ? error.message
                        : "An error occurred"
                    );
                  } finally {
                    setTeamLoading(false);
                  }
                };
                fetchTeam();
              }
            }}
            disabled={teamLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            {teamLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {teamLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading team members...</div>
          </div>
        ) : teamError ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <div className="text-red-400">
              <strong>Error:</strong> {teamError}
            </div>
          </div>
        ) : team.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No team members found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team
              .sort((a, b) => {
                // Sort by auth_level: admin first, then team, then basic
                const authLevelOrder = { admin: 0, team: 1, basic: 2 };
                const aOrder = authLevelOrder[a.auth_level] ?? 3;
                const bOrder = authLevelOrder[b.auth_level] ?? 3;

                if (aOrder !== bOrder) {
                  return aOrder - bOrder;
                }

                // If same auth level, sort alphabetically by first name
                return a.first_name.localeCompare(b.first_name);
              })
              .map((member) => (
                <div
                  key={member.id}
                  className="bg-[var(--t-dark-1)] border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {member.img_url ? (
                      <Image
                        src={member.img_url}
                        alt={`${member.first_name} ${member.last_name || ""}`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {member.first_name[0]}
                          {member.last_name?.[0] || ""}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {member.first_name} {member.last_name || ""}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {member.role}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.auth_level === "admin"
                              ? "bg-red-900/20 text-red-400 border border-red-500/20"
                              : member.auth_level === "team"
                              ? "bg-blue-900/20 text-blue-400 border border-blue-500/20"
                              : "bg-gray-900/20 text-gray-400 border border-gray-500/20"
                          }`}
                        >
                          {member.auth_level.toUpperCase()}
                        </span>
                        {member.pronouns && (
                          <span className="text-gray-500 text-xs">
                            {member.pronouns}
                          </span>
                        )}
                      </div>
                      {member.description && (
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                          {member.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        {member.email}
                      </span>
                      <button
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log("Edit member:", member.id);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
