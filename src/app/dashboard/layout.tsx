"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { MainHeader } from '@/components/dashboard/layout/main-header';
import { SidebarNav } from '@/components/dashboard/layout/sidebar-nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

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
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="container mx-auto flex flex-1 py-6">
        <aside className="hidden w-64 flex-col md:flex">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <SidebarNav />
          </ScrollArea>
        </aside>
        <main className="flex-1 lg:max-w-[calc(100%-16rem-1.5rem)]"> {/* 16rem for sidebar, 1.5rem for pr */}
          {children}
        </main>
      </div>
    </div>
  );
}
