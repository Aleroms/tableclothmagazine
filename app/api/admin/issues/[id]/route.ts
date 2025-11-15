import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getIssueById,
  updateIssue,
  deleteIssue,
  checkIssueHasArticles,
  isUserAdmin,
} from "@/app/lib/database/query";
import { Session } from "next-auth";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
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

    // Await params and parse ID
    const { id } = await params;
    const issueId = parseInt(id);
    if (isNaN(issueId)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    // Get the issue by ID
    const issue = await getIssueById(issueId);

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
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

    // Await params and parse ID
    const { id } = await params;
    const issueId = parseInt(id);
    if (isNaN(issueId)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const {
      name,
      img_url,
      editors_note,
      editor_id,
      release_date,
      description,
    } = body;

    // Prepare updates object
    const updates: {
      name?: string;
      img_url?: string;
      editors_note?: string;
      editor_id?: string;
      release_date?: Date;
      description?: string;
    } = {};

    if (name !== undefined) updates.name = name;
    if (img_url !== undefined) updates.img_url = img_url;
    if (editors_note !== undefined) updates.editors_note = editors_note;
    if (editor_id !== undefined) updates.editor_id = editor_id;
    if (description !== undefined) updates.description = description;

    // Handle release_date validation if provided
    if (release_date !== undefined) {
      const parsedReleaseDate = new Date(release_date);
      if (isNaN(parsedReleaseDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid release_date format. Please use ISO 8601 format." },
          { status: 400 }
        );
      }
      updates.release_date = parsedReleaseDate;
    }

    // Check if there are any fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Update the issue
    const updatedIssue = await updateIssue(issueId, updates);

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Error updating issue:", error);

    if (error instanceof Error && error.message.includes("Issue not found")) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
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

    // Await params and parse ID
    const { id } = await params;
    const issueId = parseInt(id);
    if (isNaN(issueId)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    // Check if issue exists first
    try {
      await getIssueById(issueId);
    } catch {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Check if issue has associated articles before deletion
    const hasArticles = await checkIssueHasArticles(issueId);
    if (hasArticles) {
      return NextResponse.json(
        {
          error:
            "Cannot delete issue: There are articles associated with this issue",
          canDelete: false,
        },
        { status: 409 } // Conflict status code
      );
    }

    // Delete the issue
    await deleteIssue(issueId);

    return NextResponse.json(
      { message: "Issue deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting issue:", error);

    if (
      error instanceof Error &&
      error.message.includes("Cannot delete issue")
    ) {
      return NextResponse.json(
        {
          error: error.message,
          canDelete: false,
        },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message.includes("Issue not found")) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
