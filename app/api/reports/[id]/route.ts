import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { ApiResponse } from '@/types/api';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'dismissed', 'action_taken']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Validate input
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid status',
          },
        },
        { status: 400 }
      );
    }

    const { status } = result.data;

    // Update report
    const report = await prisma.report.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      },
      include: {
        answer: {
          include: {
            question: true,
          },
        },
      },
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { report },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update report',
        },
      },
      { status: 500 }
    );
  }
}
