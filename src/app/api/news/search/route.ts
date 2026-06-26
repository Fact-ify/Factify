import { NextResponse } from 'next/server';
import { searchNewsArticles } from '@/lib/news/search';

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? '';
    const category = searchParams.get('category') ?? 'All';

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const articles = await searchNewsArticles(query.trim(), category);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('News search error:', error);
    return NextResponse.json({ error: 'News search failed' }, { status: 500 });
  }
}
