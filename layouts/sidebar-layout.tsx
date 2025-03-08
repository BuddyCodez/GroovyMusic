"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/utils/app-sidebar";
import { useQueue } from "@/providers/queue-provider";
import PlayerView from "@/features/player/components/PlayerView";
import { Song } from "@/types/song";
import { SearchBar } from "@/components/utils/search-bar";

// get children and props

export function SidebarLayout(props: {
  children: React.ReactNode;
  isLoading?: boolean;
  breadcrumb?: {
    items: {
      title: string;
      url: string;
      active?: boolean;
    }[];
  };
}) {
  const { currentSong } = useQueue();
  const pathname = usePathname();
  const breadcrumbs = [
    {
      title: "Home",
      url: "/",
      active: pathname === "/",
    },
    ...(props.breadcrumb?.items ?? []),
  ];

  return (
    <>
      <div
        className="layout"
        style={{
          height: currentSong ? "calc(100vh - 200px)" : "100vh",
          maxHeight: currentSong ? "calc(100vh - 200px)" : "100vh",
        }}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header
              className="flex h-16  items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12   sticky top-0 z-10  w-full py-2 bg-background"
              style={{
                // background: "#0a0a0a",
                zIndex: 12
              }}
            >
              <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="header-search-wrapper">
                  <SearchBar />
                </div>
              </div>
            </header>
            <SidebarContent>{props.children}</SidebarContent>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}

const SidebarContent = (props: { children: React.ReactNode }) => {
  const { open, openMobile, isMobile } = useSidebar();
  const condition = isMobile ? openMobile : open;
  const { currentSong } = useQueue();
  return (
    <div
      className={`flex flex-1 flex-col gap-4 p-4  ${
        condition ? "open-sidebar" : "closed-sidebar"
      } `}
    >
      {props.children}
    </div>
  );
};
