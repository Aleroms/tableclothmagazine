import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTableclothTeam, isUserAdmin } from "@/app/lib/database/query";
import { Session } from "next-auth";

export async function GET() {
  try {
    // Get the session to verify user is authenticated and is admin
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(session.user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all team members
    const teamMembers = await getTableclothTeam();

    // Remove password hashes from response
    const safeTeamMembers = teamMembers.map((member) => ({
      id: member.id,
      img_url: member.img_url,
      role: member.role,
      auth_level: member.auth_level,
      first_name: member.first_name,
      last_name: member.last_name,
      pronouns: member.pronouns,
      fav_color: member.fav_color,
      description: member.description,
      email: member.email,
    }));

    return NextResponse.json(safeTeamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
