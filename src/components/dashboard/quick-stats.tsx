"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeightLog, CompletedWorkout } from "@/types";
import { TrendingUp, Dumbbell, Scale, HeartPulse, Loader2 } from "lucide-react";

interface QuickStatsProps {
  weightLogs: WeightLog[];
  completedWorkouts: CompletedWorkout[];
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

function StatCard({ title, value, icon: Icon, unit, trend }: StatCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
        </div>
        {/* Placeholder for trend description, could be based on comparison with previous period */}
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  );
}

export function QuickStats({ weightLogs, completedWorkouts, isLoading }: QuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
               <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3 animate-pulse mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const lastWeightLog = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1] : null;
  const totalWorkoutsThisMonth = completedWorkouts.filter(cw => {
    const completedDate = new Date(cw.dateCompleted);
    const today = new Date();
    return completedDate.getMonth() === today.getMonth() && completedDate.getFullYear() === today.getFullYear();
  }).length;
  
  // Example BMI calculation (assuming height is known or stored in user profile)
  // For now, we'll just display if logged, otherwise N/A
  const currentBMI = lastWeightLog?.bmi ?? "N/A";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard title="Current Weight" value={lastWeightLog?.weightKg ?? "N/A"} unit="kg" icon={Scale} />
      <StatCard title="Workouts This Month" value={totalWorkoutsThisMonth} icon={Dumbbell} />
      <StatCard title="Current BMI" value={currentBMI} icon={HeartPulse} />
    </div>
  );
}
