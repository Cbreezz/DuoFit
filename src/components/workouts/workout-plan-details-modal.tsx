
"use client";

import type { ReactNode } from 'react'; // Import ReactNode
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter, // Added DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkoutPlan } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Zap, ListChecks, X, CheckSquare, Square } from "lucide-react"; // Added CheckSquare, Square
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { Label } from "@/components/ui/label"; // Added Label
import { useToast } from "@/hooks/use-toast"; // Added useToast

interface WorkoutPlanDetailsModalProps {
  plan: WorkoutPlan;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkoutPlanDetailsModal({ plan, isOpen, onOpenChange }: WorkoutPlanDetailsModalProps) {
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  if (!plan) return null;

  const handleCheckboxChange = (exerciseId: string, checked: boolean | "indeterminate") => {
    setCheckedExercises(prev => ({
      ...prev,
      [exerciseId]: !!checked, // Ensure boolean
    }));
  };

  const handleLogCheckedExercises = () => {
    const loggedExerciseNames = plan.exercises
      .filter(ex => checkedExercises[ex.id])
      .map(ex => ex.name);

    if (loggedExerciseNames.length === 0) {
      toast({
        title: "No Exercises Selected",
        description: "Please check off some exercises to log.",
        variant: "default",
      });
      return;
    }

    toast({
      title: "Exercises Logged (Simulated)",
      description: `You've logged: ${loggedExerciseNames.join(', ')}. Great work!`,
    });
    // In a real app, call API to save these checkedExercises
    // Potentially close modal or reset checkboxes after logging
    // setCheckedExercises({}); // Option to reset
    // onOpenChange(false); // Option to close
  };

  // Reset checked state when modal opens with a new plan (or reopens)
  // This might be too aggressive if user reopens to modify.
  // Consider if reset is needed or if state should persist while modal is for same plan.
  // For now, let's not reset on open to allow modifications.
  // React.useEffect(() => {
  //   if (isOpen) {
  //     setCheckedExercises({});
  //   }
  // }, [isOpen, plan.id]);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setCheckedExercises({}); // Reset checkboxes when modal is closed
    }}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[600px] p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 md:p-6 pb-0">
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
        
        <ScrollArea className="flex-grow overflow-y-auto px-4 md:px-6">
          <div className="mt-4 md:mt-6">
            <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Exercises</h3>
            <ul className="space-y-3">
              {plan.exercises.map((exercise) => (
                <li key={exercise.id} className="p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow flex items-center space-x-3">
                  <Checkbox 
                    id={`exercise-${exercise.id}`} 
                    checked={checkedExercises[exercise.id] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(exercise.id, checked)}
                    aria-labelledby={`exercise-label-${exercise.id}`}
                  />
                  <Label htmlFor={`exercise-${exercise.id}`} id={`exercise-label-${exercise.id}`} className="flex-grow cursor-pointer">
                    <h4 className="font-semibold text-sm md:text-md">{exercise.name}</h4>
                    <div className="text-xs md:text-sm text-muted-foreground mt-0.5 space-x-3">
                      <span>Sets: {exercise.sets}</span>
                      <span>Reps: {exercise.reps}</span>
                      {exercise.restTime && <span>Rest: {exercise.restTime}</span>}
                    </div>
                  </Label>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 md:p-6 pt-4 border-t flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Close
            </Button>
            <Button onClick={handleLogCheckedExercises} className="w-full sm:w-auto">
                <CheckSquare className="mr-2 h-4 w-4" />
                Log Checked Exercises
            </Button>
        </DialogFooter>

        {/* Original close button is part of DialogContent by default, no need for this explicit one if footer is used */}
        {/* <DialogClose asChild className="absolute right-4 top-4">
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
        </DialogClose> */}
      </DialogContent>
    </Dialog>
  );
}
