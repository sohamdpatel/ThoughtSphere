import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // first take values from body
  // and connect db in try part and handle catch error part
  // after connect db check user with username , if user exist and it is verified than return response with user exist and status coe 400
  // generate verifycode
  // than check user with email and if user exist  then check is use verified ir not if verified than return user already existif not verified than save new verify code and there expiry
  //and if user not exist than create new user and sve that
  // than send a verification code on eamil if it does not send return success false and message
  // if send success fulle than return success true and message verification code sent successfully

  const { email, username, fullName, password, image } = await request.json();

  try {
    await dbConnect();

    const existingUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();

    const existingUserByEmail = await User.findOne({
      email,
      isVerified: true,
    });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.expiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        fullName,
        email,
        password: hashedPassword,
        image,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail({
      email,
      username,
      verifyCode,
    });

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while signing up user",
      },
      { status: 500 }
    );
  }
}
