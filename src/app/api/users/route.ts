import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
        const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: usernameErrors?.length > 0 ? usernameErrors?.join(', ') : 'Invalid query parameters', 
      }, {
        status: 400,
      });
    }
    
    const {username} = result.data

    const existingVerifiedUser = await User.findOne({username, isVerified: true})
    if(existingVerifiedUser) return Response.json({success: false, message: `Username ${username} is already taken`}, {status: 400})

        return Response.json({
            success: true,
            message: `Username is unique`,
            }, {
                status: 200,
        })
  } catch (error) {
    console.error("Error while checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      { status: 500 }
    );
  }
}
