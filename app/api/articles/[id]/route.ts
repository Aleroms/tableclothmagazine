import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/app/lib/database/query";
import { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the session to verify user is authenticated
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the article by ID
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check if the user owns this article
    if (article.writer_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own articles" },
        { status: 403 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
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

    // Get the session to verify user is authenticated
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the existing article to verify ownership
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check if the user owns this article
    if (existingArticle.writer_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own articles" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { issue_id, title, markdown, release_date } = body;

    const updates: {
      issue_id?: number;
      title?: string;
      markdown?: string;
      release_date?: Date;
    } = {};

    if (issue_id !== undefined) updates.issue_id = parseInt(issue_id, 10);
    if (title !== undefined) updates.title = title;
    if (markdown !== undefined) updates.markdown = markdown;
    if (release_date !== undefined) {
      const parsedDate = new Date(release_date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid release_date format" },
          { status: 400 }
        );
      }
      updates.release_date = parsedDate;
    }

    // Update the article
    const updatedArticle = await updateArticle(id, updates);

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
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

    // Get the session to verify user is authenticated
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the existing article to verify ownership
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check if the user owns this article
    if (existingArticle.writer_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own articles" },
        { status: 403 }
      );
    }

    // Delete the article
    await deleteArticle(id);

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
