import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db';
import {
  defaultSiteSettings,
  defaultCmsPages,
  defaultCmsArticles,
  defaultCmsTestimonials,
} from '../src/lib/cms/defaults';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@factify.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const adminName = process.env.ADMIN_NAME ?? 'Admin User';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: passwordHash, name: adminName },
    create: {
      email: adminEmail,
      password: passwordHash,
      name: adminName,
      role: 'admin',
    },
  });

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
  console.log(`Admin login: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
