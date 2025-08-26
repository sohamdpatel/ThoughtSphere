import { IconTrendingUp } from "@tabler/icons-react";
import MiniPostCard from "./ui/MiniPostCard";
import { IPost } from "@/models/Post";
import { useEffect, useState } from "react";
import MiniPostCardSkeleton from "./ui/MiniPostCardSkeleton";

export default function RecentPostFeed() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to simulate fetching data
  const fetchPosts = async () => {
    setLoading(true);
    // This is a placeholder for your actual API call
    // Replace this with your fetch logic (e.g., axios.get('/api/posts'))
    try {
      const url = `/api/posts?limit=4`;
      const res = await fetch(url);
      const { data }: { data: IPost[] } = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {loading ? (
        <div className="p-2 flex flex-col gap-2">
          <MiniPostCardSkeleton />
          <MiniPostCardSkeleton />
          <MiniPostCardSkeleton />
          <MiniPostCardSkeleton />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post: IPost) => (
            <MiniPostCard data={post} key={post._id?.toString() as string} />
          ))}
        </div>
      )}
    </>
  );
}

// export default function RecentPostFeed(){

//     return (
//         <div className="xl:max-w-[400px] lg:max-w-[350px] w-full hidden lg:block lg:sticky lg:top-0 h-screen py-5">
//         {/* Sidebar content */}
//         {/* <button onClick={handleSignOut}>Sign Out</button> */}
//         <div className=" overflow-hidden p-3 w-full flex shadow-[0_2px_10px_-2px] shadow-[#1c1c1c] border-0  bg-[#303030] rounded-2xl flex-col gap-2 ">
//           <div className="p-2 text-xl font-semibold flex gap-2">
//             <IconTrendingUp stroke={3} className=" w-7 h-7 text-[#c019dd]" />
//             Recent Post</div>
//           {/* <div className=" flex flex-col gap-2">
//             {posts.map((post: IPost) => (
//               <MiniPostCard data={post} key={post._id?.toString() as string} />
//             ))}
//           </div> */}
//           <div className="pr-1 w-full flex justify-end">

//           <h2 className=" w-fit hover:text-[#cb4de1] text">See more</h2>
//           </div>
//         </div>
//       </div>
//     )
// }
