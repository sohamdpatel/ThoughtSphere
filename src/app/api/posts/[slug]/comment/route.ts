import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { IPost } from "@/models/Post";
import Post from "@/models/Post";
import mongoose from "mongoose";

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

    await Comment.create({ postId: post._id, authorId: currentUserId, comment });

    post.commentsCount += 1;
    post.latestComment = comment._id;
    await post.save();

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
  const { slug } = params;

  await dbConnect();

  try {
    const post = await Post.findOne({ slug });
    if (!post)
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );

    const comments = await Comment.find({ post: post._id, parentComment: null })
      .populate('authorId', 'username image')
      .sort({ createdAt: -1 });

      return NextResponse.json({
      success: true,
      message: 'Comments retrieved successfully.',
      data: comments,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve comments.",
      },
      { status: 500 }
    );
  }
}
