import Link from "next/link";
import { IconHeart, IconMessageCircle  } from '@tabler/icons-react';    

export default function PostCard() {
    return (
        // <Link href={`/user/${username}`}>
        <Link href={`/user/sohampatel`} className=" max-w-7xl w-full flex gap-2 hover:bg-[#9f9f9f6d] p-4 my-1 rounded-2xl flex-col justify-center ">
             <div className=" ">
                <div className="flex items-center">
                    <div className=" flex gap-3 items-center">{/* user detail and post time */}
                        <img src={"/logo-dark.png"} alt="" className=" bg-[#fff] rounded-full border w-7 h-7"/>
                        <h4>SohamPatel</h4>
                        <div className=" flex items-center gap-1">{/* post time */}
                            <div className="w-1 h-1 rounded-full bg-[#989797]"></div>
                            <h6 className=" text-sm text-[#989797]">10 hr. ago</h6>
                        </div>
                    </div>
                    {/* here make div for right side */}
                </div>  
             </div>
             <div className=" flex flex-col gap-2">
                <h1 className=" text-xl lg:text-2xl md:font-semibold">This ia main title Which is The Thought of User This ia main title Which is The Thought of User This ia main title Which is The Thought of User This ia main title Which is The Thought of User   </h1>
                <div className=" max-h-[540px] overflow-hidden flex justify-center bg-black rounded-2xl">
                    <img src={"/post-testing.jpg"} alt="" className="max-h-[540px] object-contain"/>
                </div>
                <h6 className=" text-[#cacaca] ">This ia main title Which is The Thought of UserThis ia main title Which is The Thought of UserThis ia main title Which is The Thought of UserThis ia main title Which is The Thought of UserThis ia main title Which is The Thought of User....</h6>
             </div>
             <div>
                <div className=" flex justify-between">
                    <div className=" flex gap-2">
                        <IconHeart />
                        <IconMessageCircle />
                    </div>
                    <div>

                    </div>
                </div>
             </div>
        </Link>
    )
}