import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { questionSchema } from '@/lib/utils/validation';
import { getQuestionUrl } from '@/lib/utils/formatting';
import { ApiResponse, CreateQuestionResponse, QuestionListResponse } from '@/types/api';

// POST /api/questions - Create a new question
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a question',
        },
      }, { status: 401 });
    }

    const body = await req.json();
    const result = questionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: result.error.errors[0].message,
        },
      }, { status: 400 });
    }

    const { questionText, templateId, isPublic } = result.data;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      }, { status: 404 });
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        questionText,
        templateId: templateId || null,
        isPublic: isPublic || false,
        userId: user.id,
        username: dbUser.username,
      },
    });

    const response = {
      question: {
        id: question.id,
        userId: question.userId,
        username: question.username,
        questionText: question.questionText,
        templateId: question.templateId,
        isPublic: question.isPublic,
        answerCount: 0,
        viewCount: 0,
        createdAt: question.createdAt.toISOString(),
        updatedAt: question.updatedAt.toISOString(),
        deletedAt: null,
      },
      shareUrl: getQuestionUrl(question.username, question.id),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: response,
    }, { status: 201 });

  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while creating the question',
      },
    }, { status: 500 });
  }
}

// GET /api/questions - Get user's questions
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to view your questions',
        },
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') || 'newest';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'most_answered') {
      orderBy = { answerCount: 'desc' };
    }

    // Get questions
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: {
          userId: user.id,
          deletedAt: null,
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.question.count({
        where: {
          userId: user.id,
          deletedAt: null,
        },
      }),
    ]);

    const response: QuestionListResponse = {
      questions: questions.map((q) => ({
        ...q,
        createdAt: q.createdAt.toISOString() as any,
        updatedAt: q.updatedAt.toISOString() as any,
      })),
      total,
      hasMore: offset + questions.length < total,
    };

    return NextResponse.json<ApiResponse<QuestionListResponse>>({
      success: true,
      data: response,
    }, { status: 200 });

  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching questions',
      },
    }, { status: 500 });
  }
}
