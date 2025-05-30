"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FitnessGoal } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Target } from "lucide-react";

const goalSchema = z.object({
  goal: z.enum(["lose_weight", "gain_mass"], {
    required_error: "You need to select a fitness goal.",
  }),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalSelectionFormProps {
  currentGoal: FitnessGoal | null | undefined; // Undefined while loading
  onGoalUpdated: (newGoal: FitnessGoal) => void;
}

export function GoalSelectionForm({ currentGoal, onGoalUpdated }: GoalSelectionFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal: currentGoal || undefined,
    },
  });

  useEffect(() => {
    if (currentGoal) {
      form.reset({ goal: currentGoal });
    }
  }, [currentGoal, form]);

  async function onSubmit(values: GoalFormValues) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      // Assume user.uid can be used as userId for the backend call
      await api.updateUserGoal(user.uid, values.goal as FitnessGoal);
      toast({
        title: "Goal Updated!",
        description: `Your fitness goal has been set to ${values.goal === 'lose_weight' ? 'Lose Weight' : 'Gain Mass'}.`,
      });
      onGoalUpdated(values.goal as FitnessGoal);
    } catch (error) {
      console.error("Failed to update goal:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader className="text-center">
        <Target className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-2xl">What&apos;s Your Fitness Goal?</CardTitle>
        <CardDescription>
          Select your primary goal. This will help us recommend suitable workout plans.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 items-center justify-center"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="lose_weight" id="lose_weight" />
                        </FormControl>
                        <FormLabel htmlFor="lose_weight" className="font-semibold text-lg p-4 border rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex-1 text-center min-w-[150px]">
                          Lose Weight
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gain_mass" id="gain_mass" />
                        </FormControl>
                        <FormLabel htmlFor="gain_mass" className="font-semibold text-lg p-4 border rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex-1 text-center min-w-[150px]">
                          Gain Mass
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentGoal ? 'Update Goal' : 'Set Goal'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
