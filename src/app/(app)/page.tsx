'use client'
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import PostCard from "@/components/PostCard";
import PostCardSkeleton from "@/components/ui/PostCardSkeleton";
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
    
    <div className="flex w-full h-screen overflow-y-auto lg:px-8 gap-10   ">
  {/* Left scrollable content */}
  <div className="lg:w-2/3 w-full flex flex-col h-fit  pb-28">
    <PostCard />
    <hr />
    <PostCard />
    <hr />
    <PostCard />
    <hr />
    <PostCard />
    <hr />
    <PostCard />
    <hr />
    <PostCard />
    <hr />
    <PostCard />
    <hr />
    <PostCardSkeleton />
    {/* Add more to test scroll */}
  </div>

  {/* Sticky Sidebar */}
  <div className="lg:w-1/3 w-full bg-gray-600 hidden lg:block lg:sticky lg:top-0 h-screen">
    {/* Sidebar content */}
    <button onClick={handleSignOut}>Sign Out</button>
  </div>
</div>

  );
}
 

