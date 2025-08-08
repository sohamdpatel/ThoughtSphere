import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";
import Notification from "@/models/Notification";

// This single PUT endpoint handles both liking and unliking a comment.
// --- NEW API to Toggle Comment Like with Notifications ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: You must be logged in to like a comment." },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Comment ID." },
      { status: 400 }
    );
  }

  await dbConnect();
  const userId = new mongoose.Types.ObjectId(session.user._id);
  const mongoSession = await mongoose.startSession();

  try {
    const transactionResult = await mongoSession.withTransaction(async () => {
      const comment = await Comment.findById(commentId, null, { session: mongoSession });
      if (!comment) {
        throw new Error("Comment not found.");
      }

      // Check if the user has already liked the comment
      const existingLike = await Like.findOne({ commentId, authorId: userId }, null, { session: mongoSession });

      let likesCountChange = 0;
      let hasLiked = false;

      if (existingLike) {
        // If it exists, UNLIKE the comment
        await Like.findByIdAndDelete(existingLike._id, { session: mongoSession });
        likesCountChange = -1;
        hasLiked = false;
        
        // Delete the associated notification
        await Notification.findOneAndDelete({
          type: 'like_comment',
          senderId: userId,
          recipientId: comment.authorId,
          commentId: comment._id,
        }, { session: mongoSession });

      } else {
        // If it doesn't exist, LIKE the comment
        await Like.create([{ commentId, authorId: userId }], { session: mongoSession });
        likesCountChange = 1;
        hasLiked = true;

        // Check if the user is liking their own comment. Don't create a notification if so.
        if (comment.authorId.toString() !== userId.toString()) {
          await Notification.create([{
            recipientId: comment.authorId,
            senderId: userId,
            commentId: comment._id,
            type: 'like_comment',
          }], { session: mongoSession });
        }
      }

      // Atomically update the likes count on the Comment document.
      if (likesCountChange !== 0) {
        await Comment.findByIdAndUpdate(commentId, { $inc: { likes: likesCountChange } }, { session: mongoSession });
      }

      return { message: hasLiked ? "Comment liked successfully." : "Comment unliked successfully.", hasLiked };
    });

    if (transactionResult.message.includes("not found")) {
      return NextResponse.json({ success: false, message: transactionResult.message }, { status: 404 });
    }

    // After a successful transaction, we can fetch the updated count from the Comment document
    const updatedComment = await Comment.findById(commentId);

    return NextResponse.json(
      {
        success: true,
        message: transactionResult.message,
        likesCount: updatedComment?.likes || 0,
        hasLiked: transactionResult.hasLiked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in comment like transaction:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while toggling like status." },
      { status: 500 }
    );
  } finally {
    mongoSession.endSession();
  }
}
