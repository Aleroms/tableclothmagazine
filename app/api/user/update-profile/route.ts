import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateUserProfile } from "@/app/lib/database/query";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      img_url,
      first_name,
      last_name,
      pronouns,
      fav_color,
      description,
      email,
    } = await request.json();


    if (!first_name || first_name.trim() === "") {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    if (!email || email.trim() === "") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Update user profile in database
    await updateUserProfile(session.user.email, {
      img_url: img_url?.trim() || null,
      first_name: first_name.trim(),
      last_name: last_name?.trim() || null,
      pronouns: pronouns?.trim() || null,
      fav_color: fav_color?.trim() || null,
      description: description?.trim() || null,
      email: email.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
