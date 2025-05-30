"use client";

import Link from "next/link";
import { Dumbbell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "./user-menu";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "@/hooks/use-auth";

export function MainHeader() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">DuoFit</span>
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b px-6">
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <Dumbbell className="h-6 w-6 text-primary" />
                    <span className="font-bold">DuoFit</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                   <SidebarNav className="flex-col px-4" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Mobile centered logo when menu is present */}
        <div className="flex flex-1 items-center justify-center md:hidden">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-bold">DuoFit</span>
          </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoggedIn ? <UserMenu /> : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
