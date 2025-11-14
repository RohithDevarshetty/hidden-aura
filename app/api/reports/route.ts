import { NextRequest, NextResponse } from 'next/server';
import { hashIdentifier } from '@/lib/security/encryption';
import prisma from '@/lib/db/prisma';
import { ApiResponse } from '@/types/api';
import { z } from 'zod';

const reportSchema = z.object({
  answerId: z.string().uuid(),
  reason: z.enum(['spam', 'abuse', 'offensive', 'harassment', 'misinformation', 'other']),
  details: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const result = reportSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid report data',
          },
        },
        { status: 400 }
      );
    }

    const { answerId, reason, details } = result.data;

    // Check if answer exists
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
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

    // Get device fingerprint from request (you can enhance this with FingerprintJS)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const deviceHash = hashIdentifier(ip + req.headers.get('user-agent'));

    // Check if already reported from this device
    const existingReport = await prisma.report.findFirst({
      where: {
        answerId,
        reportedByDeviceHash: deviceHash,
      },
    });

    if (existingReport) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'DUPLICATE_REPORT',
            message: 'You have already reported this answer',
          },
        },
        { status: 409 }
      );
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        answerId,
        reason,
        details: details || null,
        reportedByDeviceHash: deviceHash,
        status: 'pending',
      },
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { reportId: report.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Report creation error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to submit report',
        },
      },
      { status: 500 }
    );
  }
}

// Get reports (admin only)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const reports = await prisma.report.findMany({
      where: {
        status: status || undefined,
      },
      include: {
        answer: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    const total = await prisma.report.count({
      where: {
        status: status || undefined,
      },
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { reports, total, limit, offset },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch reports',
        },
      },
      { status: 500 }
    );
  }
}
