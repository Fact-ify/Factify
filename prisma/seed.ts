import 'dotenv/config';
import { prisma } from '../src/lib/db';
import {
  defaultSiteSettings,
  defaultCmsPages,
  defaultCmsArticles,
  defaultCmsTestimonials,
  defaultCmsTeamMembers,
} from '../src/lib/cms/defaults';

async function main() {
  const existingSettings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  if (!existingSettings) {
    await prisma.siteSettings.create({ data: { id: 'default', ...defaultSiteSettings } });
    console.log('Created default site settings.');
  } else {
    console.log('Site settings already exist — skipped (your CMS edits are preserved).');
  }

  for (const page of defaultCmsPages) {
    const existing = await prisma.cmsPage.findUnique({ where: { slug: page.slug } });
    if (!existing) {
      await prisma.cmsPage.create({
        data: {
          slug: page.slug,
          title: page.title,
          route: page.route,
          description: page.description,
          status: page.status,
          fields: page.fields as object,
        },
      });
      console.log(`Created CMS page: ${page.slug}`);
    } else {
      await prisma.cmsPage.update({
        where: { slug: page.slug },
        data: {
          title: page.title,
          route: page.route,
          description: page.description,
        },
      });
    }
  }

  const articleCount = await prisma.cmsArticle.count();
  if (articleCount === 0) {
    for (const article of defaultCmsArticles) {
      await prisma.cmsArticle.create({
        data: {
          title: article.title,
          summary: article.summary,
          sourceId: article.sourceId,
          category: article.category,
          region: article.region,
          status: article.status,
        },
      });
    }
    console.log('Seeded default articles.');
  }

  const testimonialCount = await prisma.cmsTestimonial.count();
  if (testimonialCount === 0) {
    for (const testimonial of defaultCmsTestimonials) {
      await prisma.cmsTestimonial.create({ data: testimonial });
    }
    console.log('Seeded default testimonials.');
  }

  try {
    const teamCount = await prisma.cmsTeamMember.count();
    if (teamCount === 0) {
      for (const member of defaultCmsTeamMembers) {
        await prisma.cmsTeamMember.create({ data: member });
      }
      console.log('Seeded default team members.');
    }
  } catch {
    console.warn('Team table not ready — run npm run db:push first, then seed again.');
  }

  console.log('Seed complete.');
  console.log('Create your admin account at /admin/setup if none exists yet.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
