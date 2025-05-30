
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  CalendarDays,
  LineChart,
  Target, // Keep Target for My Goal / Profile link
  Ruler, // Or use Ruler as requested for "My Profile" if preferred over Target
  // Settings, // Example for future
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Routes } from "@/config/routes";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: Routes.home, icon: Home },
  { title: "My Profile", href: Routes.goal, icon: Target }, // Changed title from "My Goal" to "My Profile", icon can be Target or Ruler
  { title: "Workout Plans", href: Routes.workouts, icon: Dumbbell },
  { title: "Calendar", href: Routes.calendar, icon: CalendarDays },
  { title: "Progress", href: Routes.progress, icon: LineChart },
  // { title: "Settings", href: Routes.settings, icon: Settings }, // Example
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu className={className} {...props}>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href === Routes.goal && pathname.startsWith('/dashboard/goal'))} // Make "My Profile" active for /dashboard/goal
              tooltip={item.title}
              variant={pathname === item.href || (item.href === Routes.goal && pathname.startsWith('/dashboard/goal')) ? "default" : "ghost"} 
              className={pathname === item.href || (item.href === Routes.goal && pathname.startsWith('/dashboard/goal'))
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
            >
              <a> {/* Link content needs to be wrapped in <a> for passHref + asChild */}
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
