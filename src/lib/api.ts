
import type { WorkoutPlan, FitnessGoal, WeightLog, CompletedWorkout, BackendUser, WorkoutEquipmentType, AIGeneratedWorkoutPlan, WorkoutExercise, LoggedExercisePerformance, PersonalRecord } from '@/types';

// MOCK API - Replace with actual fetch calls to your backend

const MOCK_DELAY = 300; // Reduced delay for quicker UI feedback

let mockUser: BackendUser = {
  id: 'user123',
  firebaseUid: 'firebaseUser123',
  email: 'testuser@duofit.app',
  name: 'Alex Doe',
  goal: 'gain_mass',
  heightM: 1.75,
};

let mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'plan1',
    name: 'Full Body Blast (No Equipment)',
    description: 'A comprehensive full-body workout you can do anywhere, no equipment needed.',
    goal: 'lose_weight',
    type: 'no_equipment',
    duration: '45 minutes',
    exercises: [
      { id: 'ex1', name: 'Jumping Jacks', sets: "3", reps: '30-45 sec' },
      { id: 'ex2', name: 'Bodyweight Squats', sets: "3", reps: '15-20' },
      { id: 'ex3', name: 'Push-ups (or Knee Push-ups)', sets: "3", reps: 'AMRAP' },
      { id: 'ex4', name: 'Lunges (alternating legs)', sets: "3", reps: '10-12 per leg' },
      { id: 'ex5', name: 'Plank', sets: "3", reps: '30-60 sec' },
    ],
    tags: ['full body', 'cardio', 'strength'],
    isCustom: false,
  },
  {
    id: 'plan2',
    name: 'Strength Builder (With Equipment)',
    description: 'Build muscle and strength with this gym-based workout plan.',
    goal: 'gain_mass',
    type: 'with_equipment',
    duration: '60 minutes',
    exercises: [
      { id: 'ex6', name: 'Barbell Squats', sets: "4", reps: '8-10' },
      { id: 'ex7', name: 'Bench Press', sets: "4", reps: '8-10' },
      { id: 'ex8', name: 'Deadlifts', sets: "1", reps: '5' },
      { id: 'ex9', name: 'Overhead Press', sets: "3", reps: '10-12' },
      { id: 'ex10', name: 'Bent-over Rows', sets: "3", reps: '10-12' },
    ],
    tags: ['strength', 'muscle building', 'compound lifts'],
    isCustom: false,
  },
];

let mockCompletedWorkouts: CompletedWorkout[] = [
    { id: 'cw1', userId: 'user123', workoutPlanId: 'plan1', dateCompleted: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] },
    { id: 'cw2', userId: 'user123', workoutPlanId: 'plan2', dateCompleted: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] },
];
let mockWeightLogs: WeightLog[] = [
    { id: 'wl1', userId: 'user123', date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0], weightKg: 70, bmi: mockUser.heightM ? parseFloat((70 / (mockUser.heightM * mockUser.heightM)).toFixed(1)) : undefined },
    { id: 'wl2', userId: 'user123', date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0], weightKg: 69, bmi: mockUser.heightM ? parseFloat((69 / (mockUser.heightM * mockUser.heightM)).toFixed(1)) : undefined },
    { id: 'wl3', userId: 'user123', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], weightKg: 68.5, bmi: mockUser.heightM ? parseFloat((68.5 / (mockUser.heightM * mockUser.heightM)).toFixed(1)) : undefined },
];

let mockLoggedExercisePerformances: LoggedExercisePerformance[] = [];
let mockPersonalRecords: PersonalRecord[] = [
    // Example PR:
    // { id: 'user123_ex6', userId: 'user123', exerciseId: 'ex6', exerciseName: 'Barbell Squats', bestWeightKg: 100, repsAtBestWeight: 5, dateAchieved: '2024-01-15'},
];


// Simulate API calls
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), MOCK_DELAY)); // Deep clone to avoid mutation issues with mock data
};

