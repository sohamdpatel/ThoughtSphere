import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // first get username and verifyCode from request body if not getting return response missing username or password
  // after that connect to database in try catch
  // get user details from database using username
  // if user not found than return response user not found
  // after compare verifyCode and verifyCodeExpiry
  // if both are true than set isVerified field true in user and save that user in database and return response success true and message with verify successfuly
  // in else if part use for code expired and return response success false and message with sign up again
  // and finally in else part return response with success false and message with invalid verification code

  const { username, verifyCode } = await request.json();

  if (!username || !verifyCode) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing username or password ",
      },
      { status: 505 }
    );
  }

  try {
    await dbConnect();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const isCodeMatch = verifyCode === user.verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeMatch || isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error while verifying code", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while verifying code",
      },
      { status: 500 }
    );
  }
}
