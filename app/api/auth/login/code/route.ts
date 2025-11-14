import { NextRequest, NextResponse } from 'next/server';
import { getUserByAccessCode } from '@/lib/auth/access-code';
import { hashIdentifier } from '@/lib/security/encryption';
import { accessCodeSchema } from '@/lib/utils/validation';
import { checkAccessCodeAttempts } from '@/lib/redis/rate-limit';
import { ApiResponse, LoginResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessCode } = body;

    // Validate input
    const result = accessCodeSchema.safeParse(accessCode);
    if (!result.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid access code format',
        },
      }, { status: 400 });
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIdentifier(ip);
    const rateLimitResult = await checkAccessCodeAttempts(accessCode, ipHash);

    if (!rateLimitResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many login attempts. Please try again later.',
        },
      }, { status: 429 });
    }

    // Verify access code
    const user = await getUserByAccessCode(accessCode);

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid access code',
        },
      }, { status: 401 });
    }

    // In production, you would generate a JWT token here
    // For now, we'll return user info and rely on NextAuth session
    const response: LoginResponse = {
      userId: user.id,
      username: user.username,
      token: 'use-nextauth-session', // Placeholder
    };

    return NextResponse.json<ApiResponse<LoginResponse>>({
      success: true,
      data: response,
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during login',
      },
    }, { status: 500 });
  }
}
