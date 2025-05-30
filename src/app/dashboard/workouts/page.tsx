
"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { WorkoutPlanCard } from "@/components/workouts/workout-plan-card";
import { WorkoutFilters } from "@/components/workouts/workout-filters";
import { WorkoutPlanDetailsModal } from "@/components/workouts/workout-plan-details-modal";
import type { WorkoutPlan, FitnessGoal, WorkoutEquipmentType } from "@/types";
import { api } from "@/lib/api";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Routes } from "@/config/routes";

// Define a new component that uses useSearchParams
function WorkoutsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planIdFromQuery = searchParams.get('planId');

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [goalFilter, setGoalFilter] = useState<FitnessGoal | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<WorkoutEquipmentType | undefined>(undefined);
  
  const fetchWorkoutPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: { goal?: FitnessGoal, type?: WorkoutEquipmentType } = {};
      if (goalFilter && goalFilter !== "all_goals" as any) filters.goal = goalFilter;
      if (typeFilter && typeFilter !== "all_types" as any) filters.type = typeFilter;
      
      const plans = await api.getWorkoutPlans(filters);
      setWorkoutPlans(plans);
    } catch (error) {
      console.error("Failed to fetch workout plans:", error);
    } finally {
      setIsLoading(false);
    }
  }, [goalFilter, typeFilter]);

  useEffect(() => {
    fetchWorkoutPlans();
  }, [fetchWorkoutPlans]);

  useEffect(() => {
    if (planIdFromQuery) {
      const plan = workoutPlans.find(p => p.id === planIdFromQuery) || null;
      // If plans are not loaded yet, fetch the specific plan
      if(!plan && workoutPlans.length === 0 && !isLoading) {
        api.getWorkoutPlanById(planIdFromQuery).then(p => {
          if(p) {
            setSelectedPlan(p);
            setIsModalOpen(true);
          }
        });
      } else if(plan) {
        setSelectedPlan(plan);
        setIsModalOpen(true);
      }
    } else {
      setSelectedPlan(null);
      setIsModalOpen(false);
    }
  }, [planIdFromQuery, workoutPlans, isLoading]);

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Remove planId from URL query params when modal closes
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete('planId');
      const query = current.toString() ? `?${current.toString()}` : '';
      router.replace(`${Routes.workouts}${query}`);
    }
  };
  
  const handleClearFilters = () => {
    setGoalFilter(undefined);
    setTypeFilter(undefined);
    // No need to call fetchWorkoutPlans here, useEffect will trigger it.
  };

  return (
    <div className="container mx-auto"> {/* Removed responsive padding here, handled by layout */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">Discover Workout Plans</h1>
      <p className="text-muted-foreground mb-6 md:mb-8">Find the perfect plan to match your fitness goals and equipment availability.</p>

      <WorkoutFilters 
        currentGoal={goalFilter}
        currentType={typeFilter}
        onGoalChange={(g) => setGoalFilter(g === "all_goals" as any ? undefined : g)}
        onTypeChange={(t) => setTypeFilter(t === "all_types" as any ? undefined : t)}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : workoutPlans.length === 0 ? (
        <div className="text-center py-10">
          <Info className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Workout Plans Found</h2>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or check back later for new plans.
          </p>
          <Button onClick={handleClearFilters}>Clear Filters and Retry</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {workoutPlans.map((plan) => (
            <WorkoutPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      {selectedPlan && (
        <WorkoutPlanDetailsModal 
          plan={selectedPlan} 
          isOpen={isModalOpen}
          onOpenChange={handleModalOpenChange}
        />
      )}
    </div>
  );
}


export default function WorkoutsPage() {
  return (
    // Suspense is required for useSearchParams in child components
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <WorkoutsContent />
    </Suspense>
  );
}
