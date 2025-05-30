"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkoutPlan } from "@/types";
import { CheckCircle2, Loader2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api"; // Assuming api.markWorkoutAsCompleted exists
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface TodaysWorkoutCardProps {
  workout: WorkoutPlan | null;
  isLoading: boolean;
  onWorkoutCompleted?: () => void; // Callback to refresh data on parent
}

export function TodaysWorkoutCard({ workout, isLoading, onWorkoutCompleted }: TodaysWorkoutCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleMarkAsCompleted = async () => {
    if (!workout || !user) return;
    setIsCompleting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await api.markWorkoutAsCompleted(user.uid, workout.id, today); // Assuming user.uid for backend userId
      toast({
        title: "Workout Completed!",
        description: `${workout.name} marked as done. Great job!`,
      });
      if (onWorkoutCompleted) onWorkoutCompleted();
    } catch (error) {
      console.error("Failed to mark workout as completed", error);
      toast({
        title: "Error",
        description: "Could not mark workout as completed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Today&apos;s Workout</CardTitle>
          <CardDescription>Loading your recommended workout...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!workout) {
    return (
       <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>Today&apos;s Workout</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No workout scheduled for today, or an error occurred.</p>
          <p className="text-sm text-muted-foreground mb-4">
            Set your <Link href={Routes.goal} className="text-primary hover:underline">fitness goal</Link> to get recommendations, or browse all <Link href={Routes.workouts} className="text-primary hover:underline">workout plans</Link>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      {workout.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            // @ts-ignore
            src={workout.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(workout.name)}`}
            alt={workout.name}
            layout="fill"
            objectFit="cover"
            // @ts-ignore
            data-ai-hint={workout['data-ai-hint'] || 'fitness workout'}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{workout.name}</CardTitle>
        <CardDescription>{workout.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <p><strong>Goal:</strong> <span className="capitalize">{workout.goal.replace('_', ' ')}</span></p>
          <p><strong>Type:</strong> <span className="capitalize">{workout.type.replace('_', ' ')}</span></p>
          <p><strong>Duration:</strong> {workout.duration}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={`${Routes.workouts}?planId=${workout.id}`}>View Details</Link>
        </Button>
        <Button onClick={handleMarkAsCompleted} className="w-full sm:w-auto" disabled={isCompleting}>
          {isCompleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          Mark as Completed
        </Button>
      </CardFooter>
    </Card>
  );
}
