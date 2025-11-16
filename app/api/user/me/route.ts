import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/app/lib/database/query";

export async function GET() {
  try {
    // Get the session to verify user is authenticated
    const session = await getServerSession(authOptions);
    console.log("Session in /api/user/me:", session);

    if (!session || !session.user?.email) {
      console.log("Unauthorized: No session or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user data from database
    console.log("Fetching user by email:", session.user.email);
    const user = await getUserByEmail(session.user.email);
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found in database for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return only the data we need (don't send password hash)
    const userData = {
      id: user.id,
      img_url: user.img_url,
      role: user.role,
      auth_level: user.auth_level,
      first_name: user.first_name,
      last_name: user.last_name,
      pronouns: user.pronouns,
      fav_color: user.fav_color,
      description: user.description,
      email: user.email,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
