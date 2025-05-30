"use client";

import { Calendar } from "@/components/ui/calendar";
import type { CompletedWorkout, WorkoutPlan } from "@/types";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Dumbbell, Info } from "lucide-react";

interface CompletedWorkoutsCalendarProps {
  completedWorkouts: CompletedWorkout[];
  workoutPlans: WorkoutPlan[]; // To get plan names
  isLoading: boolean;
}

export function CompletedWorkoutsCalendar({ completedWorkouts, workoutPlans, isLoading }: CompletedWorkoutsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const completedDates = useMemo(() => {
    return completedWorkouts.map(cw => new Date(cw.dateCompleted + 'T00:00:00')); // Ensure correct date parsing
  }, [completedWorkouts]);

  const workoutsByDate = useMemo(() => {
    const map = new Map<string, { planName: string; planId: string }[]>();
    completedWorkouts.forEach(cw => {
      const dateStr = cw.dateCompleted;
      const plan = workoutPlans.find(p => p.id === cw.workoutPlanId);
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr)?.push({ planName: plan?.name || "Unknown Workout", planId: cw.workoutPlanId });
    });
    return map;
  }, [completedWorkouts, workoutPlans]);

  const DayContent = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const workoutsOnDay = workoutsByDate.get(dateStr);
    
    if (workoutsOnDay && workoutsOnDay.length > 0) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative w-full h-full flex items-center justify-center">
              <span>{day.getDate()}</span>
              <CheckCircle2 className="absolute bottom-0 right-0 h-3 w-3 text-green-500" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 text-sm" side="top" align="center">
            <div className="font-semibold mb-1">Completed:</div>
            <ul className="list-disc list-inside">
              {workoutsOnDay.map((wo, idx) => <li key={idx}>{wo.planName}</li>)}
            </ul>
          </PopoverContent>
        </Popover>
      );
    }
    return <span>{day.getDate()}</span>;
  };

  if (isLoading) {
    return (
        <div className="p-4 border rounded-lg shadow-md animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4 mx-auto"></div> {/* Month/Year */}
            <div className="grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, i) => <div key={i} className="h-4 bg-muted rounded w-1/2 mx-auto mb-2"></div>)} {/* Day names */}
                {[...Array(35)].map((_, i) => <div key={i} className="h-10 bg-muted/50 rounded"></div>)} {/* Calendar days */}
            </div>
        </div>
    );
  }

  if (completedWorkouts.length === 0 && !isLoading) {
    return (
        <div className="text-center py-10 border rounded-lg shadow-md p-6">
          <Dumbbell className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Workouts Logged Yet</h2>
          <p className="text-muted-foreground">
            Start tracking your workouts to see them on the calendar!
          </p>
        </div>
    );
  }

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      className="rounded-md border shadow-lg p-4 bg-card w-full max-w-xl mx-auto"
      modifiers={{ completed: completedDates }}
      modifiersStyles={{
        completed: { 
            // border: "2px solid hsl(var(--primary))", // This makes day smaller, might need custom DayContent
            // fontWeight: 'bold',
            // color: 'hsl(var(--primary-foreground))',
            // backgroundColor: 'hsl(var(--primary))'
        }, 
      }}
      components={{
        DayContent: ({ date }) => DayContent(date)
      }}
    />
  );
}
