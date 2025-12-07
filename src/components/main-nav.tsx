"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GitBranch,
  GitPullRequest,
  LayoutDashboard,
  Search,
  Settings,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/repositories", label: "Repositories", icon: <GitBranch /> },
  { href: "/pull-requests", label: "Pull Requests", icon: <GitPullRequest /> },
  { href: "/search", label: "Search", icon: <Search /> },
  { href: "/settings", label: "Settings", icon: <Settings /> },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item, index) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
              isActive={isActive}
            tooltip={{ children: item.label, side: "right", align: "center" }}
              className={`transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-purple-600 dark:to-violet-600 text-white shadow-lg' 
                  : 'hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-primary'
              }`}
          >
              <Link 
                href={item.href}
                className="flex items-center gap-3 group"
              >
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
