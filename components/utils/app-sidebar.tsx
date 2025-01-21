"use client";

import * as React from "react";
import {
  Bot,
  CircleUserRound,
  Home,
  Server,
  ReceiptText,
  Settings2,
  LifeBuoy,
  Send,
  Command,
} from "lucide-react";

import { NavMain } from "@/components/utils/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import { useQueue } from "@/providers/queue-provider";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      absolute: true,
      title: "Home",
      icon: Home,
      url: "/",
    },
    {
      title: "Bot",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "About",
          url: "#",
        },
        {
          title: "Features",
          url: "#",
        },
        {
          title: "Commands",
          url: "#",
        },
        {
          title: "Invite",
          url: "#",
        },
      ],
    },
    {
      absolute: true,
      title: "Guilds",
      icon: Server,
      url: "/guilds",
    },
    {
      absolute: true,
      title: "Profile",
      icon: CircleUserRound,
      url: "/profile",
    },
    {
      absolute: true,
      title: "Terms And Conditions",
      icon: ReceiptText,
      url: "/terms",
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentSong } = useQueue();
  const { user } = useUser();
  let d = {
    name: user?.fullName ?? "",
    email: user?.emailAddresses[0]?.emailAddress ?? "",
    avatar: user?.imageUrl ?? "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <span className="cursor-pointer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Groovy Music</span>
                  <span className="truncate text-xs">
                    Feel the Beat, Live the Rhythm.
                  </span>
                </div>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter className={currentSong ? "mb-[80px]" : ""}>
        <NavUser user={d} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
