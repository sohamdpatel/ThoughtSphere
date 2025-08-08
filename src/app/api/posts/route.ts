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
    
    // Get the user session to determine if a user is logged in
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;

    // Fetch all posts. Using .lean() for better performance as we'll be adding a new property.
    const posts = await Post.find({})
      .populate('authorId', 'username image') // Populate author details
      .sort({ createdAt: -1 }) // Latest posts first
      .lean();

    let likesByCurrentUser: any[] = [];
    if (userId) {
      // If the user is logged in, find all their likes for these posts in a single query
      const postIds = posts.map(post => post._id);
      likesByCurrentUser = await Like.find({
        postId: { $in: postIds },
        authorId: userId,
      }).lean();
    }

    // Map over the posts to inject the hasLiked property
    const postsWithLikes = posts.map(post => {
      // Safely cast the _id to resolve TypeScript errors from .lean()
      const postId = post._id as mongoose.Types.ObjectId;

      const hasLiked = likesByCurrentUser.some(
        like => like.postId?.toString() === postId.toString()
      );
      
      return {
        ...post,
        hasLiked,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Posts retrieved successfully.',
      data: postsWithLikes,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching all posts:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve posts.',
    }, { status: 500 });
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
