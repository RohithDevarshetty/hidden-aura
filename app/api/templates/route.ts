import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { ApiResponse } from '@/types/api';

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { templates },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch templates',
        },
      },
      { status: 500 }
    );
  }
}
