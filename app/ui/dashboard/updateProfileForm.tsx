"use client";
import { useState } from "react";
import { User } from "@/app/lib/definitions";

type UpdateProfileFormProps = {
  user: User;
  onUpdate: () => void;
};

export default function UpdateProfileForm({
  user,
  onUpdate,
}: UpdateProfileFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    img_url: user.img_url || "",
    first_name: user.first_name,
    last_name: user.last_name || "",
    pronouns: user.pronouns || "",
    fav_color: user.fav_color || "",
    description: user.description || "",
    email: user.email,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          setIsOpen(false);
          onUpdate();
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition-colors"
      >
        Update Profile
      </button>
    );
  }

  return (
    <div className="col-span-1 md:col-span-2">
      <div className="bg-[var(--t-dark-1)] p-4 rounded border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Update Profile</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[32rem] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={formData.img_url}
                onChange={(e) =>
                  setFormData({ ...formData, img_url: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--t-dark-2)] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--t-dark-2)] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--t-dark-2)] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--t-dark-2)] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Pronouns
              </label>
              <input
                type="text"
                value={formData.pronouns}
                onChange={(e) =>
                  setFormData({ ...formData, pronouns: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--t-dark-2)] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="they/them, she/her, he/him, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Favorite Color (optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={formData.fav_color || "#000000"}
                  onChange={(e) =>
                    setFormData({ ...formData, fav_color: e.target.value })
                  }
                  className="w-12 h-10 bg-[var(--t-dark-2)] border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.fav_color}
                  onChange={(e) =>
                    setFormData({ ...formData, fav_color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 bg-[var(--t-dark-2)] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty or enter hex code like #ff0000"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, fav_color: "" })}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-[var(--t-dark-2)] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          {success && <div className="text-green-400 text-sm">{success}</div>}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
