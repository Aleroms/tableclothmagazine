import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isUserAdmin } from "@/app/lib/database/query";
import sql from "@/app/lib/database/db";
import { Session } from "next-auth";

// GET /api/admin/articles - Get all articles (admin only)
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminStatus = await isUserAdmin(session.user.email);
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all articles with writer information
    const articles = await sql`
      SELECT 
        a.id,
        a.title,
        a.markdown,
        a.release_date,
        a.issue_id,
        a.writer_id,
        a.created_at,
        a.updated_at,
        u.first_name || ' ' || u.last_name as writer_name,
        u.email as writer_email,
        i.name as issue_name
      FROM articles a
      LEFT JOIN users u ON a.writer_id = u.id
      LEFT JOIN issues i ON a.issue_id = i.id
      ORDER BY a.created_at DESC
    `;

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching all articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
