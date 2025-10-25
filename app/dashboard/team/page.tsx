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

  // Edit modal state
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    role: "",
    auth_level: "" as "admin" | "team" | "basic" | "",
    first_name: "",
    last_name: "",
    pronouns: "",
    fav_color: "",
    description: "",
  });

  // Delete modal state
  const [deletingMember, setDeletingMember] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "",
    auth_level: "" as "admin" | "team" | "basic" | "",
    pronouns: "",
    fav_color: "",
    description: "",
    img_url: "",
  });

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

  // Edit functions
  const openEditModal = (member: User) => {
    setEditingMember(member);
    setEditForm({
      role: member.role,
      auth_level: member.auth_level,
      first_name: member.first_name,
      last_name: member.last_name || "",
      pronouns: member.pronouns || "",
      fav_color: member.fav_color || "",
      description: member.description || "",
    });
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditingMember(null);
    setEditError(null);
    setEditForm({
      role: "",
      auth_level: "",
      first_name: "",
      last_name: "",
      pronouns: "",
      fav_color: "",
      description: "",
    });
  };

  const openDeleteModal = (member: User) => {
    setDeletingMember(member);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    setDeletingMember(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMember) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const response = await fetch(`/api/admin/team/${deletingMember.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete team member";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.log("Could not parse error response:", jsonError);
        }

        if (response.status === 400) {
          throw new Error(errorMessage);
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 403) {
          throw new Error("Admin access required");
        } else if (response.status === 404) {
          throw new Error("Team member not found");
        } else {
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }
      }

      // Remove the deleted member from the team list
      setTeam((prevTeam) =>
        prevTeam.filter((member) => member.id !== deletingMember.id)
      );

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting team member:", error);
      setDeleteError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    setCreateError(null);
    setCreateForm({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "",
      auth_level: "",
      pronouns: "",
      fav_color: "",
      description: "",
      img_url: "",
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setCreateForm({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "",
      auth_level: "",
      pronouns: "",
      fav_color: "",
      description: "",
      img_url: "",
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCreateLoading(true);
      setCreateError(null);

      const newMemberData = {
        email: createForm.email,
        password: createForm.password,
        first_name: createForm.first_name,
        last_name: createForm.last_name || null,
        role: createForm.role,
        auth_level: createForm.auth_level,
        pronouns: createForm.pronouns || null,
        fav_color: createForm.fav_color || null,
        description: createForm.description || null,
        img_url: createForm.img_url || null,
      };

      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMemberData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create team member";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.log("Could not parse error response:", jsonError);
        }

        if (response.status === 400) {
          throw new Error(`Invalid data: ${errorMessage}`);
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 403) {
          throw new Error("Admin access required");
        } else if (response.status === 409) {
          throw new Error(errorMessage);
        } else {
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }
      }

      const newMember = await response.json();

      // Add the new member to the team list
      setTeam((prevTeam) => [newMember, ...prevTeam]);

      closeCreateModal();
    } catch (error) {
      console.error("Error creating team member:", error);
      setCreateError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      setEditLoading(true);
      setEditError(null);

      const updates = {
        role: editForm.role,
        auth_level: editForm.auth_level,
        first_name: editForm.first_name,
        last_name: editForm.last_name || null,
        pronouns: editForm.pronouns || null,
        fav_color: editForm.fav_color || null,
        description: editForm.description || null,
      };

      const response = await fetch(`/api/admin/team/${editingMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Invalid data provided");
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 403) {
          throw new Error("Admin access required");
        } else if (response.status === 404) {
          throw new Error("Team member not found");
        } else {
          throw new Error("Failed to update team member");
        }
      }

      const updatedMember = await response.json();

      // Update the team list with the updated member
      setTeam((prevTeam) =>
        prevTeam.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );

      closeEditModal();
    } catch (error) {
      console.error("Error updating team member:", error);
      setEditError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setEditLoading(false);
    }
  };

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
          <div className="flex space-x-3">
            <button
              onClick={openCreateModal}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Add Member
            </button>
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
                      {session?.user?.email === member.email ? (
                        <span className="text-green-400 text-xs font-medium">
                          (Self)
                        </span>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openEditModal(member)}
                            className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(member)}
                            className="text-red-400 hover:text-red-300 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Edit Team Member
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
                <div className="text-red-400 text-sm">{editError}</div>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.first_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, first_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, last_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Editor, Writer, Designer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Access Level *
                </label>
                <select
                  required
                  value={editForm.auth_level}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      auth_level: e.target.value as "admin" | "team" | "basic",
                    })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select access level</option>
                  <option value="basic">Basic</option>
                  <option value="team">Team</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Pronouns
                </label>
                <input
                  type="text"
                  value={editForm.pronouns}
                  onChange={(e) =>
                    setEditForm({ ...editForm, pronouns: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., they/them, she/her, he/him"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Favorite Color
                </label>
                <input
                  type="text"
                  value={editForm.fav_color}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fav_color: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Blue, #FF5733"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Brief bio or description..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {editLoading ? "Updating..." : "Update Member"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={editLoading}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete Team Member
            </h2>

            <div className="mb-6">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white">
                  {deletingMember.first_name} {deletingMember.last_name}
                </span>
                ?
              </p>
              <p className="text-red-400 text-sm">
                This action cannot be undone. The user will be permanently
                removed from the team.
              </p>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
              >
                {deleteLoading ? "Deleting..." : "Delete Member"}
              </button>
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:cursor-not-allowed rounded font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Member Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Add New Team Member
            </h2>

            {createError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter password"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.first_name}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        first_name: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={createForm.last_name}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role *
                </label>
                <input
                  type="text"
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Editor, Writer, Designer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Access Level *
                </label>
                <select
                  value={createForm.auth_level}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      auth_level: e.target.value as "admin" | "team" | "basic",
                    })
                  }
                  required
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select access level</option>
                  <option value="basic">Basic</option>
                  <option value="team">Team</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Pronouns
                </label>
                <input
                  type="text"
                  value={createForm.pronouns}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, pronouns: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., they/them, she/her, he/him"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Favorite Color
                </label>
                <input
                  type="text"
                  value={createForm.fav_color}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, fav_color: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Blue, #FF5733"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Brief bio or description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={createForm.img_url}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, img_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {createLoading ? "Adding..." : "Add Member"}
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createLoading}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:cursor-not-allowed rounded font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
