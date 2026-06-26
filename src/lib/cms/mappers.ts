import type { CMSPage, CMSArticle, CMSTestimonial, CMSTeamMember, CMSSiteSettings } from '@/types';
import type {
  CmsPage as DbPage,
  CmsArticle as DbArticle,
  CmsTestimonial as DbTestimonial,
  CmsTeamMember as DbTeamMember,
  SiteSettings as DbSettings,
} from '@/generated/prisma/client';

export function mapDbPageToTpl(page: DbPage): CMSPage {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    route: page.route,
    description: page.description,
    status: page.status as CMSPage['status'],
    lastUpdated: page.updatedAt.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    fields: page.fields as unknown as CMSPage['fields'],
  };
}

export function mapDbArticleToTpl(article: DbArticle): CMSArticle {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    sourceId: article.sourceId,
    category: article.category,
    region: article.region,
    status: article.status as CMSArticle['status'],
    publishedAt: article.publishedAt.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export function mapDbTestimonialToTpl(testimonial: DbTestimonial): CMSTestimonial {
  return {
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    organization: testimonial.organization,
    content: testimonial.content,
    rating: testimonial.rating,
    status: testimonial.status as CMSTestimonial['status'],
  };
}

export function mapDbTeamMemberToTpl(member: DbTeamMember): CMSTeamMember {
  return {
    id: member.id,
    name: member.name,
    level: member.level,
    bio: member.bio ?? undefined,
    imageUrl: member.imageUrl ?? undefined,
    sortIndex: member.sortIndex,
    status: member.status as CMSTeamMember['status'],
  };
}

export function mapDbSettingsToTpl(settings: DbSettings): CMSSiteSettings {
  return {
    siteName: settings.siteName,
    tagline: settings.tagline,
    heroHeadline: settings.heroHeadline,
    heroSubheadline: settings.heroSubheadline,
    ctaHeadline: settings.ctaHeadline,
    ctaButtonText: settings.ctaButtonText,
    statVerifications: settings.statVerifications,
    statAccuracy: settings.statAccuracy,
    statSources: settings.statSources,
    statMonitoring: settings.statMonitoring,
    teamHeadline: settings.teamHeadline,
    teamSubheadline: settings.teamSubheadline,
    showTeamOnHome: settings.showTeamOnHome,
  };
}
