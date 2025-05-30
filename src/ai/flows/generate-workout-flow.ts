
'use server';
/**
 * @fileOverview AI flow for generating custom workout plans.
 *
 * - generateWorkoutPlan - A function to generate a workout plan based on user preferences.
 * - GenerateWorkoutInput - The input type for the generateWorkoutPlan function.
 * - AIGeneratedWorkoutPlan (imported from @/types) - The return type for the generateWorkoutPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { FitnessGoal, AIWorkoutEquipmentPreference, AIWorkoutIntensity, AIGeneratedWorkoutPlan } from '@/types';

// Schemas for Zod validation and AI model guidance

// Input Schema
const GenerateWorkoutInputSchema = z.object({
  durationMinutes: z
    .number()
    .min(10, "Duration must be at least 10 minutes.")
    .max(120, "Duration must be at most 120 minutes.")
    .describe('Desired workout duration in minutes.'),
  goal: z.enum(['lose_weight', 'gain_mass'] as [FitnessGoal, ...FitnessGoal[]])
    .describe('The primary fitness goal (lose_weight or gain_mass).'),
  equipment: z.enum(['none', 'basic_dumbbells_kettlebells', 'full_gym'] as [AIWorkoutEquipmentPreference, ...AIWorkoutEquipmentPreference[]])
    .describe('Available equipment (none, basic_dumbbells_kettlebells, or full_gym).'),
  muscleFocus: z
    .string()
    .min(3, "Please specify muscle focus.")
    .describe('Primary muscle groups or area of focus (e.g., "Full body", "Upper body", "Legs and Glutes", "Core strength").'),
  intensity: z.enum(['low', 'medium', 'high'] as [AIWorkoutIntensity, ...AIWorkoutIntensity[]])
    .optional()
    .describe('Desired intensity level (low, medium, or high). Default to medium if not specified.'),
  specificRequests: z
    .string()
    .optional()
    .describe('Any other specific requests, like exercises to include/exclude, or areas to emphasize/avoid.'),
});
export type GenerateWorkoutInput = z.infer<typeof GenerateWorkoutInputSchema>;


// Output Schema for AI (AIGeneratedWorkoutPlan)
const AIGeneratedExerciseSchema = z.object({
  name: z.string().describe('Name of the exercise.'),
  sets: z.string().describe("Number of sets, e.g., '3', '3-4', 'As prescribed'."),
  reps: z.string().describe("Number of repetitions or duration, e.g., '8-12', '15', '30 seconds', 'AMRAP'."),
  restTime: z.string().optional().describe("Rest time between sets, e.g., '60s', 'None if circuit', 'As needed'."),
});

const GenerateWorkoutOutputSchema = z.object({
  name: z.string().describe("A catchy and descriptive name for the workout plan, ideally under 10 words."),
  description: z.string().describe("A brief, engaging overview of the workout plan, highlighting its benefits (1-2 sentences)."),
  estimatedDuration: z.string().describe("Estimated total time to complete the workout, including warm-up and cool-down if suggested, e.g., 'Approx. 45 minutes', '30-40 minutes'."),
  goal: z.enum(['lose_weight', 'gain_mass'] as [FitnessGoal, ...FitnessGoal[]])
    .describe("The primary fitness goal this workout targets, consistent with the input goal."),
  equipmentUsed: z.enum(['none', 'basic_dumbbells_kettlebells', 'full_gym'] as [AIWorkoutEquipmentPreference, ...AIWorkoutEquipmentPreference[]])
    .describe("The type of equipment assumed for this workout, consistent with the input equipment level."),
  muscleFocus: z.string().describe("The primary muscle groups or focus of this workout, reflecting the user's input."),
  exercises: z.array(AIGeneratedExerciseSchema).min(3,"Include at least 3 exercises.").describe("A list of exercises. Ensure exercises are appropriate for the specified equipment and goal."),
  notes: z.string().optional().describe("Optional: Include a brief warm-up (2-3 general dynamic stretches) and cool-down (2-3 static stretches) suggestion, or other general tips for the workout. Keep this concise."),
});
// This type is already defined in @/types as AIGeneratedWorkoutPlan, but Zod schema is needed here.
// We ensure it's compatible.

// Define the prompt
const workoutPrompt = ai.definePrompt({
  name: 'generateWorkoutPrompt',
  input: { schema: GenerateWorkoutInputSchema },
  output: { schema: GenerateWorkoutOutputSchema },
  prompt: `You are an expert fitness coach and workout planner.
Generate a personalized workout plan based on the following user preferences.
Ensure the workout is safe, effective, and tailored to the user's inputs.
Return the output ONLY in the specified JSON format.

User Preferences:
- Duration: {{durationMinutes}} minutes
- Primary Goal: {{goal}}
- Equipment Available: {{equipment}}
- Muscle Focus: {{{muscleFocus}}}
{{#if intensity}}
- Desired Intensity: {{intensity}}
{{else}}
- Desired Intensity: Medium (default)
{{/if}}
{{#if specificRequests}}
- Specific Requests: {{{specificRequests}}}
{{/if}}

Workout Plan Details to Generate:
- Name: A catchy and descriptive name.
- Description: A brief overview.
- Estimated Duration: Total time including warm-up/cool-down.
- Goal Alignment: Confirm the workout goal matches the input.
- Equipment Used: Confirm equipment matches input.
- Muscle Focus: Confirm muscle focus matches input.
- Exercises: A list of exercises with name, sets, reps, and optional rest time. Exercises should be appropriate for the equipment and goal. Provide at least 3 exercises.
- Notes: Suggest a brief warm-up and cool-down, or other relevant tips.

Structure your response strictly according to the JSON output schema.
`,
});

// Define the flow
const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutInputSchema,
    outputSchema: GenerateWorkoutOutputSchema,
  },
  async (input) => {
    const { output } = await workoutPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate a workout plan.');
    }
    return output;
  }
);

// Exported wrapper function for use in server actions/components
export async function generateWorkoutPlan(input: GenerateWorkoutInput): Promise<AIGeneratedWorkoutPlan> {
  // Validate input with Zod before calling the flow, if an extra layer is desired,
  // though defineFlow already does this.
  // const validatedInput = GenerateWorkoutInputSchema.parse(input);
  const result = await generateWorkoutPlanFlow(input);
  return result;
}
