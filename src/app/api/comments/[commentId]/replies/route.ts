import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";
import Notification from "@/models/Notification";

// This API handles creating a new comment reply and generates a notification for the parent comment's author.
export async function POST(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;
  const { comment } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: You must be logged in to reply to a comment." },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Parent Comment ID." },
      { status: 400 }
    );
  }

  await dbConnect();
  const userId = new mongoose.Types.ObjectId(session.user._id);
  const mongoSession = await mongoose.startSession();

  try {
    const transactionResult = await mongoSession.withTransaction(async () => {
      // Find the parent comment to ensure it exists and get its details
      const parentComment = await Comment.findById(commentId, null, { session: mongoSession });

      if (!parentComment) {
        throw new Error("Parent comment not found.");
      }

      // Create the new reply comment document
      const newComment = new Comment({
        postId: parentComment.postId,
        authorId: userId,
        comment,
        parentComment: parentComment._id,
      });

      // Save the new comment
      await newComment.save({ session: mongoSession });

      // Atomically increment the reply count on the parent comment
      await Comment.findByIdAndUpdate(
        parentComment._id,
        { $inc: { replyCount: 1 } },
        { session: mongoSession }
      );

      // Check if the user is replying to their own comment.
      // If not, create a notification for the parent comment's author.
      if (parentComment.authorId.toString() !== userId.toString()) {
        await Notification.create([{
          recipientId: parentComment.authorId,
          senderId: userId,
          postId: parentComment.postId,
          commentId: newComment._id, // Associate the notification with the new reply
          type: 'reply_comment',
        }], { session: mongoSession });
      }

      return { success: true, message: "Reply posted successfully", newComment };
    });

    return NextResponse.json(
      { success: true, message: transactionResult.message, data: transactionResult.newComment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("error while creating reply.", error);
    
    if (error.message.includes("not found")) {
      return NextResponse.json({ success: false, message: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { success: false, message: "Server error while creating reply." },
      { status: 500 }
    );
  } finally {
    mongoSession.endSession();
  }
}

// This API handles fetching all replies for a given comment.
export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Comment ID." },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const commentReplies = await Comment.find({ parentComment: commentId })
      .populate("authorId", "username image")
      .sort({ createdAt: -1 })
      .lean();

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