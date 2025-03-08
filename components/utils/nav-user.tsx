import { LogInIcon, LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "../ui/button";
import { LogoutLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { cn } from "@/lib/utils";
export function NavUser() {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();
  const { open } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {user ? (
          <motion.div
            className="flex items-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Avatar className={cn("w-8 h-8")}>
              <AvatarImage src={user.picture ?? ""} />
              <AvatarFallback>
                {(user.given_name?.charAt(0).toUpperCase() ?? "") +
                  (user.family_name?.charAt(0).toUpperCase() ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className={cn("ml-2 transition-all", !open && "hidden")}>
              <div className="font-semibold">{user.given_name ?? ""}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <LogoutLink>
              <Button size="icon" variant="ghost" className={cn("ml-2", !open && "hidden")}>
                <LogOutIcon />
              </Button>
            </LogoutLink>
          </motion.div>
        ) : (
          <LoginLink>
            <Button
              variant="default"
              className="w-full flex px-4 items-center justify-between"
            >
              <LogInIcon />
              Sign In
            </Button>
          </LoginLink>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
