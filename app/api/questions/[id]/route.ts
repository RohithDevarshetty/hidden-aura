import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db/prisma';
import { ApiResponse } from '@/types/api';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;

    if (!session?.user?.name) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in',
          },
        },
        { status: 401 }
      );
    }

    // Find the question
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Question not found',
          },
        },
        { status: 404 }
      );
    }

    // Check if the user owns the question
    if (question.username !== session.user.name) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only delete your own questions',
          },
        },
        { status: 403 }
      );
    }

    // Soft delete the question by setting deletedAt
    const deletedQuestion = await prisma.question.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { question: deletedQuestion },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete question',
        },
      },
      { status: 500 }
    );
  }
}
