import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;
  const { comment } = await request.json();

  const session = await getServerSession(authOptions);

  //   if (!session || !session.user || !session.user._id || !session.user.role) {
  //     return NextResponse.json(
  //       {
  //         success: false,
  //         message: "Unauthorized: You must be logged in to update a post.",
  //       },
  //       { status: 401 }
  //     );
  //   }

  await dbConnect();

  try {
    const currentUserId = new mongoose.Types.ObjectId(
      "6889cc0ea392e6c9ad687453"
    );
    // TODO add current.user._id

    const parentComment = await Comment.findById(commentId);
    if (!parentComment)
      return NextResponse.json(
        { success: false, message: "Parent comment not found" },
        { status: 404 }
      );

    await Comment.create({
      postId: parentComment.postId,
      authorId: currentUserId,
      comment,
      parentComment: parentComment._id,
    });

    await Comment.findByIdAndUpdate(parentComment, { $inc: { replyCount: 1 } });

    return NextResponse.json(
      { success: true, message: "Comment on Post successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while commenting.", error);

    return NextResponse.json(
      { success: false, message: "Server error while Like" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;

  await dbConnect();

  try {
    const commentReplies = await Comment.find({ parentComment: commentId })
      .populate("authorId", "username image")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Replies retrieved successfully.",
        data: commentReplies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all commentReplies:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve commentReplies.",
      },
      { status: 500 }
    );
  }
}
