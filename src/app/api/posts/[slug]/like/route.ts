import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import Like from "@/models/Like";
import Notification from "@/models/Notification";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import mongoose from "mongoose";

// This single PUT endpoint handles both liking and unliking a post
// and creates/deletes a notification within an atomic transaction.
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: You must be logged in to like a post." },
      { status: 401 }
    );
  }

  await dbConnect();
  const userId = new mongoose.Types.ObjectId(session?.user?._id);
  console.log(userId,session.user);
  
  const mongoSession = await mongoose.startSession();

  try {
    const transactionResult = await mongoSession.withTransaction(async () => {
      // Find the post to get its ID and author's ID
      const post = await Post.findOne({ slug }, null, { session: mongoSession });
      if (!post) {
        throw new Error("Post not found.");
      }

      // Check if the user has already liked the post
      const existingLike = await Like.findOne({ postId: post._id, authorId: userId }, null, { session: mongoSession });

      let likesCountChange = 0;
      let hasLiked = false;

      if (existingLike) {
        // If the like exists, UNLIKE the post
        await Like.findByIdAndDelete(existingLike._id, { session: mongoSession });
        likesCountChange = -1;
        hasLiked = false;

        // Delete the associated notification
        await Notification.findOneAndDelete({
          type: 'like_post',
          senderId: userId,
          recipientId: post.authorId,
          postId: post._id,
        }, { session: mongoSession });

      } else {
        // If no like exists, LIKE the post
        console.log("befor like");
        
        const likeDone = await Like.create([{ postId: post._id, authorId: userId }], { session: mongoSession });

        console.log("after like", likeDone);
        
        likesCountChange = 1;
        hasLiked = true;

        // Check if the user is liking their own post. Don't send a notification if they are.
        if (post.authorId.toString() !== userId.toString()) {
          await Notification.create([{
            recipientId: post.authorId,
            senderId: userId, 
            postId: post._id,
            type: 'like_post',
          }], { session: mongoSession });
        }
      }

      // Atomically update the likes count on the Post document.
      if (likesCountChange !== 0) {
        console.log("above updated post");
        
        const updated = await Post.findByIdAndUpdate(post._id, { $inc: { likesCount: likesCountChange } }, { session: mongoSession });
        console.log(updated);
        
      }

      return { message: hasLiked ? "Post liked successfully." : "Post unliked successfully.", hasLiked };
    });

    if (transactionResult.message.includes("not found")) {
      return NextResponse.json({ success: false, message: transactionResult.message }, { status: 404 });
    }

    const updatedPost = await Post.findOne({ slug });

    return NextResponse.json(
      {
        success: true,
        message: transactionResult.message,
        likesCount: updatedPost?.likes || 0,
        hasLiked: transactionResult.hasLiked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in post like transaction:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while toggling like status." },
      { status: 500 }
    );
  } finally {
    mongoSession.endSession();
  }
}
