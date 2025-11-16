import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getTableclothTeam,
  isUserAdmin,
  createUser,
} from "@/app/lib/database/query";
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

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const {
      email,
      password,
      first_name,
      last_name,
      role,
      auth_level,
      pronouns,
      fav_color,
      description,
      img_url,
    } = body;

    // Validate required fields
    if (!email || !password || !first_name || !role || !auth_level) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: email, password, first_name, role, auth_level",
        },
        { status: 400 }
      );
    }

    // Validate auth_level
    if (!["admin", "team", "basic"].includes(auth_level)) {
      return NextResponse.json(
        { error: "auth_level must be 'admin', 'team', or 'basic'" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create the user
    const newUser = await createUser({
      email,
      password,
      first_name,
      last_name: last_name || null,
      role,
      auth_level,
      pronouns: pronouns || null,
      fav_color: fav_color || null,
      description: description || null,
      img_url: img_url || null,
    });

    // Remove password hash from response
    const safeNewUser = {
      id: newUser.id,
      img_url: newUser.img_url,
      role: newUser.role,
      auth_level: newUser.auth_level,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      pronouns: newUser.pronouns,
      fav_color: newUser.fav_color,
      description: newUser.description,
      email: newUser.email,
    };

    return NextResponse.json(safeNewUser, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
