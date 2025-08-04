import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Like from "@/models/Like";
import mongoose from "mongoose";
import Comment from "@/models/Comment";
export async function GET(
  request: NextRequest,
//   { params }: { params: { userId: string } }
) {
//   const { userId } = params;
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
    // const likedPost = await Like.findOne({ authorId: userId });
    // if (!likedPost)
    //   return NextResponse.json(
    //     { success: false, message: "Post not found" },
    //     { status: 404 }
    //   );
    const currentUserId = new mongoose.Types.ObjectId(
        "6889cc0ea392e6c9ad687453"
    );
    console.log("userId", currentUserId);

    const likedPost = await Comment.find({ authorId: currentUserId })
      .populate({
        path: 'postId',
        populate: ({
            path: 'authorId',
            select: ' username image'
        })
      })
      .sort({ createdAt: -1 });

      return NextResponse.json({
      success: true,
      message: 'Liked Posts retrieved successfully.',
      data: likedPost,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all Liked Posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve liked posts.",
      },
      { status: 500 }
    );
  }
}