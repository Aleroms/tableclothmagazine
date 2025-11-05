"use client";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Article, Issue } from "@/app/lib/definitions";

export default function ArticlePage() {
  const { session, loading, isAdmin, isTeam } = useCurrentUser();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    issue_id: "",
    title: "",
    markdown: "",
    release_date: "",
  });

  // Edit modal state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    issue_id: "",
    title: "",
    markdown: "",
    release_date: "",
  });

  useEffect(() => {
    if (!loading && (!session || (!isAdmin && !isTeam))) {
      router.push("/dashboard");
    }
  }, [loading, session, isAdmin, isTeam, router]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!session) return;

      try {
        setArticlesLoading(true);
        setArticlesError(null);

        const response = await fetch("/api/articles");

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized");
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
        const response = await fetch("/api/issues");

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

  const openCreateModal = () => {
    setShowCreateModal(true);
    setCreateError(null);
    setCreateForm({
      issue_id: "",
      title: "",
      markdown: "",
      release_date: "",
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setCreateForm({
      issue_id: "",
      title: "",
      markdown: "",
      release_date: "",
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCreateLoading(true);
      setCreateError(null);

      const articleData = {
        issue_id: createForm.issue_id,
        title: createForm.title,
        markdown: createForm.markdown,
        release_date: createForm.release_date,
      };

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create article";
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
        } else {
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }
      }

      const newArticle = await response.json();

      // Add the new article to the list
      setArticles((prevArticles) => [newArticle, ...prevArticles]);

      closeCreateModal();
    } catch (error) {
      console.error("Error creating article:", error);
      setCreateError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditModal = (article: Article) => {
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

      const response = await fetch(`/api/articles/${editingArticle.id}`, {
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
          article.id === updatedArticle.id ? updatedArticle : article
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

  if (!session || (!isAdmin && !isTeam)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-lg">
          Access Denied: Team member access required
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">My Articles</h1>
        <p className="text-gray-400 mt-2">Create and manage your articles</p>
      </div>

      {/* Article Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Articles Overview */}
      <div className="bg-[var(--t-dark-2)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Articles Overview
          </h2>
          <button
            onClick={openCreateModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Create Article
          </button>
        </div>

        {articlesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading articles...</div>
          </div>
        ) : articlesError ? (
          <div className="text-red-400 py-4">Error: {articlesError}</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No articles yet</p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Create Your First Article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles
              .sort((a, b) => {
                // Sort by release date: newest first
                return (
                  new Date(b.release_date).getTime() -
                  new Date(a.release_date).getTime()
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
                      <p className="text-gray-400 text-sm">
                        {getIssueName(article.issue_id)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
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
                          {new Date(article.release_date).toLocaleDateString()}
                        </span>
                      </div>
                      {article.markdown && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {article.markdown.substring(0, 100)}...
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
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create New Article
            </h2>

            {createError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Issue *
                </label>
                <select
                  value={createForm.issue_id}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, issue_id: e.target.value })
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
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
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
                  value={createForm.release_date}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      release_date: e.target.value,
                    })
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
                  value={createForm.markdown}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, markdown: e.target.value })
                  }
                  required
                  rows={10}
                  className="w-full px-3 py-2 bg-[var(--t-dark-1)] border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
                  placeholder="Write your article in Markdown format..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {createLoading ? "Creating..." : "Create Article"}
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

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--t-dark-2)] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Edit Article
            </h2>

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
                  placeholder="Write your article in Markdown format..."
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
    </div>
  );
}
