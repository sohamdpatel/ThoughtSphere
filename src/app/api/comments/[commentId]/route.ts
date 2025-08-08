import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOption';
import mongoose from 'mongoose';
import Notification from '@/models/Notification';
// --- API to Delete a Comment with Notifications ---
// This DELETE endpoint handles the deletion of a comment and all related data atomically.
export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id || !session.user.role) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: You must be logged in to delete a comment." },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid Comment ID.' },
      { status: 400 }
    );
  }

  await dbConnect();
  const currentUserId = new mongoose.Types.ObjectId(session.user._id);
  const mongoSession = await mongoose.startSession();

  try {
    const transactionResult = await mongoSession.withTransaction(async () => {
      // Find the comment and its author to perform authorization checks
      const comment = await Comment.findById(commentId, null, { session: mongoSession }).select('postId authorId parentComment');
      
      if (!comment) {
        throw new Error('Comment not found.');
      }

      const isAdmin = session.user.role === 'admin';
      
      // Check if the current user is the author or an admin
      if (!comment.authorId.equals(currentUserId) && !isAdmin) {
        throw new Error('Forbidden: You do not have permission to delete this comment.');
      }

      // Find all replies to this comment and the comment itself
      const repliesToDelete = await Comment.find({ parentComment: commentId }, null, { session: mongoSession }).select('_id');
      const allIdsToDelete = [comment._id, ...repliesToDelete.map(reply => reply._id)];

      // Find and delete all notifications related to these comments
      await Notification.deleteMany(
        { commentId: { $in: allIdsToDelete } },
        { session: mongoSession }
      );

      // Delete the comment and all its replies in one go
      await Comment.deleteMany(
        { _id: { $in: allIdsToDelete } },
        { session: mongoSession }
      );

      // Adjust the counts on the post and parent comment
      const isRootComment = !comment.parentComment;
      if (isRootComment) {
        await Post.findByIdAndUpdate(
          comment.postId,
          { $inc: { commentsCount: -1 } },
          { session: mongoSession }
        );
      } else {
        await Comment.findByIdAndUpdate(
          comment.parentComment,
          { $inc: { replyCount: -1 } },
          { session: mongoSession }
        );
      }
    });

    return NextResponse.json(
      { success: true, message: 'Comment and its related data deleted successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    
    // Check for specific error messages from the transaction
    if (error.message.includes('not found')) {
      return NextResponse.json({ success: false, message: error.message }, { status: 404 });
    }
    if (error.message.includes('Forbidden')) {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
    
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting the comment.' },
      { status: 500 }
    );
  } finally {
    mongoSession.endSession();
  }
}