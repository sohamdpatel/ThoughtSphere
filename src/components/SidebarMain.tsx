"use client";

import React, { useState } from "react";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Sidebar";

import {
  IconArrowLeft,
  IconHome,
  IconBellRinging,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";

import Logo from "@/components/ui/Logo";

import { useSession } from "next-auth/react";

import { authOptions } from "@/lib/authOption";

export default function SideBarMain() {
  const { data: session } = useSession();

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

  const [open, setOpen] = useState(false);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 border-r">
        <div className="flex flex-1 flex-col pt-3 overflow-x-hidden overflow-y-auto">
          <Logo open={open} />

          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>

        <div>
          {session ? (
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
          )}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
