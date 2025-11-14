import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { ApiResponse, AnswerListResponse } from '@/types/api';

// GET /api/answers - Get user's received answers
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to view your answers',
        },
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');
    const unread = searchParams.get('unread') === 'true';
    const favorite = searchParams.get('favorite') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      question: {
        userId: user.id,
        deletedAt: null, // Exclude answers to deleted questions
      },
    };

    if (questionId) {
      where.questionId = questionId;
    }

    if (unread) {
      where.isRead = false;
    }

    if (favorite) {
      where.isFavorite = true;
    }

    // Get answers
    const [answers, total, unreadCount] = await Promise.all([
      prisma.answer.findMany({
        where,
        include: {
          question: {
            select: {
              id: true,
              questionText: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.answer.count({ where }),
      prisma.answer.count({
        where: {
          question: {
            userId: user.id,
            deletedAt: null, // Exclude answers to deleted questions
          },
          isRead: false,
        },
      }),
    ]);

    const response: AnswerListResponse = {
      answers: answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        answerText: a.answerText,
        deviceFingerprintHash: a.deviceFingerprintHash,
        ipAddressHash: a.ipAddressHash,
        isRead: a.isRead,
        isFavorite: a.isFavorite,
        reactions: a.reactions as string[],
        createdAt: a.createdAt.toISOString() as any,
        flaggedAt: a.flaggedAt ? a.flaggedAt.toISOString() : null as any,
        flagReason: a.flagReason,
        question: a.question as any,
      })),
      total,
      unreadCount,
      hasMore: offset + answers.length < total,
    };

    return NextResponse.json<ApiResponse<AnswerListResponse>>({
      success: true,
      data: response,
    }, { status: 200 });

  } catch (error) {
    console.error('Get answers error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching answers',
      },
    }, { status: 500 });
  }
}
