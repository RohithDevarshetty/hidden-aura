import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { answerSchema } from '@/lib/utils/validation';
import { hashIdentifier } from '@/lib/security/encryption';
import {
  checkAnswerRateLimit,
  checkTotalAnswerRateLimit,
  checkIPAnswerRateLimit,
} from '@/lib/redis/rate-limit';
import { verifyCaptcha } from '@/lib/security/captcha';
import { sendNewAnswerEmail } from '@/lib/notifications/email';
import { ApiResponse, SubmitAnswerResponse } from '@/types/api';

// POST /api/questions/[id]/answers - Submit an anonymous answer
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            notificationPreferences: true,
          },
        },
      },
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

    const body = await req.json();
    const result = answerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: result.error.errors[0].message,
        },
      }, { status: 400 });
    }

    const { answerText, captchaToken, deviceFingerprint } = result.data;

    // Hash device fingerprint and IP
    const deviceHash = hashIdentifier(deviceFingerprint);
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIdentifier(ip);

    // Check rate limits
    const [answerRateLimit, totalRateLimit, ipRateLimit] = await Promise.all([
      checkAnswerRateLimit(deviceHash, questionId),
      checkTotalAnswerRateLimit(deviceHash),
      checkIPAnswerRateLimit(ipHash),
    ]);

    if (!answerRateLimit.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'You have answered this question too many times. Please try again tomorrow.',
        },
      }, { status: 429 });
    }

    if (!totalRateLimit.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'You have submitted too many answers. Please try again later.',
        },
      }, { status: 429 });
    }

    if (!ipRateLimit.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many answers from this network. Please try again later.',
        },
      }, { status: 429 });
    }

    // Create answer
    const answer = await prisma.answer.create({
      data: {
        questionId,
        answerText,
        deviceFingerprintHash: deviceHash,
        ipAddressHash: ipHash,
      },
    });

    // Increment answer count
    await prisma.question.update({
      where: { id: questionId },
      data: { answerCount: { increment: 1 } },
    });

    // Send notification to question owner
    const notificationPrefs = question.user.notificationPreferences as any;
    if (question.user.email && notificationPrefs?.email) {
      await sendNewAnswerEmail(
        question.user.email,
        question.user.username,
        question.questionText,
        answerText
      );
    }

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: question.userId,
        type: 'new_answer',
        title: 'New answer received!',
        message: 'Someone answered your question',
        answerId: answer.id,
        questionId: question.id,
      },
    });

    const response: SubmitAnswerResponse = {
      answerId: answer.id,
      message: 'Answer submitted anonymously',
    };

    return NextResponse.json<ApiResponse<SubmitAnswerResponse>>({
      success: true,
      data: response,
    }, { status: 201 });

  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while submitting the answer',
      },
    }, { status: 500 });
  }
}
