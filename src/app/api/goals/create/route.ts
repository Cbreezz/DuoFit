'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, title, description, targetDate } = await request.json();

    if (!userId || !title || !targetDate) {
      return NextResponse.json(
        { error: 'userId, title, and targetDate are required' },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description,
        targetDate: new Date(targetDate),
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
