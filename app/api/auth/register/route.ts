import { NextRequest, NextResponse } from 'next/server';
import { createUserWithAccessCode } from '@/lib/auth/access-code';
import { hashIdentifier } from '@/lib/security/encryption';
import { usernameSchema, emailSchema } from '@/lib/utils/validation';
import { checkUsernameCreationRateLimit } from '@/lib/redis/rate-limit';
import { sendAccessCodeEmail } from '@/lib/notifications/email';
import { getProfileUrl } from '@/lib/utils/formatting';
import prisma from '@/lib/db/prisma';
import { ApiResponse, RegisterResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email } = body;

    // Validate input
    const usernameResult = usernameSchema.safeParse(username);
    if (!usernameResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: usernameResult.error.errors[0].message,
        },
      }, { status: 400 });
    }

    if (email) {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid email address',
          },
        }, { status: 400 });
      }
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIdentifier(ip);
    const rateLimitResult = await checkUsernameCreationRateLimit(ipHash);

    if (!rateLimitResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many username creation attempts. Please try again later.',
        },
      }, { status: 429 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Username already taken',
        },
      }, { status: 400 });
    }

    // Check if email already exists
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingEmail) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email already registered',
          },
        }, { status: 400 });
      }
    }

    // Create user with access code
    const { user, accessCode } = await createUserWithAccessCode(
      username,
      email
    );

    // Send access code email if email provided
    if (email) {
      await sendAccessCodeEmail(email, accessCode, user.username);
    }

    const response: RegisterResponse = {
      userId: user.id,
      username: user.username,
      accessCode,
      profileUrl: getProfileUrl(user.username),
    };

    return NextResponse.json<ApiResponse<RegisterResponse>>({
      success: true,
      data: response,
    }, { status: 200 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during registration',
      },
    }, { status: 500 });
  }
}
