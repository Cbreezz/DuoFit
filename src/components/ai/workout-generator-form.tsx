
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, AlertTriangle, Wand2, User } from "lucide-react"; // Added User icon
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-flow";
import type { GenerateWorkoutInput, AIGeneratedWorkoutPlan, FitnessGoal, AIWorkoutEquipmentPreference, AIWorkoutIntensity, AIGender, AIWorkoutFormValues } from "@/types";

const workoutFormSchema = z.object({
  durationMinutes: z.coerce.number()
    .min(10, "Min 10 minutes")
    .max(120, "Max 120 minutes"),
  goal: z.enum(['lose_weight', 'gain_mass'] as [FitnessGoal, ...FitnessGoal[]]),
  equipment: z.enum(['none', 'basic_dumbbells_kettlebells', 'full_gym'] as [AIWorkoutEquipmentPreference, ...AIWorkoutEquipmentPreference[]]),
  muscleFocus: z.string().min(3, "Describe muscle focus, e.g., 'Full body'").max(100),
  intensity: z.enum(['any', 'low', 'medium', 'high'] as [AIWorkoutIntensity | 'any', ...(AIWorkoutIntensity | 'any')[]]),
  gender: z.enum(['any_gender', 'male', 'female', 'prefer_not_to_say'] as [AIGender | 'any_gender', ...(AIGender | 'any_gender')[]]),
  specificRequests: z.string().max(300).optional(),
});


export function WorkoutGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedWorkoutPlan | null>(null);

  const form = useForm<AIWorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      durationMinutes: 30,
      goal: "lose_weight",
      equipment: "none",
      muscleFocus: "Full body",
      intensity: "medium",
      gender: "any_gender",
      specificRequests: "",
    },
  });

  async function onSubmit(values: AIWorkoutFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);

    const inputForAI: GenerateWorkoutInput = {
      ...values,
      intensity: values.intensity === "any" ? undefined : values.intensity,
      gender: values.gender === "any_gender" ? undefined : values.gender as AIGender, // Cast as AIGender if not "any_gender"
    };

    try {
      const plan = await generateWorkoutPlan(inputForAI);
      setGeneratedPlan(plan);
    } catch (e) {
      console.error("Failed to generate workout plan:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Wand2 className="mr-2 h-7 w-7 text-primary" />
            AI Workout Generator
          </CardTitle>
          <CardDescription>
            Describe your ideal workout, and let AI craft a plan for you!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a goal" /></SelectTrigger>
                        </FormControl>
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
                  name="equipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Available</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None (Bodyweight)</SelectItem>
                          <SelectItem value="basic_dumbbells_kettlebells">Basic (Dumbbells/Kettlebells)</SelectItem>
                          <SelectItem value="full_gym">Full Gym Access</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select intensity" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">Any (AI Decides)</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="mr-1 h-4 w-4 text-muted-foreground"/> Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select gender (optional)" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any_gender">Any / AI Decides</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer Not to Say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="muscleFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Muscle Focus / Workout Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Full body, Upper body, HIIT, Cardio, Legs & Glutes" {...field} />
                    </FormControl>
                     <FormDescription>Describe the main focus or type of workout.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specificRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Requests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Include squats, avoid jumping, focus on quick transitions..." {...field} />
                    </FormControl>
                    <FormDescription>Any exercises to include/exclude, or other preferences.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Workout
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">AI is crafting your workout... hang tight!</p>
        </div>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Generation Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
            <Button variant="outline" onClick={() => setError(null)} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {generatedPlan && !isLoading && (
        <Card className="shadow-xl mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{generatedPlan.name}</CardTitle>
            <CardDescription>{generatedPlan.description}</CardDescription>
            <div className="text-sm text-muted-foreground pt-2 space-x-4">
                <span><strong>Goal:</strong> <span className="capitalize">{generatedPlan.goal.replace('_', ' ')}</span></span>
                <span><strong>Equipment:</strong> <span className="capitalize">{generatedPlan.equipmentUsed.replace(/_/g, ' ')}</span></span>
                <span><strong>Focus:</strong> {generatedPlan.muscleFocus}</span>
                <span><strong>Duration:</strong> {generatedPlan.estimatedDuration}</span>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-3 mt-4">Exercises:</h3>
            <ul className="space-y-4">
              {generatedPlan.exercises.map((ex, index) => (
                <li key={index} className="p-4 border rounded-lg bg-background/50">
                  <h4 className="font-semibold text-lg">{ex.name}</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span>Sets: {ex.sets}</span> | <span>Reps: {ex.reps}</span>
                    {ex.restTime && <span> | Rest: {ex.restTime}</span>}
                  </div>
                </li>
              ))}
            </ul>
            {generatedPlan.notes && (
              <>
                <h3 className="text-xl font-semibold mb-2 mt-6">Coach's Notes:</h3>
                <p className="text-muted-foreground whitespace-pre-line">{generatedPlan.notes}</p>
              </>
            )}
          </CardContent>
          {/* <CardFooter>
            <Button className="w-full md:w-auto">
              Save this Workout (Future Feature)
            </Button>
          </CardFooter> */}
        </Card>
      )}
    </div>
  );
}

