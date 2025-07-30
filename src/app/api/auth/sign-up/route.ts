import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const {email,username,fullName,password,image} = await request.json()

    try {
        await dbConnect();

        const existingUserByUsername = await User.findOne({
            username,
            isVerified: true
        })

        if (existingUserByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username already exists",
            },{status: 400})
        }

        const existingUserByEmail = await User.findOne({
            email,
            isVerified: true
        })

    } catch (error) {
        console.error('Error registering user', error)
        return NextResponse.json({
            success: false,
            message: 'Error while signing up user',
        },{ status: 500 })
    }
}