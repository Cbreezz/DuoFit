"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        router.replace(Routes.home);
      } else {
        router.replace(Routes.login);
      }
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return null; // Or a loading spinner specific to this page
}
