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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const { email, password } = credentials;
        if (!email && !password) {
          throw new Error("Missing Credentials");
        }

        try {
          await dbConnect();
          const user = await User.findOne({
            $or: [{ email }, { username: email }],
          });

          if (!user) {
            throw new Error("No user found with these credentials");
          }

          if (!user.isVerified) {
            throw new Error("Please verify first");
          }

          const isCorrectPassword = bcrypt.compare(password, user.password);
          if (!isCorrectPassword) {
            throw new Error("Incorrect password");
          }
          return user;
        } catch (error) {
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
        // Assign properties from the token to the session.user object
        // session.user.id = token.id as string; // Ensure 'id' is also set
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        // Use the correct property name: 'isAcceptingMessage'
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
