// 'use client'
// import toast from "react-hot-toast";
// import { IPost } from "@/models/Post";
// import MiniPostCard from "@/components/MiniPostCard";
import { IconTrendingUp } from "@tabler/icons-react";
import MainFeed from "@/components/feeds/MainFeed";
import { Suspense } from "react";
import PostCardSkeleton from "@/components/ui/PostCardSkeleton";
import RecentPostFeed from "@/components/feeds/RecentPostFeed";
import MiniPostCardSkeleton from "@/components/ui/MiniPostCardSkeleton";

export default function Home() {
  // const handleSignOut = async () => {
  //   try {
  //     await signOut();
  //     toast.success("Signed out successfully");
  //   } catch {
  //     toast.error("Failed to sign out");
  //   }
  // };

  return (
    <div className="flex w-full h-screen overflow-y-auto px-4 lg:px-8 gap-10 ">
      {/* Left scrollable content */}
      <Suspense fallback={<PostCardSkeleton />}>
        <MainFeed />
      </Suspense>

      {/* Sticky Sidebar */}
      <div className="xl:max-w-[400px] lg:max-w-[350px] w-full hidden lg:block lg:sticky lg:top-0 h-screen py-5">
        <div className="overflow-hidden p-3 w-full flex shadow-[0_2px_10px_-2px] shadow-[#1c1c1c] border-0 bg-[#303030] rounded-2xl flex-col gap-2">
          <div className="p-2 text-xl font-semibold flex gap-2">
            <IconTrendingUp stroke={3} className="w-7 h-7 text-[#c019dd]" />
            Recent Post
          </div>
          <Suspense
            fallback={
              <div className="p-2 flex flex-col gap-2">
                <MiniPostCardSkeleton />
                <MiniPostCardSkeleton />
                <MiniPostCardSkeleton />
                <MiniPostCardSkeleton />
              </div>
            }
          >
            <RecentPostFeed />
          </Suspense>

          <div className="pr-1 w-full flex justify-end">
            <h2 className="w-fit hover:text-[#cb4de1] text">See more</h2>
            {/* <button onClick={() => signOut()}>Sign Out</button> */}
          </div>
        </div>
      </div>
      {/* {onClose && <Modal onClose={() => setOnClose(false)}>
        <div>Helloo</div>
      </Modal>} */}
    </div>
  );
}
