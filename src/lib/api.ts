
import type { WorkoutPlan, FitnessGoal, WeightLog, CompletedWorkout, BackendUser, WorkoutEquipmentType } from '@/types';

// MOCK API - Replace with actual fetch calls to your backend

const MOCK_DELAY = 500;

let mockUser: BackendUser = {
  id: 'user123',
  firebaseUid: 'firebaseUser123',
  email: 'testuser@duofit.app',
  name: 'Alex Doe',
  goal: null,
  heightM: undefined, // Initialize height
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
      { id: 'ex1', name: 'Jumping Jacks', sets: 3, reps: '30-45 sec' },
      { id: 'ex2', name: 'Bodyweight Squats', sets: 3, reps: '15-20' },
      { id: 'ex3', name: 'Push-ups (or Knee Push-ups)', sets: 3, reps: 'As many as possible (AMRAP)' },
      { id: 'ex4', name: 'Lunges (alternating legs)', sets: 3, reps: '10-12 per leg' },
      { id: 'ex5', name: 'Plank', sets: 3, reps: '30-60 sec' },
    ],
    tags: ['full body', 'cardio', 'strength']
  },
  {
    id: 'plan2',
    name: 'Strength Builder (With Equipment)',
    description: 'Build muscle and strength with this gym-based workout plan.',
    goal: 'gain_mass',
    type: 'with_equipment',
    duration: '60 minutes',
    exercises: [
      { id: 'ex6', name: 'Barbell Squats', sets: 4, reps: '8-10' },
      { id: 'ex7', name: 'Bench Press', sets: 4, reps: '8-10' },
      { id: 'ex8', name: 'Deadlifts', sets: 1, reps: '5' }, // Or 3 sets of 5-8 reps
      { id: 'ex9', name: 'Overhead Press', sets: 3, reps: '10-12' },
      { id: 'ex10', name: 'Bent-over Rows', sets: 3, reps: '10-12' },
    ],
    tags: ['strength', 'muscle building', 'compound lifts']
  },
  {
    id: 'plan3',
    name: 'Quick Cardio Burn (No Equipment)',
    description: 'Get your heart rate up with this quick and effective cardio session.',
    goal: 'lose_weight',
    type: 'no_equipment',
    duration: '20 minutes',
    exercises: [
        { id: 'ex11', name: 'High Knees', sets: 1, reps: '3 min' },
        { id: 'ex12', name: 'Burpees', sets: 5, reps: '10' },
        { id: 'ex13', name: 'Mountain Climbers', sets: 1, reps: '3 min' },
    ],
    tags: ['cardio', 'hiit', 'quick workout']
  },
  {
    id: 'plan4',
    name: 'Upper Body Sculpt (With Equipment)',
    description: 'Focus on sculpting your upper body muscles.',
    goal: 'gain_mass',
    type: 'with_equipment',
    duration: '50 minutes',
    exercises: [
        { id: 'ex14', name: 'Pull-ups / Lat Pulldowns', sets: 3, reps: 'AMRAP / 10-12' },
        { id: 'ex15', name: 'Dumbbell Bench Press', sets: 3, reps: '10-12' },
        { id: 'ex16', name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12' },
        { id: 'ex17', name: 'Bicep Curls', sets: 3, reps: '12-15' },
        { id: 'ex18', name: 'Tricep Dips / Pushdowns', sets: 3, reps: '12-15' },
    ],
    tags: ['upper body', 'sculpting', 'gym']
  },
];

let mockCompletedWorkouts: CompletedWorkout[] = [
    { id: 'cw1', userId: 'user123', workoutPlanId: 'plan1', dateCompleted: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] }, // 2 days ago
    { id: 'cw2', userId: 'user123', workoutPlanId: 'plan3', dateCompleted: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] }, // 5 days ago
];
let mockWeightLogs: WeightLog[] = [
    { id: 'wl1', userId: 'user123', date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0], weightKg: 70, bmi: mockUser.heightM ? parseFloat((70 / (mockUser.heightM * mockUser.heightM)).toFixed(1)) : undefined },
    { id: 'wl2', userId: 'user123', date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0], weightKg: 69, bmi: mockUser.heightM ? parseFloat((69 / (mockUser.heightM * mockUser.heightM)).toFixed(1)) : undefined },
    { id: 'wl3', userId: 'user123', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], weightKg: 68.5, bmi: mockUser.heightM ? parseFloat((68.5 / (mockUser.heightM * mockUser.heightM)).toFixed(1)) : undefined },
];

// Simulate API calls
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));
};

export const api = {
  getUserProfile: async (firebaseUid: string): Promise<BackendUser | null> => {
    // Simulate finding or creating a user profile
    if (mockUser.firebaseUid === firebaseUid) {
      return simulateApiCall(mockUser);
    }
    // For demo, if different firebaseUid, create/update mockUser
    const newUser: BackendUser = {
      id: `backend-${firebaseUid.substring(0,5)}`,
      firebaseUid,
      email: `user-${firebaseUid.substring(0,5)}@example.com`, // Generate some email
      name: `User ${firebaseUid.substring(0,5)}`, // Generate some name
      goal: null,
      heightM: undefined, 
    };
    mockUser = newUser; // In a real app, you'd fetch or create in DB
    return simulateApiCall(newUser);
  },

  updateUserProfile: async (userId: string, profileData: Partial<Pick<BackendUser, 'goal' | 'heightM'>>): Promise<BackendUser> => {
    // Assuming userId corresponds to mockUser.id for simplicity in mock
    if (mockUser.id === userId || mockUser.firebaseUid === userId) { // Allow update by firebaseUid too
        if (profileData.goal !== undefined) {
            mockUser.goal = profileData.goal;
        }
        if (profileData.heightM !== undefined) {
            mockUser.heightM = profileData.heightM;
        }
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

  getTodaysWorkout: async (userId: string): Promise<WorkoutPlan | null> => {
    const userGoal = mockUser.goal;
    if (userGoal) {
      const plan = mockWorkoutPlans.find(p => p.goal === userGoal);
      if (plan) return simulateApiCall(plan);
    }
    return simulateApiCall(mockWorkoutPlans[0] || null);
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
    const effectiveHeight = heightM ?? mockUser.heightM; // Use provided height, fallback to profile height
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
};

