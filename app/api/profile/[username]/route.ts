import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { ApiResponse, ProfileResponse } from '@/types/api';

// GET /api/profile/[username] - Get public profile
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username: rawUsername } = await params;
    const username = rawUsername.toLowerCase().replace('@', '');

    // Get user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      }, { status: 404 });
    }

    // Get user's questions
    const questions = await prisma.question.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Count total answers received
    const totalAnswers = await prisma.answer.count({
      where: {
        question: {
          userId: user.id,
        },
      },
    });

    const response: ProfileResponse = {
      username: user.username,
      bio: user.bio || undefined,
      totalQuestions: questions.length,
      totalAnswersReceived: totalAnswers,
      createdAt: user.createdAt.toISOString(),
      questions: questions.map((q) => ({
        ...q,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
    };

    return NextResponse.json<ApiResponse<ProfileResponse>>({
      success: true,
      data: response,
    }, { status: 200 });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching the profile',
      },
    }, { status: 500 });
  }
}
