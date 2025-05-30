
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FitnessGoal, BackendUser } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Target, Ruler } from "lucide-react";

const profileSchema = z.object({
  goal: z.enum(["lose_weight", "gain_mass"], {
    required_error: "You need to select a fitness goal.",
  }),
  heightM: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val))),
    z.number().positive({ message: "Height must be a positive number." }).optional()
  ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface GoalSelectionFormProps {
  currentUser: BackendUser | null;
  onProfileUpdated: (updatedProfile: Partial<BackendUser>) => void;
}

export function GoalSelectionForm({ currentUser, onProfileUpdated }: GoalSelectionFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      goal: currentUser?.goal || undefined,
      heightM: currentUser?.heightM || undefined,
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({ 
        goal: currentUser.goal || undefined,
        heightM: currentUser.heightM || undefined,
      });
    }
  }, [currentUser, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const updatedProfileData: Partial<BackendUser> = { 
        goal: values.goal as FitnessGoal,
      };
      if (values.heightM) {
        updatedProfileData.heightM = values.heightM;
      }

      await api.updateUserProfile(user.uid, updatedProfileData);
      
      let toastDescription = `Your fitness goal has been set to ${values.goal === 'lose_weight' ? 'Lose Weight' : 'Gain Mass'}.`;
      if (values.heightM) {
        toastDescription += ` Your height is set to ${values.heightM}m.`;
      }
      toast({
        title: "Profile Updated!",
        description: toastDescription,
      });
      onProfileUpdated(updatedProfileData);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader className="text-center">
        <Target className="mx-auto h-10 w-10 md:h-12 md:w-12 text-primary mb-2" />
        <CardTitle className="text-xl md:text-2xl">Your Fitness Profile</CardTitle>
        <CardDescription>
          Select your primary goal and enter your height for BMI calculation.
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
                  <FormLabel className="text-base md:text-lg font-semibold text-center block">Fitness Goal</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 items-center justify-center"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 w-full md:w-auto">
                        <FormControl>
                          <RadioGroupItem value="lose_weight" id="lose_weight" />
                        </FormControl>
                        <FormLabel htmlFor="lose_weight" className="font-semibold text-sm md:text-base p-3 border rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex-1 text-center min-w-[150px]">
                          Lose Weight
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 w-full md:w-auto">
                        <FormControl>
                          <RadioGroupItem value="gain_mass" id="gain_mass" />
                        </FormControl>
                        <FormLabel htmlFor="gain_mass" className="font-semibold text-sm md:text-base p-3 border rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex-1 text-center min-w-[150px]">
                          Gain Mass
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heightM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="heightM" className="text-base md:text-lg font-semibold flex items-center">
                    <Ruler className="mr-2 h-5 w-5 text-primary" /> Height (meters)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      id="heightM"
                      type="number" 
                      placeholder="e.g., 1.75" 
                      {...field} 
                      step="0.01"
                      onChange={event => field.onChange(event.target.value === '' ? undefined : parseFloat(event.target.value))}
                      value={field.value ?? ''} 
                    />
                  </FormControl>
                  <FormDescription>
                    Used for calculating your BMI.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentUser?.goal || currentUser?.heightM ? 'Update Profile' : 'Set Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
