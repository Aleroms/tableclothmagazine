import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getArticlesByWriterId, createArticle } from "@/app/lib/database/query";
import { Session } from "next-auth";

export async function GET() {
  try {
    // Get the session to verify user is authenticated
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's articles
    const articles = await getArticlesByWriterId(session.user.id);

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify user is authenticated
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { issue_id, title, markdown, release_date } = body;

    // Validate required fields
    if (!issue_id || !title || !markdown || !release_date) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: issue_id, title, markdown, release_date",
        },
        { status: 400 }
      );
    }

    // Parse and validate the date
    const parsedDate = new Date(release_date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid release_date format" },
        { status: 400 }
      );
    }

    // Create the article
    const newArticle = await createArticle({
      issue_id: parseInt(issue_id, 10),
      writer_id: session.user.id,
      title,
      markdown,
      release_date: parsedDate,
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
