import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getAllIssues } from "@/app/lib/database/query";
import { Session } from "next-auth";

// GET /api/issues - Get all issues (for team members to select when creating articles)
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Any authenticated user can view issues (needed for article creation)
    const issues = await getAllIssues();

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}