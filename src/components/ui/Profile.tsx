'use client'

import { useSession } from "next-auth/react";
import { SidebarLink, useSidebar } from "@/components/ui/Sidebar";
import { IconUserCircle } from "@tabler/icons-react";
// import { motion } from "motion/react";
export default function Profile() {
  const { data: session, status } = useSession();
  const {open} = useSidebar()
 
  // Skeleton loader while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 py-2.5">
        <div className="h-6 w-6 ml-0.5 shrink-0 rounded-full bg-gray-300 animate-pulse" />
        
           <div className={`h-4 w-20 rounded-full bg-gray-300 ${open ? "" : "hidden"} animate-pulse transition duration-250`} />
      </div>
    );
  }

  return session ? (
    <SidebarLink
      link={{
        label: session.user?.username || "Guest",
        href: "/",
        icon: (
          <img
            src={
              session.user?.image
                ? session.user?.image
                : "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
            }
            className="h-7 w-7 shrink-0 rounded-full"
            width={50}
            height={50}
            alt="Avatar"
          />
        ),
      }}
    />
  ) : (
    <SidebarLink
      link={{
        label: "Sign In",
        href: "/sign-in",
        icon: (
          <IconUserCircle
            className="h-7 w-7 shrink-0 rounded-full"
            width={50}
            height={50}
          />
        ),
      }}
    />
  );
}
