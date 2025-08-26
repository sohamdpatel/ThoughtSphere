
import { IPost, IPostAuthor } from "@/models/Post";
import { IconHeart, IconHeartFilled, IconMessageCircle, IconShare3 } from "@tabler/icons-react";
import Link from "next/link";
export default function MiniPostCard({ data }: { data: IPost }) {

      const author = data.authorId as IPostAuthor
    

  return (
    <Link href={`/post/${data.slug}`} key={data._id?.toString()} className=" w-full flex bg-[#1e1e1e] rounded-2xl p-3 ">
      <div className="pr-3 min-w-fit">
        <img
          src={author.image}
          alt=""
          className=" bg-[#fff] rounded-full border w-7 h-7 shrink-0"
        />
      </div>
      <div className=" flex flex-col gap-2">
        <div className=" flex gap-2 items-center">
            <h4 className=" text-md">{author.username}</h4>
              <h6 className=" text-[12px] border-2 border-[#989797] rounded-full px-2">10 h</h6>
        </div>
        <h1 className=" text-sm text-[#cacaca] line-clamp-2 break-all truncate text-wrap ">
            {data?.title}
          </h1>
        <div className=" flex gap-1">
                  <div className=" flex gap-2 items-center  rounded-xl px-1">
                    {data?.hasLiked ? (
                      <IconHeartFilled className=" h-4 w-4" />
                    ) : (
                      <IconHeart className=" h-5 w-5" />
                    )}
                    <h4 className=" text-xs">{data?.likesCount}</h4>
                  </div>
                  <div className=" flex gap-2 items-center rounded-xl px-1">
                    <IconMessageCircle className=" h-5 w-5" />
                    <h4 className=" text-xs">{data.commentsCount}</h4>
                  </div>
                </div>

      </div>
    </Link>
  );
}
