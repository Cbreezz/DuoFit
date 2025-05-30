"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkoutPlan } from "@/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Barbell, Zap, Repeat, ShieldQuestion, ListChecks, X } from "lucide-react";
import { Button } from "../ui/button";

interface WorkoutPlanDetailsModalProps {
  plan: WorkoutPlan;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkoutPlanDetailsModal({ plan, isOpen, onOpenChange }: WorkoutPlanDetailsModalProps) {
  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[600px] p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-0">
          {plan.imageUrl && (
            <div className="relative h-60 w-full mb-4 rounded-t-lg overflow-hidden">
              <Image
                // @ts-ignore
                src={plan.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(plan.name)}`}
                alt={plan.name}
                layout="fill"
                objectFit="cover"
                // @ts-ignore
                data-ai-hint={plan['data-ai-hint'] || 'fitness exercise'}
              />
            </div>
          )}
          <DialogTitle className="text-2xl md:text-3xl font-bold">{plan.name}</DialogTitle>
          <DialogDescription className="text-base">{plan.description}</DialogDescription>
           <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="capitalize text-sm py-1 px-2">
                    {plan.goal.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="capitalize text-sm py-1 px-2">
                    {plan.type === 'no_equipment' ? 
                        <Zap className="mr-1.5 h-4 w-4" /> : 
                        <Barbell className="mr-1.5 h-4 w-4" /> }
                    {plan.type.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-sm py-1 px-2">
                    <Clock className="mr-1.5 h-4 w-4" />
                    {plan.duration}
                </Badge>
            </div>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto px-6 pb-6">
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Exercises</h3>
            <ul className="space-y-4">
              {plan.exercises.map((exercise) => (
                <li key={exercise.id} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-md">{exercise.name}</h4>
                  <div className="text-sm text-muted-foreground mt-1 space-x-3">
                    <span>Sets: {exercise.sets}</span>
                    <span>Reps: {exercise.reps}</span>
                    {exercise.restTime && <span>Rest: {exercise.restTime}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
        <DialogClose asChild className="absolute right-4 top-4">
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
