
"use client";

import { TodaysWorkoutCard } from "@/components/dashboard/todays-workout-card";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { useEffect, useState, useCallback } from "react";
import type { WorkoutPlan, WeightLog, CompletedWorkout } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Routes } from "@/config/routes";

export default function DashboardPage() {
  const { user } = useAuth();
  const [todaysWorkout, setTodaysWorkout] = useState<WorkoutPlan | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [workoutRes, weightLogsRes, completedWorkoutsRes] = await Promise.all([
        api.getTodaysWorkout(user.uid),
        api.getWeightLogs(user.uid),
        api.getCompletedWorkouts(user.uid)
      ]);
      setTodaysWorkout(workoutRes);
      setWeightLogs(weightLogsRes);
      setCompletedWorkouts(completedWorkoutsRes);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Optionally set error state and display error message
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWorkoutCompleted = () => {
    // Refetch completed workouts or update state optimistically
    fetchData(); 
  }
  
  return (
    <div className="container mx-auto"> {/* Removed responsive padding here, handled by layout */}
      <div className="space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Welcome, {user?.displayName || 'User'}!</h1>
        
        <section>
          <TodaysWorkoutCard workout={todaysWorkout} isLoading={isLoading} onWorkoutCompleted={handleWorkoutCompleted} />
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-4">Your Progress At a Glance</h2>
          <QuickStats weightLogs={weightLogs} completedWorkouts={completedWorkouts} isLoading={isLoading} />
        </section>

        <section>
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Fitness Journey Tools</CardTitle>
              <CardDescription>Explore more features to help you achieve your goals.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Button variant="outline" asChild><Link href={Routes.goal}>Set/Update Profile</Link></Button>
              <Button variant="outline" asChild><Link href={Routes.workouts}>Browse Workouts</Link></Button>
              <Button variant="outline" asChild><Link href={Routes.calendar}>View Calendar</Link></Button>
              <Button variant="outline" asChild><Link href={Routes.progress}>Track Progress</Link></Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
