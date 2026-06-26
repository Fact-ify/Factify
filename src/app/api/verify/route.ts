import { NextResponse } from 'next/server';
import { verifyClaim } from '@/lib/verification/service';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { content, mode } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const report = await verifyClaim(content.trim(), mode ?? 'headline');
    return NextResponse.json(report);
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
  }

  const { getReportById } = await import('@/lib/verification/service');
  const report = await getReportById(id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json(report);
}
