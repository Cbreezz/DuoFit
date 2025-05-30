
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { useAuth } from "@/hooks/use-auth";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger
import { Routes } from "@/config/routes";

export function MainHeader() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* SidebarTrigger for mobile and potentially tablet */}
        <SidebarTrigger className="md:hidden mr-4" /> 
        
        {/* Desktop: Space for breadcrumbs or title if sidebar is not icon-only trigger */}
        {/* The desktop trigger to expand/collapse an icon sidebar is often part of the sidebar itself (e.g. SidebarRail) or handled by clicking the logo/header in some designs. */}
        {/* For now, we assume the Sidebar component from ui/sidebar handles its desktop collapsibility if set to 'icon'. */}
        <div className="flex-1">
            {/* Optional: Breadcrumbs or page title can go here */}
        </div>

        <div className="flex items-center justify-end space-x-4">
          {isLoggedIn ? <UserMenu /> : (
            <Button asChild>
              <Link href={Routes.login}>Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
