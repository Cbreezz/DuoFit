"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FitnessGoal, WorkoutEquipmentType } from "@/types";
import { FilterX, SlidersHorizontal } from "lucide-react";

interface WorkoutFiltersProps {
  currentGoal?: FitnessGoal;
  currentType?: WorkoutEquipmentType;
  onGoalChange: (goal?: FitnessGoal) => void;
  onTypeChange: (type?: WorkoutEquipmentType) => void;
  onClearFilters: () => void;
}

export function WorkoutFilters({ 
  currentGoal, 
  currentType, 
  onGoalChange, 
  onTypeChange,
  onClearFilters
}: WorkoutFiltersProps) {
  return (
    <div className="mb-8 p-4 md:p-6 bg-card rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 min-w-[150px]">
          <Label htmlFor="goal-filter" className="mb-1 block text-sm font-medium">Filter by Goal</Label>
          <Select value={currentGoal} onValueChange={(value) => onGoalChange(value as FitnessGoal || undefined)}>
            <SelectTrigger id="goal-filter" className="w-full">
              <SelectValue placeholder="Any Goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_goals">Any Goal</SelectItem>
              <SelectItem value="lose_weight">Lose Weight</SelectItem>
              <SelectItem value="gain_mass">Gain Mass</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <Label htmlFor="type-filter" className="mb-1 block text-sm font-medium">Filter by Equipment</Label>
          <Select value={currentType} onValueChange={(value) => onTypeChange(value as WorkoutEquipmentType || undefined)}>
            <SelectTrigger id="type-filter" className="w-full">
              <SelectValue placeholder="Any Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">Any Equipment</SelectItem>
              <SelectItem value="no_equipment">No Equipment</SelectItem>
              <SelectItem value="with_equipment">With Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={onClearFilters} variant="outline" className="w-full md:w-auto">
            <FilterX className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      </div>
    </div>
  );
}
