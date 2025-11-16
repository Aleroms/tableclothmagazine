import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getUserById,
  getUserByEmail,
  isUserAdmin,
  updateTeamMember,
  deleteTeamMember,
  updateUserPassword,
} from "@/app/lib/database/query";
import { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
    const teamMember = await getUserById(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
    const existingMember = await getUserById(id);
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
    await updateTeamMember(id, updates);

    // Return the updated team member
    const updatedMember = await getUserById(id);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Prevent self-deletion
    const currentUser = await getUserByEmail(session.user.email);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    console.log(
      `Delete attempt: Current user ID: ${currentUser.id}, Target ID: ${id}`
    ); // Debug log

    if (currentUser.id === id) {
      return NextResponse.json(
        {
          error:
            "Cannot delete your own account. Please ask another admin to delete your account if needed.",
        },
        { status: 403 }
      );
    }

    // Delete the team member
    await deleteTeamMember(id);

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (
        error.message.includes("User not found") ||
        error.message.includes("not a team member")
      ) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes("Cannot delete team member")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
    const teamMember = await getUserById(id);

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Update the password
    await updateUserPassword(teamMember.email, newPassword);

    return NextResponse.json({
      message: "Password reset successfully",
      user: {
        id: teamMember.id,
        email: teamMember.email,
        first_name: teamMember.first_name,
        last_name: teamMember.last_name,
      },
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
