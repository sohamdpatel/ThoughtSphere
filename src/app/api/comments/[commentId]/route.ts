// import dbConnect from "@/lib/dbConnect";
// import Comment from "@/models/Comment";
// import Post from "@/models/Post";
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOption";
// import mongoose from "mongoose";
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { commentId: string } }
// ) {
//   const { commentId } = params;

//   const session = await getServerSession(authOptions);

//   if (!session || !session.user || !session.user._id || !session.user.role) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Unauthorized: You must be logged in to delete a post.",
//       },
//       { status: 401 }
//     );
//   }

//   await dbConnect();

//   try {
//     const comment = await Comment.findById(commentId);
//     if (!comment)
//       return NextResponse.json(
//         { success: false, message: "Comment not found" },
//         { status: 404 }
//       );

//     const currentUserId = session.user._id;
//     const currentUserRole = session.user.role;

//     const isAuthor = comment.authorId.equals(
//       new mongoose.Types.ObjectId(currentUserId)
//     );
//     const isAdmin = currentUserRole === "admin";

//     if (!isAuthor && !isAdmin) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Forbidden: You do not have permission to delete this comment.",
//         },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Post deleted successfully.",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(`Error deleting post with slug "${commentId}":`, error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "An error occurred while deleting the post.",
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOption';
import mongoose from 'mongoose';

export async function DELETE(request: NextRequest, { params }: {params: {commentId: string}}) {
  const { commentId } = params;

  // --- CRITICAL: Add authentication and authorization ---
  const session = await getServerSession(authOptions);



  if (!session || !session.user || !session.user._id || !session.user.role) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: You must be logged in to delete a comment." },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json({ success: false, message: 'Invalid Comment ID.' }, { status: 400 });
  }

  await dbConnect();

  try {
    // Find the comment and its author to perform authorization checks
    const comment = await Comment.findById(commentId).select('postId authorId parentComment');
    
    if (!comment) {
      return NextResponse.json({ success: false, message: 'Comment not found.' }, { status: 404 });
    }

    const currentUserId = new mongoose.Types.ObjectId(session.user._id);
    const isAdmin = session.user.role === 'admin';
    
    // Check if the current user is the author or an admin
    if (!comment.authorId.equals(currentUserId) && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You do not have permission to delete this comment.' },
        { status: 403 }
      );
    }
    // --- End of security checks ---

    // Find all replies to this comment (including nested replies)
    // You could also do a recursive deletion, but this is a simpler approach for a flat-list of replies.
    const repliesToDelete = await Comment.find({ parentComment: commentId }).select('_id');
    const replyIdsToDelete = repliesToDelete.map(reply => reply._id);

    // Prepare a list of all IDs to delete
    const allIdsToDelete = [commentId, ...replyIdsToDelete];

    // Count how many root comments are in the list of IDs to delete
    // Based on your instruction: "i have add only rootcomments at Commentscount i dont replies to comment count"
    const isRootComment = !comment.parentComment;
    const postCountDecrement = isRootComment ? 1 : 0;

    // Execute all database operations concurrently
    await Promise.all([
      // 1. Delete the comment and all its replies in one go
      Comment.deleteMany({ _id: { $in: allIdsToDelete } }),
      // 2. Adjust the counts
      Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -postCountDecrement } }),
      // 3. If the deleted comment was a reply, decrement its parent's reply count
      ...(comment.parentComment ? [
        Comment.findByIdAndUpdate(comment.parentComment, { $inc: { replyCount: -1 } })
      ] : [])
    ]);

    return NextResponse.json({ success: true, message: 'Comment and its replies deleted successfully.' },{status: 200});

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting the comment.' },
      { status: 500 }
    );
  } 
}