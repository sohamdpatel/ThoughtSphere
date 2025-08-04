import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";
import { IPost } from "@/models/Post";
import Like from "@/models/Like";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Await the params object before accessing its properties to avoid the Next.js error
  const { slug } = await params;
  // const session = await getServerSession(authOptions);

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
    const post: IPost | null = await Post.findOne({ slug });

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

    await Like.create({ postId: post._id, authorId: currentUserId });

    await Post.findByIdAndUpdate(post._id, {
      $inc: { likesCount: 1 },
      $push: {
        latestLikes: {
          $each: [currentUserId],
          $position: 0,
          $slice: 2,
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Post liked" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Already liked this post" },
        { status: 400 }
      );
    }
    console.log(error);
    
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  const slug = await params.slug;
  const currentUserId = new mongoose.Types.ObjectId("6889cc0ea392e6c9ad687453"); // Replace with session user

  try {
    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const deleted = await Like.findOneAndDelete({
      postId: post._id,
      authorId: currentUserId,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "You haven't liked this post" },
        { status: 400 }
      );
    }

    await Post.findByIdAndUpdate(post._id, {
      $inc: { likesCount: -1 },
      $pull: { latestLikes: currentUserId },
    });

    return NextResponse.json(
      { success: true, message: "Post unliked" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unliking post:", error);
    return NextResponse.json(
      { success: false, message: "Server error while Unlike Post" },
      { status: 500 }
    );
  }
}

