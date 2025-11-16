"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@/app/lib/definitions";

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.email) {
        try {
          console.log("Fetching user data for:", session.user.email);
          const response = await fetch("/api/user/me");
          console.log("Response status:", response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log("User data received:", userData);
            setUser(userData);
          } else {
            const errorData = await response.json();
            console.error(
              "Failed to fetch user data:",
              response.status,
              errorData
            );
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No session or email found:", session);
        setLoading(false);
      }
    }

    if (status !== "loading") {
      fetchUser();
    }
  }, [session, status]);

  return {
    user,
    session,
    loading: status === "loading" || loading,
    isAdmin: user?.auth_level === "admin",
    isTeam: user?.auth_level === "team",
  };
}
