'use client'
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import PostCard from "@/components/PostCard";
export default function Home() {
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully"); 
    } catch {
      toast.error("Failed to sign out");
    }
  };
  return (
    
    <div className="flex w-full h-screen overflow-y-auto lg:px-8 gap-16 sm:px-20">
  {/* Left scrollable content */}
  <div className="md:w-2/3 flex flex-col h-fit gap-2 pb-28">
    <PostCard />
    <PostCard />
    <PostCard />
    <PostCard />
    <PostCard />
    <PostCard />
    <PostCard />
    {/* Add more to test scroll */}
  </div>

  {/* Sticky Sidebar */}
  <div className="md:w-1/3 bg-gray-600  md:sticky md:top-0 h-screen">
    {/* Sidebar content */}
  </div>
</div>

  );
}
 

