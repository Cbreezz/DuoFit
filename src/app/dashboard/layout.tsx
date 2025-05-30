
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { MainHeader } from '@/components/dashboard/layout/main-header';
import { SidebarNav } from '@/components/dashboard/layout/sidebar-nav';
import { Loader2, Dumbbell } from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarInset 
} from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace(Routes.login);
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-2 flex items-center justify-center md:justify-start">
            <Link href={Routes.home} className="flex items-center gap-2 p-2 font-semibold">
              <Dumbbell className="h-7 w-7 text-primary" />
              <span className="text-lg group-data-[state=collapsed]/sidebar:hidden">DuoFit</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          {/* Optional: <SidebarFooter>...</SidebarFooter> */}
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <MainHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
