
"use client";

import { GoalSelectionForm } from "@/components/goal/goal-selection-form";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import type { BackendUser, FitnessGoal } from "@/types";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function GoalPage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (firebaseUser) {
      setIsLoading(true);
      try {
        const profile = await api.getUserProfile(firebaseUser.uid);
        setBackendUser(profile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile();
    }
  }, [authLoading, fetchUserProfile]);

  const handleProfileUpdated = (updatedProfileFields: Partial<BackendUser>) => {
    setBackendUser(prev => prev ? { ...prev, ...updatedProfileFields } : null);
    // Re-fetch to confirm, or rely on optimistic update.
    // fetchUserProfile(); // Could re-fetch, but optimistic is often enough.
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,4rem))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto"> {/* Removed responsive padding here, handled by layout */}
      <GoalSelectionForm 
        currentUser={backendUser} 
        onProfileUpdated={handleProfileUpdated} 
      />
    </div>
  );
}
