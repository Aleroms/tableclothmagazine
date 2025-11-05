"use client";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Issue, User } from "@/app/lib/definitions";
import Image from "next/image";

// Safe image component that handles errors
function IssueImage({ src, alt }: { src: string | null; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-16 h-20 rounded bg-gray-600 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-400 text-xs">
          {hasError ? "Invalid" : "No Image"}
        </span>
      </div>
    );
  }

  return (
    <div className="w-16 h-20 rounded bg-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={64}
        height={80}
        className="w-16 h-20 rounded object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function AdminIssuesPage() {
  const { session, loading, isAdmin } = useCurrentUser();
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState<string | null>(null);

  // Team members for editor dropdown
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  // Edit modal state
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    img_url: "",
    editors_note: "",
    editor_name: "", // Changed from editor_id to editor_name for display
    release_date: "",
    description: "",
  });

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    img_url: "",
    editors_note: "",
    editor_name: "",
    release_date: "",
    description: "",
  });

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      router.push("/dashboard");
    }
  }, [loading, session, isAdmin, router]);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!session || !isAdmin) return;

      try {
        setIssuesLoading(true);
        setIssuesError(null);

        const response = await fetch("/api/admin/issues");

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          } else if (response.status === 403) {
            throw new Error("Admin access required");
          } else {
            throw new Error("Failed to fetch issues");
          }
        }

        const issuesData = await response.json();
        setIssues(issuesData);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setIssuesError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIssuesLoading(false);
      }
    };

    // Only fetch issues data when user is authenticated and is admin
    if (session && isAdmin && !loading) {
      fetchIssues();
    }
  }, [session, isAdmin, loading]);

  // Fetch team members for editor dropdown
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!session || !isAdmin) return;

      try {
        const response = await fetch("/api/admin/team");

        if (!response.ok) {
          throw new Error("Failed to fetch team members");
        }

        const teamData = await response.json();
        setTeamMembers(teamData);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    if (session && isAdmin && !loading) {
      fetchTeamMembers();
    }
  }, [session, isAdmin, loading]);

  // Helper function to get editor name by ID
  const getEditorName = (editorId: string): string => {
    const editor = teamMembers.find((member) => member.id === editorId);
    return editor
      ? `${editor.first_name} ${editor.last_name || ""}`.trim()
      : editorId;
  };

  // Helper function to get editor ID by name
  const getEditorIdByName = (editorName: string): string => {
    const editor = teamMembers.find(
      (member) =>
        `${member.first_name} ${member.last_name || ""}`.trim() === editorName
    );
    return editor ? editor.id : "";
  };

  // Edit functions
  const openEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setEditForm({
      name: issue.name,
      img_url: issue.img_url || "",
      editors_note: issue.editors_note || "",
      editor_name: getEditorName(issue.editor_id), // Convert ID to name
      release_date: new Date(issue.release_date).toISOString().split("T")[0],
      description: issue.description || "",
    });
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditingIssue(null);
    setEditError(null);
    setEditForm({
      name: "",
      img_url: "",
      editors_note: "",
      editor_name: "", // Changed from editor_id to editor_name
      release_date: "",
      description: "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;

    try {
      setEditLoading(true);
      setEditError(null);

      // Convert editor name back to ID for submission
      const editorId = getEditorIdByName(editForm.editor_name);
      if (!editorId) {
        throw new Error("Invalid editor selected");
      }

      const updates = {
        name: editForm.name,
        img_url: editForm.img_url,
        editors_note: editForm.editors_note,
        editor_id: editorId, // Submit the ID, not the name
        release_date: editForm.release_date,
        description: editForm.description,
      };

      const response = await fetch(`/api/admin/issues/${editingIssue.id}`, {
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
          throw new Error("Issue not found");
        } else {
          throw new Error("Failed to update issue");
        }
      }

      const updatedIssue = await response.json();

      // Update the issues list with the updated issue
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );

      closeEditModal();
    } catch (error) {
      console.error("Error updating issue:", error);
      setEditError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (issueId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this issue? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/issues/${issueId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          alert(errorData.error);
          return;
        }
        throw new Error("Failed to delete issue");
      }

      // Remove the deleted issue from the list
      setIssues((prevIssues) =>
        prevIssues.filter((issue) => issue.id !== issueId)
      );
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert("Failed to delete issue");
    }
  };

  // Create functions
  const openCreateModal = () => {
    setShowCreateModal(true);
    setCreateForm({
      name: "",
      img_url: "",
      editors_note: "",
      editor_name: "",
      release_date: "",
      description: "",
    });
    setCreateError(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setCreateForm({
      name: "",
      img_url: "",
      editors_note: "",
      editor_name: "",
      release_date: "",
      description: "",
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCreateLoading(true);
      setCreateError(null);

      // Convert editor name back to ID for submission
      const editorId = getEditorIdByName(createForm.editor_name);
      if (!editorId) {
        throw new Error("Invalid editor selected");
      }

      const newIssueData = {
        name: createForm.name,
        img_url: createForm.img_url,
        editors_note: createForm.editors_note,
        editor_id: editorId, // Submit the ID, not the name
        release_date: createForm.release_date,
        description: createForm.description,
      };

      console.log("Sending issue data:", newIssueData); // Debug log

      const response = await fetch("/api/admin/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIssueData),
      });

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        // Get detailed error message from server
        let errorMessage = "Failed to create issue";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.log("Server error details:", errorData); // Debug log
        } catch (jsonError) {
          console.log("Could not parse error response:", jsonError);
        }

        if (response.status === 400) {
          throw new Error(`Invalid data: ${errorMessage}`);
        } else if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status === 403) {
          throw new Error("Admin access required");
        } else {
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }
      }

      const newIssue = await response.json();
      console.log("Created issue:", newIssue); // Debug log

      // Add the new issue to the list
      setIssues((prevIssues) => [newIssue, ...prevIssues]);

      closeCreateModal();
    } catch (error) {
      console.error("Error creating issue:", error);
      setCreateError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setCreateLoading(false);
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
        <h1 className="text-3xl font-bold text-white">Issues Management</h1>
        <p className="text-gray-400 mt-2">
          Manage magazine issues and publications
        </p>
      </div>

      {/* Issues Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Total Issues</h3>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {issuesLoading ? "..." : issues.length}
          </p>
        </div>
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Published</h3>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {issuesLoading
              ? "..."
              : issues.filter(
                  (issue) => new Date(issue.release_date) <= new Date()
                ).length}
          </p>
        </div>
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Upcoming</h3>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {issuesLoading
              ? "..."
              : issues.filter(
                  (issue) => new Date(issue.release_date) > new Date()
                ).length}
          </p>
        </div>
      </div>

      {/* Issues Overview */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Issues Overview</h2>
          <div className="flex space-x-2">
            <button
              onClick={openCreateModal}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Create New Issue
            </button>
            <button
              onClick={() => {
                // Refetch issues data
                if (session && isAdmin) {
                  const fetchIssues = async () => {
                    try {
                      setIssuesLoading(true);
                      setIssuesError(null);

                      const response = await fetch("/api/admin/issues");

                      if (!response.ok) {
                        throw new Error("Failed to fetch issues");
                      }

                      const issuesData = await response.json();
                      setIssues(issuesData);
                    } catch (error) {
                      console.error("Error fetching issues:", error);
                      setIssuesError(
                        error instanceof Error
                          ? error.message
                          : "An error occurred"
                      );
                    } finally {
                      setIssuesLoading(false);
                    }
                  };
                  fetchIssues();
                }
              }}
              disabled={issuesLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              {issuesLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {issuesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading issues...</div>
          </div>
        ) : issuesError ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <div className="text-red-400">
              <strong>Error:</strong> {issuesError}
            </div>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No issues found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues
              .sort((a, b) => {
                // Sort by release date: newest first
                return (
                  new Date(b.release_date).getTime() -
                  new Date(a.release_date).getTime()
                );
              })
              .map((issue) => (
                <div
                  key={issue.id}
                  className="bg-[var(--t-dark-1)] border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <IssueImage src={issue.img_url} alt={issue.name} />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {issue.name}
                      </h3>
                      <p className="text-gray-400 text-sm">Issue #{issue.id}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            new Date(issue.release_date) <= new Date()
                              ? "bg-green-900/20 text-green-400 border border-green-500/20"
                              : "bg-yellow-900/20 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {new Date(issue.release_date) <= new Date()
                            ? "Published"
                            : "Upcoming"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(issue.release_date).toLocaleDateString()}
                      </p>
                      {issue.description && (
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                          {issue.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        Editor: {getEditorName(issue.editor_id)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(issue)}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(issue.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Edit Issue</h3>
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
                  Issue Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editForm.img_url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, img_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Editor *
                </label>
                <select
                  required
                  value={editForm.editor_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, editor_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select an editor</option>
                  {teamMembers.map((member) => (
                    <option
                      key={member.id}
                      value={`${member.first_name} ${
                        member.last_name || ""
                      }`.trim()}
                    >
                      {`${member.first_name} ${member.last_name || ""}`.trim()}{" "}
                      ({member.auth_level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Release Date *
                </label>
                <input
                  type="date"
                  required
                  value={editForm.release_date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, release_date: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Editor&apos;s Note *
                </label>
                <textarea
                  required
                  value={editForm.editors_note}
                  onChange={(e) =>
                    setEditForm({ ...editForm, editors_note: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {editLoading ? "Updating..." : "Update Issue"}
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Create New Issue
              </h3>
              <button
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
                <div className="text-red-400 text-sm">{createError}</div>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Issue Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Spring 2024 Edition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={createForm.img_url}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, img_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Editor *
                </label>
                <select
                  required
                  value={createForm.editor_name}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      editor_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select an editor</option>
                  {teamMembers.map((member) => (
                    <option
                      key={member.id}
                      value={`${member.first_name} ${
                        member.last_name || ""
                      }`.trim()}
                    >
                      {`${member.first_name} ${member.last_name || ""}`.trim()}{" "}
                      ({member.auth_level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Release Date *
                </label>
                <input
                  type="date"
                  required
                  value={createForm.release_date}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      release_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Brief description of this issue..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Editor&apos;s Note *
                </label>
                <textarea
                  required
                  value={createForm.editors_note}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      editors_note: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Editor's note for this issue..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {createLoading ? "Creating..." : "Create Issue"}
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createLoading}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded font-medium transition-colors"
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
