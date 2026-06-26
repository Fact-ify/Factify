import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import {
  mapDbPageToTpl,
  mapDbArticleToTpl,
  mapDbTestimonialToTpl,
  mapDbSettingsToTpl,
} from '@/lib/cms/mappers';
import { defaultSiteSettings } from '@/lib/cms/defaults';

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') ?? 'all';
    const slug = searchParams.get('slug');

    if (resource === 'pages' || resource === 'all') {
      if (slug) {
        const page = await prisma.cmsPage.findUnique({ where: { slug } });
        if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        return NextResponse.json(mapDbPageToTpl(page));
      }
    }

    if (resource === 'settings') {
      const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
      return NextResponse.json(settings ? mapDbSettingsToTpl(settings) : defaultSiteSettings);
    }

    const [pages, articles, testimonials, settings] = await Promise.all([
      prisma.cmsPage.findMany({ orderBy: { title: 'asc' } }),
      prisma.cmsArticle.findMany({ orderBy: { publishedAt: 'desc' } }),
      prisma.cmsTestimonial.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.siteSettings.findUnique({ where: { id: 'default' } }),
    ]);

    return NextResponse.json({
      pages: pages.map(mapDbPageToTpl),
      articles: articles.map(mapDbArticleToTpl),
      testimonials: testimonials.map(mapDbTestimonialToTpl),
      siteSettings: settings ? mapDbSettingsToTpl(settings) : defaultSiteSettings,
    });
  } catch (error) {
    console.error('CMS GET error:', error);
    return NextResponse.json({ error: 'Failed to load CMS data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { resource, data } = body;

    if (resource === 'article') {
      const article = await prisma.cmsArticle.create({
        data: {
          title: data.title,
          summary: data.summary,
          sourceId: data.sourceId,
          category: data.category,
          region: data.region,
          status: data.status ?? 'draft',
        },
      });
      return NextResponse.json(mapDbArticleToTpl(article));
    }

    if (resource === 'testimonial') {
      const testimonial = await prisma.cmsTestimonial.create({
        data: {
          name: data.name,
          role: data.role,
          organization: data.organization,
          content: data.content,
          rating: data.rating ?? 5,
          status: data.status ?? 'draft',
        },
      });
      return NextResponse.json(mapDbTestimonialToTpl(testimonial));
    }

    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('CMS POST error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { resource, id, data } = body;

    if (resource === 'page') {
      const page = await prisma.cmsPage.update({
        where: { id },
        data: {
          ...(data.status && { status: data.status }),
          ...(data.fields && { fields: data.fields }),
        },
      });
      return NextResponse.json(mapDbPageToTpl(page));
    }

    if (resource === 'page-field') {
      const page = await prisma.cmsPage.findUnique({ where: { id } });
      if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      const fields = (page.fields as { id: string; value: string | number }[]).map((f) =>
        f.id === data.fieldId ? { ...f, value: data.value } : f
      );
      const updated = await prisma.cmsPage.update({
        where: { id },
        data: { fields },
      });
      return NextResponse.json(mapDbPageToTpl(updated));
    }

    if (resource === 'article') {
      const article = await prisma.cmsArticle.update({
        where: { id },
        data: {
          title: data.title,
          summary: data.summary,
          sourceId: data.sourceId,
          category: data.category,
          region: data.region,
          status: data.status,
        },
      });
      return NextResponse.json(mapDbArticleToTpl(article));
    }

    if (resource === 'testimonial') {
      const testimonial = await prisma.cmsTestimonial.update({
        where: { id },
        data: {
          name: data.name,
          role: data.role,
          organization: data.organization,
          content: data.content,
          rating: data.rating,
          status: data.status,
        },
      });
      return NextResponse.json(mapDbTestimonialToTpl(testimonial));
    }

    if (resource === 'settings') {
      const settings = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: data,
        create: { id: 'default', ...defaultSiteSettings, ...data },
      });
      return NextResponse.json(mapDbSettingsToTpl(settings));
    }

    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('CMS PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');
    const id = searchParams.get('id');

    if (!resource || !id) {
      return NextResponse.json({ error: 'Resource and ID required' }, { status: 400 });
    }

    if (resource === 'article') {
      await prisma.cmsArticle.delete({ where: { id } });
    } else if (resource === 'testimonial') {
      await prisma.cmsTestimonial.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
