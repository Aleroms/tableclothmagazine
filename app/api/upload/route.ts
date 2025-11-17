import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  const s3Folders = ["user", "article"];
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string; // "user" | "article"
    const issueNumber = formData.get("issueNumber") as string | null;
    const articleId = formData.get("articleId") as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!category || !s3Folders.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (category === "article" && (!issueNumber || !articleId)) {
      return NextResponse.json(
        { error: "Issue number and article ID required for article uploads" },
        { status: 400 }
      );
    }

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get file extension
    const fileExtension = file.name.split(".").pop() || "jpg";

    // Generate S3 key (path in bucket)
    // Format for user: user/{userId}.{ext} (overwrites previous)
    //     or article: article/{issueNumber}/{articleId}/{timestamp}-{filename}
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    let s3Key: string;
    if (category === "user") {
      // Use user email as unique identifier to ensure one profile pic per user
      const userIdentifier = session.user?.email?.split("@")[0] || "unknown";
      const timestamp = Date.now();
      s3Key = `user/${userIdentifier}-${timestamp}.${fileExtension}`;
    } else {
      // category === "article" - keep timestamp for articles
      const timestamp = Date.now();
      s3Key = `article/${issueNumber}/${articleId}/${timestamp}-${sanitizedFilename}`;
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY!,
      },
    });

    // For user uploads, delete old profile pictures first
    if (category === "user") {
      try {
        const userIdentifier = session.user?.email?.split("@")[0] || "unknown";
        const listCommand = new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET,
          Prefix: `user/${userIdentifier}.`,
        });

        const listResponse = await s3Client.send(listCommand);

        // Delete all old profile pictures for this user
        if (listResponse.Contents && listResponse.Contents.length > 0) {
          for (const object of listResponse.Contents) {
            if (object.Key) {
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: process.env.AWS_BUCKET,
                  Key: object.Key,
                })
              );
            }
          }
        }
      } catch (deleteError) {
        console.error("Error deleting old profile picture:", deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
