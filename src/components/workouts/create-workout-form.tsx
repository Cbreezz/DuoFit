
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2, Save, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import type { CreateWorkoutFormValues, FitnessGoal, WorkoutEquipmentType } from "@/types";
import { createWorkoutFormSchema } from "@/types"; // Ensure schema is imported
import { Routes } from "@/config/routes";

export function CreateWorkoutForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CreateWorkoutFormValues>({
    resolver: zodResolver(createWorkoutFormSchema),
    defaultValues: {
      name: "",
      description: "",
      goal: undefined,
      type: undefined,
      duration: "",
      exercises: [{ name: "", sets: "", reps: "", restTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  async function onSubmit(values: CreateWorkoutFormValues) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create a plan.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const planToSave = {
        name: values.name,
        description: values.description,
        goal: values.goal,
        type: values.type,
        duration: values.duration,
        exercises: values.exercises.map(ex => ({ ...ex })), // Create new objects for exercises
        // tags: ['custom', user.uid] // Consider adding user-specific tags or other relevant tags
      };

      await api.addWorkoutPlan(planToSave, true, user.uid);
      toast({
        title: "Workout Plan Created!",
        description: `"${values.name}" has been saved.`,
      });
      router.push(Routes.workouts);
    } catch (e) {
      console.error("Failed to create workout plan:", e);
      toast({
        title: "Creation Failed",
        description: "Could not create the workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center text-xl md:text-2xl">
          <Dumbbell className="mr-2 h-7 w-7 text-primary" />
          Create Your Custom Workout Plan
        </CardTitle>
        <CardDescription>
          Design a workout tailored to your preferences. Add exercises, sets, reps, and rest times.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl><Input placeholder="e.g., My Awesome Leg Day" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe your workout plan..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a goal" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="lose_weight">Lose Weight</SelectItem>
                        <SelectItem value="gain_mass">Gain Mass</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select equipment type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="no_equipment">No Equipment</SelectItem>
                        <SelectItem value="with_equipment">With Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration</FormLabel>
                    <FormControl><Input placeholder="e.g., 45 minutes, 1 hour" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Exercises</h3>
              {fields.map((item, index) => (
                <Card key={item.id} className="mb-4 p-4 relative bg-background/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exercise Name</FormLabel>
                          <FormControl><Input placeholder="e.g., Squats" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.sets`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sets</FormLabel>
                          <FormControl><Input placeholder="e.g., 3 or 3-4" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.reps`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reps / Duration</FormLabel>
                          <FormControl><Input placeholder="e.g., 8-12 or 30s" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.restTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rest Time (Optional)</FormLabel>
                          <FormControl><Input placeholder="e.g., 60s or None" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                        onClick={() => remove(index)}
                        aria-label="Remove exercise"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                  )}
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", sets: "", reps: "", restTime: "" })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
              <FormMessage>{form.formState.errors.exercises?.root?.message || form.formState.errors.exercises?.message}</FormMessage>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Workout Plan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
