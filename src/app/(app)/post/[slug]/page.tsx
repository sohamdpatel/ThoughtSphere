// src/app/posts/[slug]/page.tsx
"use client"; // This directive marks the component as a Client Component

import React, { useState, useEffect } from "react";
import PostCardSkeleton from "@/components/ui/PostCardSkeleton";
import postServices from "@/database-services/post";
import { IPost, IPostAuthor } from "@/models/Post";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  IconHeart,
  IconMessageCircle,
  IconShare3,
  IconBookmark,
  IconHeartFilled,
  IconDots,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useDebounceCallback } from "usehooks-ts";
import { useParams } from "next/navigation";
// Suspense is typically used with server components or React.lazy on the client
// For direct data fetching in a client component, useEffect handles the loading state.

export default function PostDetailPage() {
  // console.log("slug", slug);
  
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // get post
  useEffect(() => {
    const getPostData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postServices.getPost({ slug });
        setPost(response.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getPostData();
    }
  }, [slug]);

  const author = post?.authorId as IPostAuthor;
  const { data: session, status } = useSession();

  const [isLiked, setIsLiked] = useState(post?.hasLiked);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <PostCardSkeleton />
      </main>
    );
  }

  if (error) {
    toast.error(error);
  }

  if (!post) {
    toast("Post not found");
  }

  // handle like 
  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      window.location.href = "/sign-in";
      return;
    }
    if (isLiking) return;

    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!previousIsLiked);
    setLikesCount(previousIsLiked ? previousLikesCount - 1 : previousLikesCount + 1);
    setIsLiking(true);

    try {
      const response = await postServices.toggleLike({ slug });
      if (!response.ok) throw new Error("Failed to like/unlike post");
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error(error);
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    } finally {
      setIsLiking(false);
    }
  };

  // const debouncedLikeHandler = useDebounceCallback(handleLikeClick, 500);

  return (
    <div
     className="min-h-screen flex justify-center w-full p-10">
      {/* No Suspense needed here as loading state is managed by useEffect/useState */}
      <div
      key={post?._id?.toString()}
      className=" overflow-hidden    w-full flex hover:shadow-[0_4px_20px_-4px] shadow-[0_2px_10px_-2px] shadow-[#1c1c1c] dark:hover:shadow-[#000000ad] transition-all duration-300 border-0  bg-[#303030] rounded-2xl my-2 flex-col justify-center "
    >
      <div
      className=" p-4 flex flex-col gap-2 ">
        <div className="flex items-center justify-between">
          <div className=" flex gap-3 items-center">
            {/* user detail and post time */}
            <img
              src={post ? author.image : "/logo-dark.png"}
              alt=""
              className=" bg-[#fff] rounded-full border w-7 h-7"
            />
            <h4 className=" text-md font-semibold">{author.username}</h4>
            <div className=" flex items-center gap-1">
              {/* post time */}
              <div className="w-0.5 h-0.5 rounded-full bg-[#989797]"></div>
              <h6 className=" text-[12px] text-[#989797]">10 hr. ago</h6>
            </div>
          </div>  
          {/* here make div for right side */}
          <div className="hover:bg-[#767676] rounded-xl px-3 py-2">
            <IconDots className=" h-6 w-6" />
          </div>
        </div>
        <div className=" flex flex-col gap-2">
          <h1 className=" text-md lg:text-lg ">{post?.title}</h1>
          <div className="flex flex-wrap gap-2">
            {post?.tags &&
              post?.tags.map((tag: string, index: number) => (
                <div
                  key={index}
                  className=" bg-[#202020] px-3 py-1 rounded-full"
                >
                  <h4 className=" text-[#dddddd] text-xs">{tag}</h4>
                </div>
              ))}
          </div>
          {post?.fileLink && (
            <div className=" max-h-[440px] relative overflow-hidden flex justify-center bg-black rounded-2xl">
              {/* Blurred background (placeholder) */}
              <img
                src={
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=jpg&q=20&w=200"
                }
                alt=""
                className="absolute inset-0 object-cover w-full blur-3xl z-0"
              />

              {/* Main image */}
              <img
                src={
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
                }
                alt=""
                className="max-h-[440px] object-contain relative z-10"
              />
            </div>
          )}
          <p className=" text-[#cacaca] text-sm sm:text-md overflow-hidden line-clamp-3 break-all text-wrap truncate ">
            {post?.content}
          </p>
        </div>
      </div>
      <hr className=" text-[#555555]" />
      <div className=" flex justify-between p-3">
        <div className=" flex gap-2">
          <button
            onClick={handleLikeClick}
            disabled={isLiking || status === 'loading'}
            className={`flex gap-2 items-center hover:bg-[#767676] rounded-xl px-3 py-2 transition-transform duration-200 ${isLiked ? 'text-red-500' : ''}`}
          >
            {isLiked ? (
              <IconHeartFilled className="h-6 w-6 animate-heart-pop" />
            ) : (
              <IconHeart className="h-6 w-6" />
            )}
            <h4 className="text-sm">{likesCount}</h4>
          </button>
          <div className=" flex gap-2 items-center hover:bg-[#767676] rounded-xl px-3 py-2">
            <IconMessageCircle className=" h-6 w-6" />
            <h4>{post?.commentsCount}</h4>
          </div>
          <div className=" hover:bg-[#767676] rounded-xl px-3 py-2">
            <IconShare3 className=" h-6 w-6" />
          </div>
        </div>
        <div className="hover:bg-[#767676] rounded-xl px-3 py-2">
          <IconBookmark className=" h-6 w-6" />
        </div>
      </div>
      {/* <hr /> */}
    </div>
    {/* this is for add new root comment */}
    <div>

    </div>
    {/* this is for show comments */}
    <div>

    </div>
    </div>
  );
}