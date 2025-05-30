
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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Target } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const logSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  weightKg: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive({ message: "Weight must be a positive number." })
  ),
  // Optional: height in meters for BMI calculation. This might be better stored in user profile.
  // For this logger, we'll assume height is known or BMI is calculated elsewhere if needed.
  // heightM: z.preprocess(
  //   (val) => val ? parseFloat(String(val)) : undefined,
  //   z.number().positive({ message: "Height must be a positive number." }).optional()
  // ),
});

type LogFormValues = z.infer<typeof logSchema>;

interface WeightBmiLoggerProps {
  onLogAdded: () => void; // Callback to refresh chart/data
  userHeightM?: number; // Pass user's height in meters if available for BMI calculation
}

export function WeightBmiLogger({ onLogAdded, userHeightM }: WeightBmiLoggerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      date: new Date(),
      weightKg: undefined, // Use undefined for placeholder
    },
  });

  async function onSubmit(values: LogFormValues) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await api.logWeight(
        user.uid, 
        values.weightKg, 
        format(values.date, "yyyy-MM-dd"),
        userHeightM // Pass height if available
      );
      toast({
        title: "Progress Logged!",
        description: `Weight of ${values.weightKg}kg logged for ${format(values.date, "PPP")}.`,
      });
      form.reset({ date: new Date(), weightKg: undefined });
      onLogAdded();
    } catch (error) {
      console.error("Failed to log progress:", error);
      toast({
        title: "Logging Failed",
        description: "Could not log your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl">Log Your Progress</CardTitle>
        <CardDescription>
          Keep track of your weight. Consistent logging helps visualize your journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 70.5" {...field} step="0.1" 
                     onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)}
                     value={field.value ?? ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Optional height input if not stored in profile - for simplicity, assume BMI calc done with profile height */}
            {/* {userHeightM === undefined && (
              <FormField
                control={form.control}
                name="heightM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (m) - for BMI (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1.75" {...field} step="0.01" 
                       onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)}
                       value={field.value ?? ''} 
                      />
                    </FormControl>
                    <FormDescription>Needed if you want BMI calculated now.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}


            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log Progress
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

