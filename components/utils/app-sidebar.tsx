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

import {NavUser} from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import { useQueue } from "@/providers/queue-provider";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentSong } = useQueue();


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
      <SidebarFooter className={currentSong ? "mb-[90px]" : ""}>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
