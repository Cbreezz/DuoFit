
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkoutPlan, WorkoutExercise, LoggedExercisePerformance } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Zap, ListChecks, CheckSquare, Loader2, Trophy, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { format } from 'date-fns';

interface WorkoutPlanDetailsModalProps {
  plan: WorkoutPlan;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionLogged?: () => void; // Optional: callback after logging a session
}

interface SessionPerformanceInput {
  weightKg?: string;
  reps?: string;
}

export function WorkoutPlanDetailsModal({ plan, isOpen, onOpenChange, onSessionLogged }: WorkoutPlanDetailsModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [sessionInputs, setSessionInputs] = useState<Record<string, SessionPerformanceInput>>({});
  const [isLogging, setIsLogging] = useState(false);

  // Reset inputs when modal opens or plan changes
  useEffect(() => {
    if (isOpen) {
      const initialInputs: Record<string, SessionPerformanceInput> = {};
      plan.exercises.forEach(ex => {
        initialInputs[ex.id] = { weightKg: '', reps: '' };
      });
      setSessionInputs(initialInputs);
    }
  }, [isOpen, plan]);

  const handleInputChange = (exerciseId: string, field: keyof SessionPerformanceInput, value: string) => {
    setSessionInputs(prev => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [field]: value,
      },
    }));
  };

  const handleLogSession = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    const performancesToLog = Object.entries(sessionInputs)
      .map(([exerciseId, inputs]) => {
        const exerciseDetail = plan.exercises.find(ex => ex.id === exerciseId);
        if (!exerciseDetail || (!inputs.weightKg && !inputs.reps)) { // Allow logging if at least one is present
          return null; 
        }
        // Only log if at least one value is a valid number, or if one is empty and other is valid
        const weight = parseFloat(inputs.weightKg || '');
        const reps = parseInt(inputs.reps || '', 10);

        if (isNaN(weight) && isNaN(reps)) return null; // Both are invalid or empty string after parse

        return {
          userId: user.uid,
          exerciseId: exerciseId,
          exerciseName: exerciseDetail.name,
          workoutPlanId: plan.id,
          dateLogged: format(new Date(), "yyyy-MM-dd"),
          weightKg: isNaN(weight) ? 0 : weight, // Default to 0 if not provided/invalid, backend might handle this better
          reps: isNaN(reps) ? 0 : reps, // Default to 0
        };
      })
      .filter(p => p !== null) as Omit<LoggedExercisePerformance, 'id' | 'isNewPR'>[];

    if (performancesToLog.length === 0) {
      toast({
        title: "No Performance Data",
        description: "Please enter weight and/or reps for at least one exercise to log your session.",
        variant: "default",
      });
      return;
    }

    setIsLogging(true);
    let prCount = 0;
    try {
      const logPromises = performancesToLog.map(perf => api.logExercisePerformance(user.uid, perf));
      const results = await Promise.all(logPromises);
      
      results.forEach(result => {
        if (result.isNewPR) {
          prCount++;
          toast({
            title: "🎉 New Personal Record! 🎉",
            description: (
              <div className="flex flex-col">
                <span><strong>{result.exerciseName}</strong></span>
                <span>{result.weightKg}kg x {result.reps} reps</span>
                <span className="text-xs text-muted-foreground">Keep up the great work!</span>
              </div>
            ),
            duration: 7000, // Longer duration for PR toast
          });
        }
      });

      if (prCount === 0) {
        toast({
          title: "Session Logged!",
          description: `Great job completing ${performancesToLog.length} exercise(s).`,
        });
      } else if (prCount < performancesToLog.length) {
         toast({
          title: "Session Logged!",
          description: `Good work! ${performancesToLog.length - prCount} other exercise(s) logged.`,
        });
      }


      setSessionInputs({}); // Clear inputs after logging
      if (onSessionLogged) onSessionLogged();
      // onOpenChange(false); // Optionally close modal
    } catch (error) {
      console.error("Failed to log session:", error);
      toast({
        title: "Logging Failed",
        description: "Could not log your workout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      // if (!open) setSessionInputs({}); // Reset inputs when modal is closed, handled by useEffect on isOpen
    }}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[700px] p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 md:p-6 pb-2 border-b">
          <DialogTitle className="text-xl md:text-2xl lg:text-3xl font-bold">{plan.name}</DialogTitle>
          <DialogDescription className="text-sm md:text-base">{plan.description}</DialogDescription>
           <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="capitalize text-xs md:text-sm py-1 px-2">
                    {plan.goal.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="capitalize text-xs md:text-sm py-1 px-2">
                    {plan.type === 'no_equipment' ? 
                        <Zap className="mr-1.5 h-3 w-3 md:h-4 md:w-4" /> : 
                        <Dumbbell className="mr-1.5 h-3 w-3 md:h-4 md:w-4" /> }
                    {plan.type.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs md:text-sm py-1 px-2">
                    <Clock className="mr-1.5 h-3 w-3 md:h-4 md:w-4" />
                    {plan.duration}
                </Badge>
            </div>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto px-4 md:px-6 py-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Exercises</h3>
            <p className="text-xs text-muted-foreground mb-4">Enter weight and reps for exercises you performed. Leave blank if not performed or not tracking.</p>
            <ul className="space-y-4">
              {plan.exercises.map((exercise) => (
                <li key={exercise.id} className="p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow">
                  <h4 className="font-semibold text-md md:text-lg">{exercise.name}</h4>
                  <div className="text-xs md:text-sm text-muted-foreground mt-0.5 mb-2 space-x-3">
                    <span>Target Sets: {exercise.sets}</span>
                    <span>Target Reps: {exercise.reps}</span>
                    {exercise.restTime && <span>Rest: {exercise.restTime}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <FormItem>
                      <Label htmlFor={`weight-${exercise.id}`} className="text-xs">Weight (kg)</Label>
                      <Input
                        id={`weight-${exercise.id}`}
                        type="number"
                        placeholder="e.g., 50"
                        value={sessionInputs[exercise.id]?.weightKg || ''}
                        onChange={(e) => handleInputChange(exercise.id, 'weightKg', e.target.value)}
                        className="h-9 text-sm"
                        step="0.1"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor={`reps-${exercise.id}`} className="text-xs">Reps Performed</Label>
                      <Input
                        id={`reps-${exercise.id}`}
                        type="number"
                        placeholder="e.g., 10"
                        value={sessionInputs[exercise.id]?.reps || ''}
                        onChange={(e) => handleInputChange(exercise.id, 'reps', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </FormItem>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 md:p-6 pt-4 border-t flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Close
            </Button>
            <Button onClick={handleLogSession} className="w-full sm:w-auto" disabled={isLogging}>
                {isLogging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckSquare className="mr-2 h-4 w-4" />}
                Log Workout Session
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper FormItem component if not using react-hook-form's FormField here
// For simplicity, direct Label and Input are used above.
const FormItem: React.FC<{children: ReactNode, className?: string}> = ({children, className}) => (
  <div className={cn("space-y-1", className)}>{children}</div>
);
FormItem.displayName = "FormItem";
