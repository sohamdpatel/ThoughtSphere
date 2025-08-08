'use client'
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-error hover:bg-base-200 w-full text-left"
        >
          Sign Out
        </button>
    </div>
  );
}


