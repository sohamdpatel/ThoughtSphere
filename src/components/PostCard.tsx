import Link from "next/link";

export default function PostCard() {
    return (
        // <Link href={`/user/${username}`}>
        <Link href={`/user/sohampatel`} className="  max-w-7xl w-full flex flex-col justify-center ">
             <div className=" ">
                <div className="flex items-center">
                    <div className=" flex gap-3 items-center">{/* user detail and post time */}
                        <img src={"/logo-dark.png"} alt="" className=" w-7 h-7"/>
                        <h4>SohamPatel</h4>
                        <div className=" flex items-center gap-1">{/* post time */}
                            <div className="w-1 h-1 rounded-full bg-[#989797]"></div>
                            <h6 className=" text-sm text-[#989797]">10 hr. ago</h6>
                        </div>
                    </div>
                    {/* here make div for right side */}
                </div>
             </div>
             <div>
                <h1>This ia main title Which is The Thought of User</h1>
                <img src={"/post-testing.jpg"} alt="" className=" max-h-[600px]"/>
             </div>
             <div>
                
             </div>
        </Link>
    )
}