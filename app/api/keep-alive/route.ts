import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple query to keep database connection alive
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { status: 'error', error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
