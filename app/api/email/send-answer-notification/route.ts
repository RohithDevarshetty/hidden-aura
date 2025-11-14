import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendAnswerNotification } from '@/lib/email/resend';
import { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answerId } = body;

    if (!answerId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'answerId is required',
          },
        },
        { status: 400 }
      );
    }

    // Fetch the answer with question and user details
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        question: {
          include: {
            user: {
              select: {
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!answer) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Answer not found',
          },
        },
        { status: 404 }
      );
    }

    const user = answer.question.user;

    // Check if user has email and has notifications enabled
    if (!user.email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'NO_EMAIL',
            message: 'User does not have an email address',
          },
        },
        { status: 400 }
      );
    }

    // Get notification preferences
    const userPrefs = await prisma.user.findUnique({
      where: { id: answer.question.userId },
      select: { notificationPreferences: true },
    });

    const prefs = userPrefs?.notificationPreferences as any;
    if (!prefs?.email) {
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { skipped: true },
        },
        { status: 200 }
      );
    }

    const profileUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;

    // Send the email
    const result = await sendAnswerNotification(
      user.email,
      user.username,
      answer.question.questionText,
      answer.answerText,
      profileUrl
    );

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'EMAIL_FAILED',
            message: 'Failed to send email',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while sending the notification',
        },
      },
      { status: 500 }
    );
  }
}
