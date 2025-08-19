import Link from "next/link";
import { IconHeart, IconMessageCircle, IconShare3, IconBookmark  } from '@tabler/icons-react';    

export default function PostCard() {
    return (
        // <Link href={`/user/${username}`}>
        <Link href={`/user/sohampatel`} className=" max-w-7xl w-full flex gap-3 hover:bg-[#9f9f9f6d]  p-4 flex-col justify-center ">
             <div className=" ">
                <div className="flex items-center">
                    <div className=" flex gap-3 items-center">{/* user detail and post time */}
                        <img src={"/logo-dark.png"} alt="" className=" bg-[#fff] rounded-full border w-7 h-7"/>
                        <h4 className=" text-md">SohamPatel</h4>
                        <div className=" flex items-center gap-1">{/* post time */}
                            <div className="w-0.5 h-0.5 rounded-full bg-[#989797]"></div>
                            <h6 className=" text-[12px] text-[#989797]">10 hr. ago</h6>
                        </div>
                    </div>
                    {/* here make div for right side */}
                </div>  
             </div>
             <div className=" flex flex-col gap-2">
                <h1 className=" text-xl lg:text-2xl md:font-semibold">This ia main title Which is The Thought of User This ia main title Which is The Thought of User This ia main title Which is The Thought of User This ia main title Which is The Thought of User   </h1>
                <div className=" max-h-[540px] overflow-hidden flex justify-center bg-black rounded-2xl">
                    <img src={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"} alt="" className="max-h-[440px] object-contain"/>
                </div>
                <h6 className=" text-[#cacaca] ">This ia main title Which is The Thought of UserThis ia main title Which is The Thought of UserThis ia main title Which is The Thought of UserThis ia main title Which is The Thought of UserThis ia main title Which is The Thought of User....</h6>
             </div>
             <div>
                <div className=" flex justify-between">
                    <div className=" flex gap-3">
                        <div className=" flex gap-2 items-center">
                            <IconHeart className=" h-7 w-7"/>
                            <h4>200</h4>
                        </div>
                        <div className=" flex gap-2 items-center">
                            <IconMessageCircle className=" h-7 w-7"/>
                            <h4>200</h4>
                        </div>
                        <div>
                            <IconShare3 className=" h-7 w-7" />
                        </div>
                    </div>
                    <div>
                        <IconBookmark className=" h-7 w-7" />
                    </div>
                </div>
             </div>
             {/* <hr /> */}
        </Link>
    )
}

