import 'dotenv/config';
import { prisma } from '../src/lib/db';
import {
  defaultSiteSettings,
  defaultCmsPages,
  defaultCmsArticles,
  defaultCmsTestimonials,
} from '../src/lib/cms/defaults';

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: defaultSiteSettings,
    create: { id: 'default', ...defaultSiteSettings },
  });

  for (const page of defaultCmsPages) {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        route: page.route,
        description: page.description,
        status: page.status,
        fields: page.fields as object,
      },
      create: {
        slug: page.slug,
        title: page.title,
        route: page.route,
        description: page.description,
        status: page.status,
        fields: page.fields as object,
      },
    });
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
  }

  const testimonialCount = await prisma.cmsTestimonial.count();
  if (testimonialCount === 0) {
    for (const testimonial of defaultCmsTestimonials) {
      await prisma.cmsTestimonial.create({ data: testimonial });
    }
  }

  console.log('Seed complete.');
  console.log('Create your admin account at /admin/login if none exists yet.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
