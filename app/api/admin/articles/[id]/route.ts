import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import {
  isUserAdmin,
  deleteArticle,
  updateArticle,
  getArticleById,
} from "@/app/lib/database/query";
import { Session } from "next-auth";

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/articles/[id] - Get specific article (admin only)
export async function GET(request: NextRequest, { params }: Props) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/articles/[id] - Update specific article (admin only)
export async function PUT(request: NextRequest, { params }: Props) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { issue_id, title, markdown, release_date } = body;

    if (!issue_id || !title || !markdown || !release_date) {
      return NextResponse.json(
        {
          error:
            "All fields are required: issue_id, title, markdown, release_date",
        },
        { status: 400 }
      );
    }

    // Check if article exists
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const updatedArticle = await updateArticle(id, {
      issue_id: parseInt(issue_id),
      title,
      markdown,
      release_date,
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/articles/[id] - Delete specific article (admin only)
export async function DELETE(request: NextRequest, { params }: Props) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Check if article exists
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await deleteArticle(id, existingArticle.issue_id);

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
