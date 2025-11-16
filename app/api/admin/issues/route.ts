import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getAllIssues,
  createIssue,
  isUserAdmin,
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

    // Fetch all issues
    const issues = await getAllIssues();

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
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
      name,
      img_url,
      editors_note,
      editor_id,
      release_date,
      description,
    } = body;

    // Validate required fields
    if (!name || !editor_id || !release_date) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, editor_id, release_date",
        },
        { status: 400 }
      );
    }

    // Validate and parse release_date
    const parsedReleaseDate = new Date(release_date);
    if (isNaN(parsedReleaseDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid release_date format. Please use ISO 8601 format." },
        { status: 400 }
      );
    }

    // Create the issue
    const newIssue = await createIssue({
      name,
      img_url: img_url || null,
      editors_note: editors_note || null,
      editor_id: editor_id.toString(),
      release_date: parsedReleaseDate,
      description: description || null,
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
