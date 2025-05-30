
import type { User as FirebaseUser } from "firebase/auth";

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  goal?: 'lose_weight' | 'gain_mass';
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
  imageUrl?: string; // Made optional
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

// Mock API response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Mock user data structure from backend
export interface BackendUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  goal: FitnessGoal | null;
  // other profile fields
}
