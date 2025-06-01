export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restTime?: string;
}

export interface SessionInput {
  weightKg?: string;
  reps?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutSession {
  id: string;
  planId: string;
  date: Date;
  exercises: {
    [exerciseId: string]: {
      weightKg: number;
      reps: number;
    };
  };
}

export interface WorkoutSessionInput {
  [exerciseId: string]: {
    weightKg: string;
    reps: string;
  };
}
