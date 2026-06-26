import { NextResponse } from 'next/server';
import { getDashboardSummary, getTrendingMisinformation } from '@/lib/analytics/dashboard';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'trending') {
      const trending = await getTrendingMisinformation();
      return NextResponse.json(trending);
    }

    const summary = await getDashboardSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
