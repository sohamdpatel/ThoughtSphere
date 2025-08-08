import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the user session to determine the logged-in user
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You must be logged in to view your commented posts." },
        { status: 401 }
      );
    }
    
    // 1. Find all comments made by the authenticated user
    const userComments = await Comment.find({ authorId: userId }).lean();

    if (userComments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No posts found with your comments.",
        data: [],
      }, { status: 200 });
    }

    // 2. Extract unique post IDs from the comments
    const commentedPostIds = [...new Set(userComments.map(comment => comment.postId))];

    // 3. Fetch the posts corresponding to those IDs
    const posts = await Post.find({ _id: { $in: commentedPostIds } })
      .populate('authorId', 'username image')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Posts with user comments retrieved successfully.',
      data: posts,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching posts with user comments:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve posts with user comments.',
    }, { status: 500 });
  }
}