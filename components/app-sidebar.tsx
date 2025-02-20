"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { List, Settings } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/hooks/useCurrentRole";

// Menu items.
const items = {
  [UserRole.ADMIN]: [
    {
      title: "Booking rides",
      url: "/booking-rides",
      icon: List,
    },

    {
      title: "Drivers",
      url: "/drivers",
      icon: List,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  [UserRole.USER]: [
    {
      title: "Booking rides",
      url: "/booking-rides",
      icon: List,
    },

    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export function AppSidebar() {
  const pathname = usePathname();
  const role = useCurrentRole() ?? UserRole.ADMIN;

  return (
    <Sidebar>
      <SidebarHeader className="bg-purple-800">
        <SidebarGroupLabel
          className={cn(
            "text-3xl font-semibold text-[#FFEC00] drop-shadow-md flex items-center gap-2",
            font.className
          )}
        >
          MOOVTEK
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent className="bg-purple-800">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items[role].map((item) => (
                <SidebarMenuItem key={item.title} className="mb-2">
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "font-bold text-white",
                        pathname === item.url && "text-black bg-white"
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
