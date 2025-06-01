'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { workoutId, name, description, exercises } = await request.json();

    if (!workoutId) {
      return NextResponse.json(
        { error: 'workoutId is required' },
        { status: 400 }
      );
    }

    // Update workout
    const workout = await prisma.workout.update({
      where: { id: workoutId },
      data: {
        name,
        description,
        exercises: {
          deleteMany: {},
          create: exercises.map((exercise: {
            name: string;
            sets: number;
            reps: number;
            weight?: number;
            notes?: string;
          }) => ({
            ...exercise,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}
