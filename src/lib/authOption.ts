import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect"; 

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const { identifier, password } = credentials;
        if (!identifier && !password) {
          throw new Error("Missing Credentials");
        }

        try {
          await dbConnect();
          console.log("Attempting sign-in for identifier:", identifier);
          
          const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });

          if (!user) {
            console.log("User not found for identifier:", identifier);
            throw new Error("No user found with these credentials");
          }

          if (!user.isVerified) {
            console.log("User found but not verified:", user.username);
            throw new Error("Please verify first");
          }

          // --- DEBUGGING LOGS ---
                  const hashedPassword = await bcrypt.hash(password, 12);
                  console.log("hashed password from auth options",hashedPassword, user.password);
                  
          console.log("Input password (plain text from form):", password);
          console.log("Stored hashed password from DB:", user.password);
          // --- END DEBUGGING LOGS ---
          
          const isCorrectPassword = await bcrypt.compare(password, user.password, );
          console.log("bcrypt.compare result (isCorrectPassword):", isCorrectPassword);
          
          if (!isCorrectPassword) {
            throw new Error("Incorrect password");
          }
          
          return user;
        } catch (error) {
          console.error("Error during authorization:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token._id = user.id;
        token.isVerified = user.isVerified;
        token.image = user.image;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.username = token.username as string;
        session.user.image = token.image as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
