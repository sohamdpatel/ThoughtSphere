'use client'

import Link from "next/link";
import {
  IconHeart,
  IconMessageCircle,
  IconShare3,
  IconBookmark,
  IconHeartFilled,
  IconDots,
} from "@tabler/icons-react";
import { IPost, IPostAuthor } from "@/models/Post";
import { useSession } from "next-auth/react";
import { useState } from "react";
import postServices from "@/database-services/post";
import { useDebounceCallback } from "usehooks-ts";
import { usePostLikes } from "@/hooks/post-hooks/usePostLikes";
export default function PostCard({ data }: { data: IPost }) {
  // console.log("data from postcad", data);
  
  const author = data.authorId as IPostAuthor;
  // console.log("data from author", author);
  const { data: session, status } = useSession();
   // State for optimistic UI and animation
  const { data: likes, toggleLike } = usePostLikes(data.slug,!!session);

  return (
    <div
      key={data._id?.toString()}
      className=" overflow-hidden max-w-7xl w-full flex hover:shadow-[0_4px_20px_-4px] shadow-[0_2px_10px_-2px] shadow-[#1c1c1c] dark:hover:shadow-[#000000ad] transition-all duration-300 border-0  bg-[#303030] rounded-2xl my-2 flex-col justify-center "
    >
      <Link 
      href={`/user/sohampatel`}
      className=" p-4 flex flex-col gap-2 ">
        <div className="flex items-center justify-between">
          <div className=" flex gap-3 items-center">
            {/* user detail and post time */}
            <img
              src={data ? author.image : "/logo-dark.png"}
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
          <h1 className=" text-md lg:text-lg ">{data?.title}</h1>
          <div className="flex flex-wrap gap-2">
            {data?.tags &&
              data?.tags.map((tag: string, index: number) => (
                <div
                  key={index}
                  className=" bg-[#202020] px-3 py-1 rounded-full"
                >
                  <h4 className=" text-[#dddddd] text-xs">{tag}</h4>
                </div>
              ))}
          </div>
          {data?.fileLink && (
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
            {data?.content}
          </p>
        </div>
      </Link>
      <hr className=" text-[#555555]" />
      <div className=" flex justify-between p-3">
        <div className=" flex gap-2">
          <button
            onClick={toggleLike}
            className={`flex gap-2 items-center hover:bg-[#767676] rounded-xl px-3 py-2 transition-transform duration-200`}
          >
            {likes?.hasLiked ? (
              <IconHeartFilled className="h-6 w-6 animate-heart-pop text-red-600" />
            ) : (
              <IconHeart className="h-6 w-6" />
            )}
            <h4 className="text-sm">{likes?.likesCount}</h4>
          </button>
          <div className=" flex gap-2 items-center hover:bg-[#767676] rounded-xl px-3 py-2">
            <IconMessageCircle className=" h-6 w-6" />
            <h4>{data.commentsCount}</h4>
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
  );
}
