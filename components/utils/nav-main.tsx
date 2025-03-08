"use client";

import * as React from "react";
import {
  Home,
  History,
  TrendingUp,
  Plus,
  ListMusic,
  TypeIcon as type,
  EditIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";

const mainNavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    absolute: true,
  },
  {
    title: "Trending",
    url: "#Trending",
    icon: TrendingUp,
    absolute: true,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
    absolute: true,
  },
];
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Label } from "../ui/label";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useConvexClient } from "@/hooks/use-convex-client";
// import NavPlaylsitWrapper from "./nav-playlist-wrapper";

export function NavMain() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          {!mainNavItems.length ? <h1>No playlists Till Now.</h1> : null}
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {/* <SignedIn><NavPlaylsitWrapper /></SignedIn> */}
      {/* <SignedOut></SignedOut> */}
    </>
  );
}
