"use client";

import { CompletedWorkoutsCalendar } from "@/components/calendar/completed-workouts-calendar";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import type { CompletedWorkout, WorkoutPlan } from "@/types";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]); // To map planId to planName
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      try {
        const [cwData, plansData] = await Promise.all([
          api.getCompletedWorkouts(user.uid),
          api.getWorkoutPlans() // Fetch all plans to get names; optimize if needed
        ]);
        setCompletedWorkouts(cwData);
        setWorkoutPlans(plansData);
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8 text-center">Workout Calendar</h1>
      <p className="text-muted-foreground mb-8 text-center">
        View your completed workouts. Days with completed workouts are highlighted.
      </p>
      <CompletedWorkoutsCalendar 
        completedWorkouts={completedWorkouts} 
        workoutPlans={workoutPlans} 
        isLoading={isLoading || authLoading} 
      />
    </div>
  );
}
