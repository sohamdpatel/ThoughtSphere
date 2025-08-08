import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";
import slugify from "slugify";

// get single post by id
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    await dbConnect();
    const post = await Post.find({ slug }).populate(
      "authorId",
      "username image"
    );

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Get post successfully",
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred while fetching post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching post",
      },
      { status: 500 }
    );
  }
}

// update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const session = await getServerSession(authOptions);

  // if (!session || !session.user || !session.user._id || !session.user.role) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: "Unauthorized: You must be logged in to update a post.",
  //     },
  //     { status: 401 }
  //   );
  // }

  await dbConnect();

  try {
    const { title, content, tags, image } = await request.json();

    const updateFields: {
      title?: string;
      content?: string;
      tags?: string[];
      image?: string;
      slug?: string;
    } = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (tags !== undefined) updateFields.tags = tags;
    if (image !== undefined) updateFields.image = image;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields provided for update.",
        },
        { status: 400 }
      );
    }

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

    const currentUserId = "6889cc0ea392e6c9ad687453";
    // const currentUserId = session.user._id;
    // const currentUserRole = session.user.role;

    const isAuthor = post.authorId.equals(
      new mongoose.Types.ObjectId(currentUserId)
    ); // Compare ObjectIds
    // const isAdmin = currentUserRole === "admin";

    // if (!isAuthor && !isAdmin) {
    if (!isAuthor) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You do not have permission to update this post.",
        },
        { status: 403 }
      );
    }

    if (updateFields.title !== undefined) {
      // Use the authorId from the fetched 'post' document for the slug
      const newSlug = `${slugify(updateFields.title, { lower: true, strict: true })}_by_${post.authorId.toString()}`;
      updateFields.slug = newSlug; // Add the new slug to the update fields
    }

    const updatedPost = await Post.findOneAndUpdate(
      { slug: slug },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update post after authorization.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Post updated successfully.",
        data: updatedPost,
      },
      { status: 200 } 
    );
  } catch (error: any) {
    console.error("Error updating post:", error); 

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A post with that title or generated slug already exists. Please choose a different title or slug.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the post.",
      },
      { status: 500 }
    );
  }
}

// delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } } 
) {
  const { slug } = params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id || !session.user.role) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized: You must be logged in to delete a post.',
      },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found.',
        },
        { status: 404 }
      );
    }

    const currentUserId = session.user._id;
    const currentUserRole = session.user.role;

    const isAuthor = post.authorId.equals(new mongoose.Types.ObjectId(currentUserId));
    const isAdmin = currentUserRole === 'admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden: You do not have permission to delete this post.',
        },
        { status: 403 }
      );
    }

    const deletedPost = await Post.findOneAndDelete({ slug });

    if (!deletedPost) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to delete post.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Post deleted successfully.',
      },
      { status: 200 } 
    );
  } catch (error) {
    console.error(`Error deleting post with slug "${slug}":`, error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while deleting the post.',
      },
      { status: 500 }
    );
  }
}
