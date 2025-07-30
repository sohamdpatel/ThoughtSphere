import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// get user profile details
export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } }) {
  const { username } = params;
  if (!username) {
    return NextResponse.json(
      {
        success: false,
        messsage: "Username is required",
      },
      { status: 400 }
    );
  }
  try {
    await dbConnect();

    const user = await User.findOne({ username }).select(
      "-password -verifyCode -verifyCodeExpiry"
    );
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "User data retrieved successfully.",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred while retrieving user details.", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving user details.",
      },
      { status: 500 }
    );
  }
}
