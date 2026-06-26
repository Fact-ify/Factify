import HeroSection from '@/components/factify/hero-section';
import StatsSection from '@/components/factify/stats-section';
import HowItWorks from '@/components/factify/how-it-works';
import FeaturesSection from '@/components/factify/features-section';
import TestimonialCard from '@/components/factify/testimonial-card';
import CTASection from '@/components/factify/cta-section';
import TrendCard from '@/components/factify/trend-card';
import { prisma } from '@/lib/db';
import { getTrendingMisinformation } from '@/lib/analytics/dashboard';
import { mapDbSettingsToTpl, mapDbTestimonialToTpl } from '@/lib/cms/mappers';
import { defaultSiteSettings } from '@/lib/cms/defaults';
import type { Testimonial } from '@/types';

function testimonialToDisplay(t: { id: string; name: string; role: string; organization: string; content: string; rating: number }): Testimonial {
  const initials = t.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return { ...t, avatar: initials };
}

export default async function HomePage() {
  const [testimonials, trending, settingsRow] = await Promise.all([
    prisma.cmsTestimonial.findMany({ where: { status: 'published' }, take: 6 }),
    getTrendingMisinformation(),
    prisma.siteSettings.findUnique({ where: { id: 'default' } }),
  ]);

  const settings = settingsRow ? mapDbSettingsToTpl(settingsRow) : defaultSiteSettings;
  const displayTestimonials = testimonials.map((t) => testimonialToDisplay(mapDbTestimonialToTpl(t)));

  return (
    <>
      <HeroSection settings={settings} />
      <StatsSection settings={settings} />
      <HowItWorks />
      <FeaturesSection />

      {trending.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="wrapper">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-factify-navy mb-4">
                Trending Misinformation
              </h2>
              <p className="text-factify-gray-dark">
                Recently flagged false or misleading claims detected by Factify.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {trending.slice(0, 4).map((trend, index) => (
                <TrendCard key={trend.id} trend={trend} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {displayTestimonials.length > 0 && (
        <section className="py-20 lg:py-28 bg-factify-gray/30">
          <div className="wrapper">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-factify-navy mb-4">
                Trusted by Professionals
              </h2>
              <p className="text-factify-gray-dark">
                Journalists, researchers, educators, and governments rely on Factify every day.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTestimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        headline={settings.ctaHeadline}
        buttonText={settings.ctaButtonText}
      />
    </>
  );
}
