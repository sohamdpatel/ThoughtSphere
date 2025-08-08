import { authOptions } from "@/lib/authOption";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Notification from "@/models/Notification";

// This route should be at /api/notifications/[notificationId]/read
export async function PUT(request: NextRequest, { params }: { params: { notificationId: string } }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;
    const { notificationId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You must be logged in." },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return NextResponse.json(
          { success: false, message: "Invalid Notification ID." },
          { status: 400 }
        );
      }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found or you are not the recipient." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read.',
      data: notification,
    }, { status: 200 });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to mark notification as read.',
    }, { status: 500 });
  }
}