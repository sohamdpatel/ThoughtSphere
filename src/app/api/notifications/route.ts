import { authOptions } from "@/lib/authOption";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/Notification";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = "6889cc0ea392e6c9ad687453";
    // const userId = session?.user?._id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You must be logged in to view your notifications." },
        { status: 401 }
      );
    }

    const notifications = await Notification.find({ recipientId: userId })
      .populate('senderId', 'username image')
      .populate('postId', 'title slug')
      .populate('commentId')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Notifications retrieved successfully.',
      data: notifications,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve notifications.',
    }, { status: 500 });
  }
}

