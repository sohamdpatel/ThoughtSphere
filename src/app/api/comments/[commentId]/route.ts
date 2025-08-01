import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";
export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id || !session.user.role) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: You must be logged in to delete a post.",
      },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const comment = await Comment.findById(commentId);
    if (!comment)
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );

    const currentUserId = session.user._id;
    const currentUserRole = session.user.role;

    const isAuthor = comment.authorId.equals(
      new mongoose.Types.ObjectId(currentUserId)
    );
    const isAdmin = currentUserRole === "admin";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: You do not have permission to delete this comment.",
        },
        { status: 403 }
      );
    }

    

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting post with slug "${slug}":`, error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the post.",
      },
      { status: 500 }
    );
  }
}
