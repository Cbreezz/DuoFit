
"use client";

import { WeightBmiChart } from "@/components/progress/weight-bmi-chart";
import { WeightBmiLogger } from "@/components/progress/weight-bmi-logger";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import type { WeightLog, BackendUser } from "@/types";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ProgressPage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);

  const fetchData = useCallback(async () => {
    if (firebaseUser) {
      setIsLoadingData(true);
      try {
        const [profile, logs] = await Promise.all([
          api.getUserProfile(firebaseUser.uid),
          api.getWeightLogs(firebaseUser.uid)
        ]);
        setBackendUser(profile);
        setWeightLogs(logs);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  const handleLogAdded = () => {
    // Refetch weight logs after a new log is added.
    // Profile might not need refetching unless height could change frequently.
    if (firebaseUser) {
      setIsLoadingData(true);
      api.getWeightLogs(firebaseUser.uid)
        .then(setWeightLogs)
        .catch(error => console.error("Failed to refetch weight logs:", error))
        .finally(() => setIsLoadingData(false));
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center">Track Your Progress</h1>
      
      {authLoading || isLoadingData ? (
         <div className="flex items-center justify-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WeightBmiChart data={weightLogs} isLoading={isLoadingData} />
          </div>
          <div className="lg:col-span-1">
            <WeightBmiLogger 
              onLogAdded={handleLogAdded}
              userHeightM={backendUser?.heightM}
            />
          </div>
        </div>
      )}
    </div>
  );
}

