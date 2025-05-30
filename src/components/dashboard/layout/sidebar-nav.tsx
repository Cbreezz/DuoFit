
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  CalendarDays,
  LineChart,
  Target, 
  Sparkles, // Icon for AI features
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Routes } from "@/config/routes";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: Routes.home, icon: Home },
  { title: "My Profile", href: Routes.goal, icon: Target },
  { title: "Workout Plans", href: Routes.workouts, icon: Dumbbell },
  { title: "AI Workout Gen", href: Routes.aiWorkout, icon: Sparkles }, // New Link
  { title: "Calendar", href: Routes.calendar, icon: CalendarDays },
  { title: "Progress", href: Routes.progress, icon: LineChart },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar(); // Get mobile state and setter

  const isActive = (href: string) => {
    if (href === Routes.home) return pathname === Routes.home || pathname === '/dashboard'; // Handle base dashboard route
    return pathname === href || pathname.startsWith(`${href}/`); // More generic check for sub-routes
  };
  
  return (
    <SidebarMenu className={className} {...props}>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.href)}
              tooltip={item.title}
              variant={isActive(item.href) ? "default" : "ghost"} 
              className={isActive(item.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false); // Close mobile sidebar on click
                }
              }}
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
