import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import Post from "@/models/Post";
import mongoose from "mongoose";
import Like from "@/models/Like";
import Notification from "@/models/Notification";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { comment } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: You must be logged in to comment on a post." },
      { status: 401 }
    );
  }

  await dbConnect();
  const userId = new mongoose.Types.ObjectId(session.user._id);

  // Start a new Mongoose session for the transaction.
  const mongoSession = await mongoose.startSession();

  try {
    const transactionResult = await mongoSession.withTransaction(async () => {
      // Find the post to check its existence and get the author's ID.
      const post = await Post.findOne({ slug }, null, { session: mongoSession });

      if (!post) {
        throw new Error("Post not found.");
      }

      // Create the new comment document.
      const newComment = new Comment({
        postId: post._id,
        authorId: userId,
        comment: comment,
      });

      // Save the new comment.
      await newComment.save({ session: mongoSession });
      
      // Atomically increment the comments count on the post.
      await Post.findByIdAndUpdate(
        post._id,
        { $inc: { commentsCount: 1 } },
        { session: mongoSession }
      );

      // Check if the user is commenting on their own post.
      // If not, create a notification for the post's author.
      if (post.authorId.toString() !== userId.toString()) {
        await Notification.create([{
          recipientId: post.authorId,
          senderId: userId,
          postId: post._id,
          type: 'comment_post',
          commentId: newComment._id, // Associate the notification with the new comment
        }], { session: mongoSession });
      }

      return { success: true, message: "Comment on Post successfully", newComment };
    });

    if (!transactionResult.success) {
      return NextResponse.json({ success: false, message: transactionResult.message }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: transactionResult.message, data: transactionResult.newComment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while commenting.", error);
    
    return NextResponse.json(
      { success: false, message: "Server error while commenting." },
      { status: 500 }
    );
  } finally {
    // End the session regardless of the outcome.
    mongoSession.endSession();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Fix the common Next.js error by awaiting params
  const { slug } = await params;
  
  await dbConnect();

  try {
    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;

    // Fetch all root comments for the post
    const comments = await Comment.find({ postId: post._id, parentComment: null })
      .populate('authorId', 'username image')
      .sort({ createdAt: -1 })
      .lean(); // Use .lean() for better performance as we're adding new properties

    let likesByCurrentUser: any[] = [];
    if (userId) {
      // If the user is logged in, find all their likes for these comments in a single query
      const commentIds = comments.map(comment => comment._id);
      likesByCurrentUser = await Like.find({
        commentId: { $in: commentIds },
        authorId: userId,
      }).lean();
    }

    // Map over the comments to inject the hasLiked property
    const commentsWithLikes = comments.map(comment => {
      // The `_id` property from a .lean() query can sometimes be typed as `unknown` by TypeScript.
      // We safely assert its type here to resolve the  error.
      const commentId = comment._id as mongoose.Types.ObjectId;

      const hasLiked = likesByCurrentUser.some(
        like => like.commentId?.toString() === commentId.toString()
      );
      
      return {
        ...comment,
        hasLiked,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Comments retrieved successfully.',
      data: commentsWithLikes,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve comments.",
      },
      { status: 500 }
    );
  }
}
