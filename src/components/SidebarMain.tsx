import React from "react";
import { Sidebar, SidebarBody, SidebarLink, Logo } from "@/components/ui/Sidebar";
import {
  IconArrowLeft,
  IconHome,
  IconBellRinging,
  IconSearch,
} from "@tabler/icons-react";
import Profile from "./ui/Profile";


export default function SideBarMain() {

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="h-6 w-6 shrink-0 ml-0.5 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "Explore",
      href: "#",
      icon: (
        <IconSearch className="h-5 w-5 shrink-0 ml-0.5 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "Notifications",
      href: "#",
      icon: (
        <IconBellRinging className="h-5 w-5 shrink-0 ml-0.5 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 ml-0.5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];


  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10 border-r">
        <div className="flex flex-1 flex-col pt-3 overflow-x-hidden overflow-y-auto">
          <Logo />

          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
            
        <div>     
          {/* <Suspense > */}
            <Profile />
            
          {/* </Suspense> */}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
