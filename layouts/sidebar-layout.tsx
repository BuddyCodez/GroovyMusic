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
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 positon-fixed w-full py-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {props.isLoading && (
                      <div className="space-y-4">
                        <Skeleton className=" h-[2.5rem]  " />
                      </div>
                    )}
                    {!props.isLoading &&
                      breadcrumbs.map((item, index) => (
                        <React.Fragment key={index}>
                          <BreadcrumbItem>
                            <Link
                              aria-disabled={item.active}
                              href={item.url}
                              className={`
                        ${item.active ? "text-white" : "text-white-200"}
                        `}
                            >
                              {item?.title}
                            </Link>
                          </BreadcrumbItem>
                          {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </React.Fragment>
                      ))}
                  </BreadcrumbList>
                </Breadcrumb>
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
