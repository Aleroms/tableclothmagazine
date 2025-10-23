import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getUserById,
  isUserAdmin,
  updateTeamMember,
} from "@/app/lib/database/query";
import { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the team member by ID
    const teamMember = await getUserById(params.id);

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Check if the user is actually a team member (admin or team level)
    if (!["admin", "team"].includes(teamMember.auth_level)) {
      return NextResponse.json(
        { error: "User is not a team member" },
        { status: 404 }
      );
    }

    // Remove password hash from response
    const safeTeamMember = {
      id: teamMember.id,
      img_url: teamMember.img_url,
      role: teamMember.role,
      auth_level: teamMember.auth_level,
      first_name: teamMember.first_name,
      last_name: teamMember.last_name,
      pronouns: teamMember.pronouns,
      fav_color: teamMember.fav_color,
      description: teamMember.description,
      email: teamMember.email,
    };

    return NextResponse.json(safeTeamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the existing team member to verify they exist
    const existingMember = await getUserById(params.id);
    if (!existingMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      role,
      auth_level,
      first_name,
      last_name,
      pronouns,
      fav_color,
      description,
    } = body;

    // Validate auth_level if provided
    if (auth_level && !["admin", "team", "basic"].includes(auth_level)) {
      return NextResponse.json(
        { error: "Invalid auth_level" },
        { status: 400 }
      );
    }

    // Prepare updates object
    const updates: {
      role?: string;
      auth_level?: "admin" | "team" | "basic";
      first_name?: string;
      last_name?: string | null;
      pronouns?: string | null;
      fav_color?: string | null;
      description?: string | null;
    } = {};

    if (role !== undefined) updates.role = role;
    if (auth_level !== undefined) updates.auth_level = auth_level;
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (pronouns !== undefined) updates.pronouns = pronouns;
    if (fav_color !== undefined) updates.fav_color = fav_color;
    if (description !== undefined) updates.description = description;

    // Update the team member
    await updateTeamMember(params.id, updates);

    // Return the updated team member
    const updatedMember = await getUserById(params.id);
    const safeUpdatedMember = {
      id: updatedMember.id,
      img_url: updatedMember.img_url,
      role: updatedMember.role,
      auth_level: updatedMember.auth_level,
      first_name: updatedMember.first_name,
      last_name: updatedMember.last_name,
      pronouns: updatedMember.pronouns,
      fav_color: updatedMember.fav_color,
      description: updatedMember.description,
      email: updatedMember.email,
    };

    return NextResponse.json(safeUpdatedMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
