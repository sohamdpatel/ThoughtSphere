"use client";

import { useState, useEffect, useRef } from "react";
import PostCard from "./ui/PostCard";
import { IPost } from "@/models/Post";
import mongoose from "mongoose";
import PostCardSkeleton from "./ui/PostCardSkeleton";
import postServices from "@/database-services/post";

export default function MainFeed() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function loadPosts() {
    if (loading || !hasMore) return; // already loading or no more data
    setLoading(true);

    try {
      // const url = `/api/posts?limit=5${cursor ? `&cursor=${cursor}` : ""}`;
      const {data, nextCursor}:{data: IPost[], nextCursor: string} = await postServices.getLatestPosts({cursor});
      
      // const { data }: { data: IPost[] } = await res.json();

      if (data.length === 0) {
        setHasMore(false); // no more posts
        return; // stop here
      }

      // ✅ Avoid duplicates by checking last id
      setPosts((prev) => {
        setCursor(nextCursor);

        // filter out any posts already in state
        const newPosts = data.filter(
          (post) =>
            !prev.some((p) => p._id?.toString() === post._id?.toString())
        );
        return [...prev, ...newPosts];
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          loadPosts();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loaderRef, loading, hasMore, cursor]);

  return (
    <div className="w-full flex flex-col h-fit pb-28">
      {/* Posts */}
      {posts.map((post) => (
        <PostCard data={post} key={post._id?.toString()} />
      ))}

      {/* Skeleton loader when fetching */}
      {(loading || posts.length === 0) && (
        <div className="flex flex-col gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Sentinel div to detect scroll end */}
      <div ref={loaderRef} className="h-10" />

      {/* No more posts */}
      {!hasMore && !loading && (
        <p className="text-gray-500 text-center mt-4">No more posts</p>
      )}
    </div>
  );
}
