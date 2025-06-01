'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, name, description, exercises } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        userId,
        name,
        description,
        exercises: {
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
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}