export const api = {
  getUserProfile: async (firebaseUid: string): Promise<BackendUser | null> => {
    if (mockUser.firebaseUid === firebaseUid) {
      return simulateApiCall(mockUser);
    }
    const newUser: BackendUser = {
      id: `backend-${firebaseUid.substring(0,5)}`,
      firebaseUid,
      email: `user-${firebaseUid.substring(0,5)}@example.com`,
      name: `User ${firebaseUid.substring(0,5)}`,
      goal: null,
      heightM: undefined,
    };
    // In a real app, only one user would exist, but for mock, we update if different.
    // For true multi-user mock, this would need more complex state.
    // mockUser = newUser; 
    return simulateApiCall(newUser);
  },

  updateUserProfile: async (userId: string, profileData: Partial<Pick<BackendUser, 'goal' | 'heightM'>>): Promise<BackendUser> => {
    if (mockUser.id === userId || mockUser.firebaseUid === userId) {
        if (profileData.goal !== undefined) mockUser.goal = profileData.goal;
        if (profileData.heightM !== undefined) mockUser.heightM = profileData.heightM;
    }
    return simulateApiCall({ ...mockUser });
  },

  getWorkoutPlans: async (filters?: { goal?: FitnessGoal, type?: WorkoutEquipmentType }): Promise<WorkoutPlan[]> => {
    let plans = mockWorkoutPlans;
    if (filters?.goal) {
      plans = plans.filter(p => p.goal === filters.goal);
    }
    if (filters?.type) {
      plans = plans.filter(p => p.type === filters.type);
    }
    return simulateApiCall(plans);
  },

  getWorkoutPlanById: async (planId: string): Promise<WorkoutPlan | undefined> => {
    return simulateApiCall(mockWorkoutPlans.find(p => p.id === planId));
  },

  addWorkoutPlan: async (
    planData: Omit<WorkoutPlan, 'id' | 'exercises' | 'isCustom' | 'createdByUserId'> & { exercises: Omit<WorkoutExercise, 'id'>[] } & Partial<Pick<WorkoutPlan, 'tags'>>,
    isCustom: boolean = false,
    createdByUserId?: string
  ): Promise<WorkoutPlan> => {
    const newPlan: WorkoutPlan = {
      ...planData,
      id: `plan-${isCustom ? 'custom' : 'ai'}-${Date.now()}`,
      exercises: planData.exercises.map((ex, index) => ({
        ...ex,
        id: `ex-${isCustom ? 'custom' : 'ai'}-${Date.now()}-${index}`,
      })),
      tags: [...(planData.tags || []), ...(isCustom ? ['custom', createdByUserId || 'unknown-user'] : ['ai-generated'])],
      isCustom,
      createdByUserId,
    };
    mockWorkoutPlans.push(newPlan);
    return simulateApiCall(newPlan);
  },

  getTodaysWorkout: async (userId: string): Promise<WorkoutPlan | null> => {
    const userGoal = mockUser.goal; // Assuming mockUser is the current user for simplicity
    if (userGoal) {
      const plan = mockWorkoutPlans.find(p => p.goal === userGoal && !p.isCustom);
      if (plan) return simulateApiCall(plan);
    }
    const nonCustomPlans = mockWorkoutPlans.filter(p => !p.isCustom);
    return simulateApiCall(nonCustomPlans[0] || mockWorkoutPlans[0] || null);
  },

  markWorkoutAsCompleted: async (userId: string, workoutPlanId: string, date: string): Promise<CompletedWorkout> => {
    const newCompletedWorkout: CompletedWorkout = {
      id: `cw${Date.now()}`,
      userId,
      workoutPlanId,
      dateCompleted: date,
    };
    mockCompletedWorkouts.push(newCompletedWorkout);
    return simulateApiCall(newCompletedWorkout);
  },

  getCompletedWorkouts: async (userId: string): Promise<CompletedWorkout[]> => {
    return simulateApiCall(mockCompletedWorkouts.filter(cw => cw.userId === userId));
  },

  logWeight: async (userId: string, weightKg: number, date: string, heightM?: number): Promise<WeightLog> => {
    let bmi;
    const effectiveHeight = heightM ?? mockUser.heightM;
    if (effectiveHeight && effectiveHeight > 0) {
      bmi = parseFloat((weightKg / (effectiveHeight * effectiveHeight)).toFixed(1));
    }
    const newLog: WeightLog = {
      id: `wl${Date.now()}`,
      userId,
      date,
      weightKg,
      bmi,
    };
    mockWeightLogs.push(newLog);
    mockWeightLogs.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return simulateApiCall(newLog);
  },

  getWeightLogs: async (userId: string): Promise<WeightLog[]> => {
    return simulateApiCall(mockWeightLogs.filter(wl => wl.userId === userId).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  },

  // --- PR Tracking API Functions ---

  getPersonalRecord: async (userId: string, exerciseId: string): Promise<PersonalRecord | null> => {
    const pr = mockPersonalRecords.find(p => p.userId === userId && p.exerciseId === exerciseId);
    return simulateApiCall(pr || null);
  },

  updatePersonalRecord: async (userId: string, prData: Omit<PersonalRecord, 'id' | 'userId'>): Promise<PersonalRecord> => {
    let prIndex = mockPersonalRecords.findIndex(p => p.userId === userId && p.exerciseId === prData.exerciseId);
    const newPrEntry: PersonalRecord = {
      ...prData,
      id: `${userId}_${prData.exerciseId}`, // Consistent ID generation
      userId,
    };
    if (prIndex !== -1) {
      mockPersonalRecords[prIndex] = newPrEntry;
    } else {
      mockPersonalRecords.push(newPrEntry);
    }
    return simulateApiCall(newPrEntry);
  },

  logExercisePerformance: async (
    userId: string, 
    performanceData: Omit<LoggedExercisePerformance, 'id' | 'userId' | 'isNewPR'>
  ): Promise<LoggedExercisePerformance> => {
    const newPerformance: LoggedExercisePerformance = {
      ...performanceData,
      id: `lep-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      isNewPR: false, // Default to false
    };
    mockLoggedExercisePerformances.push(newPerformance);

    // Check for PR
    const currentPR = await api.getPersonalRecord(userId, performanceData.exerciseId);
    let isNewPR = false;

    if (!currentPR) {
      isNewPR = true; // First time logging this exercise is always a PR
    } else {
      // PR Logic: Higher weight at same or more reps OR more reps at same or higher weight
      if (performanceData.weightKg > currentPR.bestWeightKg && performanceData.reps >= currentPR.repsAtBestWeight) {
        isNewPR = true;
      } else if (performanceData.weightKg >= currentPR.bestWeightKg && performanceData.reps > currentPR.repsAtBestWeight) {
        isNewPR = true;
      }
    }

    if (isNewPR) {
      newPerformance.isNewPR = true;
      await api.updatePersonalRecord(userId, {
        exerciseId: performanceData.exerciseId,
        exerciseName: performanceData.exerciseName, // Ensure this is passed correctly
        bestWeightKg: performanceData.weightKg,
        repsAtBestWeight: performanceData.reps,
        dateAchieved: performanceData.dateLogged,
        previousBestWeightKg: currentPR?.bestWeightKg,
        previousRepsAtBestWeight: currentPR?.repsAtBestWeight,
      });
    }
    
    return simulateApiCall(newPerformance);
  },

  getExercisePerformances: async (userId: string, exerciseId?: string): Promise<LoggedExercisePerformance[]> => {
    let performances = mockLoggedExercisePerformances.filter(p => p.userId === userId);
    if (exerciseId) {
      performances = performances.filter(p => p.exerciseId === exerciseId);
    }
    performances.sort((a,b) => new Date(b.dateLogged).getTime() - new Date(a.dateLogged).getTime()); // Newest first
    return simulateApiCall(performances);
  }
};
