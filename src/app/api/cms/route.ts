import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import {
  mapDbPageToTpl,
  mapDbArticleToTpl,
  mapDbTestimonialToTpl,
  mapDbTeamMemberToTpl,
  mapDbSettingsToTpl,
} from '@/lib/cms/mappers';
import { defaultSiteSettings } from '@/lib/cms/defaults';
import { revalidateCmsPublicPages } from '@/lib/cms/revalidate';
import { buildHomeSettingsPatch } from '@/lib/cms/sync-home-settings';

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

async function loadAllCmsData() {
  const pages = await prisma.cmsPage.findMany({ orderBy: { title: 'asc' } });
  const articles = await prisma.cmsArticle.findMany({ orderBy: { publishedAt: 'desc' } });
  const testimonials = await prisma.cmsTestimonial.findMany({ orderBy: { createdAt: 'desc' } });

  let teamMembers: Awaited<ReturnType<typeof prisma.cmsTeamMember.findMany>> = [];
  try {
    teamMembers = await prisma.cmsTeamMember.findMany({ orderBy: { sortIndex: 'asc' } });
  } catch (error) {
    console.warn('CMS team members unavailable:', error);
  }

  let siteSettings = defaultSiteSettings;
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (settings) siteSettings = mapDbSettingsToTpl(settings);
  } catch (error) {
    console.warn('CMS site settings unavailable:', error);
  }

  return {
    pages: pages.map(mapDbPageToTpl),
    articles: articles.map(mapDbArticleToTpl),
    testimonials: testimonials.map(mapDbTestimonialToTpl),
    teamMembers: teamMembers.map(mapDbTeamMemberToTpl),
    siteSettings,
  };
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
      try {
        const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
        return NextResponse.json(settings ? mapDbSettingsToTpl(settings) : defaultSiteSettings);
      } catch {
        return NextResponse.json(defaultSiteSettings);
      }
    }

    return NextResponse.json(await loadAllCmsData());
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
      revalidateCmsPublicPages();
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
      revalidateCmsPublicPages();
      return NextResponse.json(mapDbTestimonialToTpl(testimonial));
    }

    if (resource === 'team-member') {
      const member = await prisma.cmsTeamMember.create({
        data: {
          name: data.name,
          level: data.level,
          bio: data.bio ?? null,
          imageUrl: data.imageUrl ?? null,
          sortIndex: data.sortIndex ?? 0,
          status: data.status ?? 'draft',
        },
      });
      revalidateCmsPublicPages();
      return NextResponse.json(mapDbTeamMemberToTpl(member));
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
      revalidateCmsPublicPages();
      return NextResponse.json(mapDbPageToTpl(page));
    }

    if (resource === 'page-field') {
      const page = await prisma.cmsPage.findUnique({ where: { id } });
      if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

      const fields = (page.fields as { id: string; key: string; value: string | number }[]).map(
        (f) => (f.id === data.fieldId ? { ...f, value: data.value } : f)
      );

      const updated = await prisma.cmsPage.update({
        where: { id },
        data: { fields },
      });

      if (updated.slug === 'home') {
        const settingsPatch = buildHomeSettingsPatch(fields);
        if (Object.keys(settingsPatch).length > 0) {
          await prisma.siteSettings.upsert({
            where: { id: 'default' },
            update: settingsPatch,
            create: { id: 'default', ...defaultSiteSettings, ...settingsPatch },
          });
        }
      }

      revalidateCmsPublicPages();
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
      revalidateCmsPublicPages();
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
      revalidateCmsPublicPages();
      return NextResponse.json(mapDbTestimonialToTpl(testimonial));
    }

    if (resource === 'team-member') {
      const member = await prisma.cmsTeamMember.update({
        where: { id },
        data: {
          name: data.name,
          level: data.level,
          bio: data.bio ?? null,
          imageUrl: data.imageUrl ?? null,
          sortIndex: data.sortIndex,
          status: data.status,
        },
      });
      revalidateCmsPublicPages();
      return NextResponse.json(mapDbTeamMemberToTpl(member));
    }

    if (resource === 'settings') {
      const settings = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: data,
        create: { id: 'default', ...defaultSiteSettings, ...data },
      });
      revalidateCmsPublicPages();
      return NextResponse.json(mapDbSettingsToTpl(settings));
    }

    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('CMS PATCH error:', error);
    const message =
      error instanceof Error && error.message.includes('does not exist')
        ? 'Database schema is out of date. Run npm run db:push on your database.'
        : 'Failed to update item';
    return NextResponse.json({ error: message }, { status: 500 });
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
    } else if (resource === 'team-member') {
      await prisma.cmsTeamMember.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }

    revalidateCmsPublicPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
