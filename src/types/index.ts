
import type { User as FirebaseUser } from "firebase/auth";

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
  sets: number;
  reps: string; // e.g., "8-12" or "15"
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
  imageUrl?: string;
  tags?: string[];
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

// Mock API response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}


// --- AI Workout Generation Types ---
export type AIWorkoutEquipmentPreference = "none" | "basic_dumbbells_kettlebells" | "full_gym";
export type AIWorkoutIntensity = "low" | "medium" | "high";

export interface GenerateWorkoutInput {
  durationMinutes: number;
  goal: FitnessGoal;
  equipment: AIWorkoutEquipmentPreference;
  muscleFocus: string;
  intensity?: AIWorkoutIntensity;
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
  specificRequests?: string;
}
