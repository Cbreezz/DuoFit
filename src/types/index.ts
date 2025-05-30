
import type { User as FirebaseUser } from "firebase/auth";
import { z } from "zod"; // Added Zod import

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  goal?: 'lose_weight' | 'gain_mass';
  heightM?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: string; // e.g., "3", "3-4", "AMRAP" - This is the target sets
  reps: string; // e.g., "8-12" or "15" - This is the target reps
  restTime?: string; // e.g., "60s"
}

export type WorkoutEquipmentType = 'with_equipment' | 'no_equipment';
export type FitnessGoal = 'lose_weight' | 'gain_mass';

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  goal: FitnessGoal;
  type: WorkoutEquipmentType;
  duration: string; // e.g., "4 weeks", "60 minutes"
  exercises: WorkoutExercise[];
  tags?: string[];
  isCustom?: boolean;
  createdByUserId?: string;
}

export interface CompletedWorkout {
  id: string;
  userId: string;
  workoutPlanId: string;
  dateCompleted: string; // ISO Date string
  notes?: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  date: string; // ISO Date string
  weightKg: number;
  bmi?: number; // Calculated or logged
}

export interface BackendUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  goal: FitnessGoal | null;
  heightM?: number;
}

// --- PR Tracking & Detailed Logging Types ---
export interface LoggedExercisePerformance {
  id: string;
  userId: string;
  exerciseId: string; // Corresponds to WorkoutExercise.id from the plan
  exerciseName: string;
  workoutPlanId?: string; // Optional: if logged as part of a specific plan
  dateLogged: string; // ISO Date string "YYYY-MM-DD"
  weightKg: number;
  reps: number;
  // We could add sets here, e.g. setsPerformed: number, but for PR tracking usually one best set is logged.
  // For simplicity, we assume the logged weight/reps are for the primary tracked set.
  isNewPR?: boolean; // To indicate if this performance set a new PR
}

export interface PersonalRecord {
  id: string; // Could be composite like `userId_exerciseId` or `userId_exerciseNameNormalized`
  userId: string;
  exerciseId: string; // Refers to the WorkoutExercise.id for consistency
  exerciseName: string; // Denormalized for easier display
  bestWeightKg: number;
  repsAtBestWeight: number;
  dateAchieved: string; // ISO Date string "YYYY-MM-DD"
  previousBestWeightKg?: number; // For comparison if needed
  previousRepsAtBestWeight?: number;
}


// Mock API response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}


// --- AI Workout Generation Types ---
export type AIWorkoutEquipmentPreference = "none" | "basic_dumbbells_kettlebells" | "full_gym";
export type AIWorkoutIntensity = "low" | "medium" | "high";
export type AIGender = "male" | "female" | "prefer_not_to_say";

export interface GenerateWorkoutInput {
  durationMinutes: number;
  goal: FitnessGoal;
  equipment: AIWorkoutEquipmentPreference;
  muscleFocus: string;
  intensity?: AIWorkoutIntensity;
  gender?: AIGender;
  specificRequests?: string;
}

export interface AIGeneratedExercise {
  name: string;
  sets: string; // e.g., "3", "3-4"
  reps: string; // e.g., "8-12", "AMRAP", "30 seconds"
  restTime?: string; // e.g., "60s", "None if circuit"
}

export interface AIGeneratedWorkoutPlan {
  name: string;
  description: string;
  estimatedDuration: string; // e.g., "Approx. 45 minutes"
  goal: FitnessGoal;
  equipmentUsed: AIWorkoutEquipmentPreference;
  muscleFocus: string;
  exercises: AIGeneratedExercise[];
  notes?: string; // Additional tips, warm-up/cool-down
}

// For form validation, compatible with GenerateWorkoutInput
export interface AIWorkoutFormValues {
  durationMinutes: number;
  goal: FitnessGoal;
  equipment: AIWorkoutEquipmentPreference;
  muscleFocus: string;
  intensity: AIWorkoutIntensity | "any"; // "any" for optional in form
  gender: AIGender | "any_gender";
  specificRequests?: string;
}

// --- Custom Workout Creation Form Types ---
export const customExerciseSchema = z.object({
  name: z.string().min(3, "Exercise name must be at least 3 characters.").max(100),
  sets: z.string().min(1, "Sets are required.").max(20), // e.g., "3", "3-4", "AMRAP"
  reps: z.string().min(1, "Reps are required.").max(50), // e.g., "8-12", "15", "30s"
  restTime: z.string().max(50).optional(), // e.g., "60s", "None"
});

export const createWorkoutFormSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(300),
  goal: z.enum(['lose_weight', 'gain_mass'] as [FitnessGoal, ...FitnessGoal[]], {
    required_error: "You need to select a fitness goal.",
  }),
  type: z.enum(['no_equipment', 'with_equipment'] as [WorkoutEquipmentType, ...WorkoutEquipmentType[]], {
    required_error: "You need to select an equipment type.",
  }),
  duration: z.string().min(3, "Duration is required, e.g., '45 minutes', '1 hour'").max(50),
  exercises: z.array(customExerciseSchema).min(1, "Add at least one exercise."),
});

export type CreateWorkoutFormValues = z.infer<typeof createWorkoutFormSchema>;
export type CustomExerciseFormValues = z.infer<typeof customExerciseSchema>;
