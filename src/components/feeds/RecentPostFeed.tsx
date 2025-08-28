"use client";

import { IconTrendingUp } from "@tabler/icons-react";
import MiniPostCard from "../ui/MiniPostCard";
import MiniPostCardSkeleton from "../ui/MiniPostCardSkeleton";
import { IPost } from "@/models/Post";
import { useQuery } from "@tanstack/react-query";

async function fetchRecentPosts(): Promise<IPost[]> {
  // const baseUrl =
  //   process.env.NEXT_Auth || window.location.origin;
  const url = `/api/posts?limit=4`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");

  const { data }: { data: IPost[] } = await res.json();
  return data;
}

export default function RecentPostFeed() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<IPost[], Error>({
    queryKey: ["recent-posts"], // cache key
    queryFn: fetchRecentPosts,
    staleTime: 1000 * 60, // 1 min cache (you can tune this)
    refetchOnWindowFocus: false, // optional, disable auto refetch
  });

  if (isLoading) {
    return (
      <div className="p-2 flex flex-col gap-2">
        <MiniPostCardSkeleton />
        <MiniPostCardSkeleton />
        <MiniPostCardSkeleton />
        <MiniPostCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-400 p-2">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {posts?.map((post: IPost) => (
        <MiniPostCard data={post} key={post._id?.toString() as string} />
      ))}
    </div>
  );
}
