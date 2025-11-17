"use client";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Article, Issue } from "@/app/lib/definitions";

interface AdminArticle extends Article {
  writer_name: string;
  writer_email: string;
  writer_role: string;
  issue_name: string;
  created_at: string;
  updated_at: string;
}

export default function AdminArticlesPage() {
  const { session, loading, isAdmin } = useCurrentUser();
  const router = useRouter();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  // Edit modal state
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(
    null
  );
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    issue_id: "",
    title: "",
    markdown: "",
    release_date: "",
  });

  // Delete modal state
  const [deletingArticle, setDeletingArticle] = useState<AdminArticle | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      router.push("/dashboard");
    }
  }, [loading, session, isAdmin, router]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!session) return;

      try {
        setArticlesLoading(true);
        setArticlesError(null);

        const response = await fetch("/api/admin/articles");

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          } else if (response.status === 403) {
            throw new Error("Admin access required");
          } else {
            throw new Error("Failed to fetch articles");
          }
        }

        const articlesData = await response.json();
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticlesError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchArticles();
  }, [session]);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!session) return;

      try {
        const response = await fetch("/api/admin/issues");

        if (response.ok) {
          const issuesData = await response.json();
          setIssues(issuesData);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, [session]);

  const openEditModal = (article: AdminArticle) => {
    setEditingArticle(article);
    setEditForm({
      issue_id: article.issue_id.toString(),
      title: article.title,
      markdown: article.markdown,
      release_date: new Date(article.release_date).toISOString().split("T")[0],
    });
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditingArticle(null);
    setEditError(null);
    setEditForm({
      issue_id: "",
      title: "",
      markdown: "",
      release_date: "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      setEditLoading(true);
      setEditError(null);

      const updates = {
        issue_id: editForm.issue_id,
        title: editForm.title,
        markdown: editForm.markdown,
        release_date: editForm.release_date,
      };

      const response = await fetch(`/api/admin/articles/${editingArticle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update article";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.log("Could not parse error response:", jsonError);
        }

        throw new Error(errorMessage);
      }

      const updatedArticle = await response.json();

      // Update the article in the list
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === updatedArticle.id
            ? { ...article, ...updatedArticle }
            : article
        )
      );

      closeEditModal();
    } catch (error) {
      console.error("Error updating article:", error);
      setEditError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteModal = (article: AdminArticle) => {
    setDeletingArticle(article);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    setDeletingArticle(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingArticle) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const response = await fetch(
        `/api/admin/articles/${deletingArticle.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to delete article";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.log("Could not parse error response:", jsonError);
        }

        throw new Error(errorMessage);
      }

      // Remove the deleted article from the list
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== deletingArticle.id)
      );

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting article:", error);
      setDeleteError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const getIssueName = (issueId: number) => {
    const issue = issues.find((i) => i.id === issueId);
    return issue ? issue.name : `Issue #${issueId}`;
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
        <div className="text-red-400 text-lg">
          Access Denied: Admin access required
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Manage All Articles</h1>
        <p className="text-gray-400 mt-2">
          Admin view of all articles in the system
        </p>
      </div>

      {/* Article Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Total Articles</h3>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {articlesLoading ? "..." : articles.length}
          </p>
        </div>
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Published</h3>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {articlesLoading
              ? "..."
              : articles.filter((a) => new Date(a.release_date) <= new Date())
                  .length}
          </p>
        </div>
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Drafts</h3>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {articlesLoading
              ? "..."
              : articles.filter((a) => new Date(a.release_date) > new Date())
                  .length}
          </p>
        </div>
        <div className="bg-[var(--t-dark-2)] rounded-lg p-4">
          <h3 className="text-white font-medium">Writers</h3>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {articlesLoading
              ? "..."
              : new Set(articles.map((a) => a.writer_id).filter((id) => id))
                  .size}
          </p>
        </div>
      </div>

      {/* Articles Overview */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">All Articles</h2>
        </div>

        {articlesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading articles...</div>
          </div>
        ) : articlesError ? (
          <div className="text-red-400 py-4">Error: {articlesError}</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No articles found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles
              .sort((a, b) => {
                // Sort by creation date: newest first
                return (
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
                );
              })
              .map((article) => (
                <div
                  key={article.id}
                  className="bg-[var(--t-dark-1)] border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                        <span>By {article.writer_name}</span>
                        <span>•</span>
                        <span>
                          {article.issue_name || getIssueName(article.issue_id)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            new Date(article.release_date) <= new Date()
                              ? "bg-green-900/20 text-green-400 border border-green-500/20"
                              : "bg-yellow-900/20 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {new Date(article.release_date) <= new Date()
                            ? "Published"
                            : "Draft"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Release:{" "}
                          {new Date(article.release_date).toLocaleDateString()}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Created:{" "}
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {article.markdown && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {article.markdown.substring(0, 150)}...
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openEditModal(article)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 rounded border border-blue-500/20 hover:border-blue-400/40 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(article)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded border border-red-500/20 hover:border-red-400/40 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Edit Article
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Writer: {editingArticle.writer_name} (
              {editingArticle.writer_email})
            </p>

            {editError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Issue *
                </label>
                <select
                  value={editForm.issue_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, issue_id: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select an issue</option>
                  {issues.map((issue) => (
                    <option key={issue.id} value={issue.id}>
                      {issue.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Release Date *
                </label>
                <input
                  type="date"
                  value={editForm.release_date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, release_date: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content (Markdown) *
                </label>
                <textarea
                  value={editForm.markdown}
                  onChange={(e) =>
                    setEditForm({ ...editForm, markdown: e.target.value })
                  }
                  required
                  rows={10}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
                  placeholder="Write article content in Markdown format..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {editLoading ? "Updating..." : "Update Article"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={editLoading}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:cursor-not-allowed rounded font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete Article
            </h2>

            <div className="mb-6">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white">
                  &ldquo;{deletingArticle.title}&rdquo;
                </span>{" "}
                by {deletingArticle.writer_name}?
              </p>
              <p className="text-red-400 text-sm">
                This action cannot be undone. The article will be permanently
                removed from the system.
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
                {deleteLoading ? "Deleting..." : "Delete Article"}
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
    </div>
  );
}
