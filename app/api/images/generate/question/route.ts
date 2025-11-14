import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { generateStoryImage } from '@/lib/images/generate';
import { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to generate images',
        },
      }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, templateId = 'gradient-sunset' } = body;

    if (!questionId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Question ID is required',
        },
      }, { status: 400 });
    }

    // Get question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Question not found',
        },
      }, { status: 404 });
    }

    // Check if user owns the question
    if (question.userId !== user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to generate an image for this question',
        },
      }, { status: 403 });
    }

    // Generate image
    const imageBuffer = await generateStoryImage(
      question.questionText,
      question.username,
      templateId
    );

    // Return image as response
    return new NextResponse(imageBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="question-${questionId}.png"`,
      },
    });

  } catch (error) {
    console.error('Generate question image error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while generating the image',
      },
    }, { status: 500 });
  }
}
