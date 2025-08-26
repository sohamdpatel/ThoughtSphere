import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import Post from "@/models/Post";
import { NextResponse,NextRequest } from "next/server";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";
import Like from "@/models/Like";
// get all post
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;

    // Get search params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const cursor = searchParams.get("cursor"); // post _id for pagination

    // Build query
    const query: any = {};
    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    // Fetch posts with pagination
    const posts = await Post.find(query)
      .populate("authorId", "username image")
      .sort({ _id: -1 }) // newest first
      .limit(limit)
      .lean();

    // Find likes by current user
    let likesByCurrentUser: any[] = [];
    if (userId) {
      const postIds = posts.map((post) => post._id);
      likesByCurrentUser = await Like.find({
        postId: { $in: postIds },
        authorId: userId,
      }).lean();
    }

    // Inject hasLiked into posts
    const postsWithLikes = posts.map((post) => {
      const postId = post._id as mongoose.Types.ObjectId;
      const hasLiked = likesByCurrentUser.some(
        (like) => like.postId?.toString() === postId.toString()
      );

      return {
        ...post,
        hasLiked,
      };
    });

    // Set nextCursor if there are more posts
    const nextCursor =
  posts.length > 0 ? (posts[posts.length - 1]._id as mongoose.Types.ObjectId).toString() : null;


    return NextResponse.json(
      {
        success: true,
        message: "Posts retrieved successfully.",
        data: postsWithLikes,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve posts.",
      },
      { status: 500 }
    );
  }
}

// add new post
export async function POST(request: Request) {

  const session = await getServerSession(authOptions);

  // if (!session || !session.user || !session.user._id) {
  //   return NextResponse.json({
  //     success: false,
  //     message: 'Unauthorized: You must be logged in to create a post.',
  //   }, { status: 401 });
  // }

  await dbConnect();

  try {
    const { title, content, tags, image } = await request.json();

    // Basic input validation
    if (!title || !content) {
      return NextResponse.json({
        success: false,
        message: 'Title, content, and image are required to create a post.',
      }, { status: 400 });
    }

    // const authorId = session.user._id;
    const authorId = "6889cc0ea392e6c9ad687453";

    const newPost = new Post({
      authorId: authorId,
      title,
      content,
      tags: tags || [], // Ensure tags is an array
      fileLink: image,
       // Default value, though schema also handles this
    });

    await newPost.save();

    return NextResponse.json({
      success: true,
      message: 'Post created successfully.',
      data: newPost,
    }, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error('Error creating post:', error);
    // Handle potential duplicate slug error specifically if you have uniqueness constraints
    if (error.code === 11000) { // Mongoose duplicate key error code
        return NextResponse.json({
            success: false,
            message: 'A post with a similar title and author already exists. Please choose a different title.',
        }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({
      success: false,
      message: 'Failed to create post.',
    }, { status: 500 });
  }
}
