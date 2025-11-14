import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import prisma from '@/lib/db/prisma';
import { ApiResponse, CheckUsernameResponse } from '@/types/api';
import { usernameSchema } from '@/lib/utils/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Username parameter is required',
        },
      }, { status: 400 });
    }

    // Validate username format
    const result = usernameSchema.safeParse(username);
    if (!result.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: result.error.errors[0].message,
        },
      }, { status: 400 });
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    const available = !existingUser;

    // Generate suggestions if not available
    const suggestions: string[] = [];
    if (!available) {
      const baseUsername = username.toLowerCase();
      for (let i = 1; i <= 3; i++) {
        const suggestion = `${baseUsername}${Math.floor(Math.random() * 999)}`;
        const exists = await prisma.user.findUnique({
          where: { username: suggestion },
        });
        if (!exists) {
          suggestions.push(suggestion);
        }
      }
    }

    const response: CheckUsernameResponse = {
      available,
      suggestions,
    };

    return NextResponse.json<ApiResponse<CheckUsernameResponse>>({
      success: true,
      data: response,
    }, { status: 200 });

  } catch (error) {
    console.error('Check username error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while checking username',
      },
    }, { status: 500 });
  }
}
