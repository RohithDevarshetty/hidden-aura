import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import prisma from '@/lib/db/prisma';
import { ApiResponse, TrendingQuestionsResponse, TrendingQuestion } from '@/types/api';

// Calculate trending score
function calculateTrendingScore(
  answerCount: number,
  viewCount: number,
  createdAt: Date
): number {
  const ageInHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  const score = (answerCount * 2 + viewCount * 0.1) / Math.pow(ageInHours + 2, 1.5);
  return score;
}

// GET /api/explore/trending - Get trending questions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get public questions from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const questions = await prisma.question.findMany({
      where: {
        isPublic: true,
        deletedAt: null,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: [
        { answerCount: 'desc' },
        { viewCount: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 100, // Get more than needed for scoring
    });

    // Calculate trending scores and sort
    const questionsWithScores: TrendingQuestion[] = questions.map((q) => ({
      ...q,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      trendingScore: calculateTrendingScore(q.answerCount, q.viewCount, q.createdAt),
    }));

    // Sort by trending score
    questionsWithScores.sort((a, b) => b.trendingScore - a.trendingScore);

    // Apply pagination
    const paginatedQuestions = questionsWithScores.slice(offset, offset + limit);

    const response: TrendingQuestionsResponse = {
      questions: paginatedQuestions,
      total: questionsWithScores.length,
      hasMore: offset + paginatedQuestions.length < questionsWithScores.length,
    };

    return NextResponse.json<ApiResponse<TrendingQuestionsResponse>>({
      success: true,
      data: response,
    }, { status: 200 });

  } catch (error) {
    console.error('Get trending questions error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching trending questions',
      },
    }, { status: 500 });
  }
}
