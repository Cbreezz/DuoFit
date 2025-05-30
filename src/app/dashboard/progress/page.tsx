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
  const [isLoading, setIsLoading] = useState(true);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null); // To potentially get height for BMI

  const fetchData = useCallback(async () => {
    if (firebaseUser) {
      setIsLoading(true);
      try {
        // In a real app, user profile might contain height for BMI calculation
        // const profile = await api.getUserProfile(firebaseUser.uid); 
        // setBackendUser(profile);
        const logs = await api.getWeightLogs(firebaseUser.uid);
        setWeightLogs(logs);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  const handleLogAdded = () => {
    fetchData(); // Refresh data after a new log is added
  };
  
  // Example height, in a real app this would come from user profile (e.g., backendUser.heightM)
  const exampleUserHeightM = 1.75; 

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center">Track Your Progress</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeightBmiChart data={weightLogs} isLoading={isLoading || authLoading} />
        </div>
        <div className="lg:col-span-1">
          <WeightBmiLogger 
            onLogAdded={handleLogAdded}
            // userHeightM={backendUser?.heightM || exampleUserHeightM} // Pass actual height if available
          />
        </div>
      </div>
    </div>
  );
}
