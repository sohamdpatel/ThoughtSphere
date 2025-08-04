import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { IPost } from "@/models/Post";
import Post from "@/models/Post";
import mongoose from "mongoose";
import Like from "@/models/Like";
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
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
    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found.",
        },
        { status: 404 }
      );
    }

    const currentUserId = new mongoose.Types.ObjectId(
      "6889cc0ea392e6c9ad687453"
    );
    // TODO add current.user._id

    const newComment = new Comment({
      postId: post._id,
      authorId: currentUserId,
      comment: comment,
    });
    
    // 2. Perform both the comment creation and the post update atomically.
    await Promise.all([
      newComment.save(), // Save the new comment to the database.
      Post.findByIdAndUpdate(
        post._id,
        {
          $inc: { commentsCount: 1 }, // Atomically increment the comments count.
        },
        { new: true, runValidators: true }
      )
    ]);

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

    let likesByCurrentUser = [];
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
      const hasLiked = likesByCurrentUser.some(
        like => like.commentId.toString() === comment._id.toString()
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
