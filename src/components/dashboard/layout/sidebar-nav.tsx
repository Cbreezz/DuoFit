"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Home,
  Dumbbell,
  CalendarDays,
  LineChart,
  Target,
  Settings, // Example for future
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Routes } from "@/config/routes";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: Routes.home, icon: Home },
  { title: "My Goal", href: Routes.goal, icon: Target },
  { title: "Workout Plans", href: Routes.workouts, icon: Dumbbell },
  { title: "Calendar", href: Routes.calendar, icon: CalendarDays },
  { title: "Progress", href: Routes.progress, icon: LineChart },
  // { title: "Settings", href: Routes.settings, icon: Settings }, // Example
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean; // For icon-only view if sidebar is collapsed
}

export function SidebarNav({ className, isCollapsed, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: pathname === item.href ? "secondary" : "ghost" }), // "secondary" for active, "ghost" for others
            "w-full justify-start rounded-md",
            pathname === item.href
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" // Active styles using primary color
              : "hover:bg-accent hover:text-accent-foreground", // Hover styles for non-active
            isCollapsed && "justify-center px-2"
          )}
        >
          <item.icon className={cn("mr-2 h-5 w-5", isCollapsed && "mr-0")} />
          {!isCollapsed && item.title}
        </Link>
      ))}
    </nav>
  );
}
