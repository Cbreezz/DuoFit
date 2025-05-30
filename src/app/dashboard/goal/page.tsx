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

  const handleGoalUpdated = (newGoal: FitnessGoal) => {
    setBackendUser(prev => prev ? { ...prev, goal: newGoal } : null);
    // Optionally, could re-fetch profile to confirm, but optimistic update is fine here.
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height,4rem))] items-center justify-center"> {/* Adjust height based on actual header */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <GoalSelectionForm 
        currentGoal={backendUser?.goal} 
        onGoalUpdated={handleGoalUpdated} 
      />
    </div>
  );
}
