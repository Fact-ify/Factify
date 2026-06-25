import HeroSection from '@/components/factify/hero-section';
import StatsSection from '@/components/factify/stats-section';
import HowItWorks from '@/components/factify/how-it-works';
import FeaturesSection from '@/components/factify/features-section';
import TestimonialCard from '@/components/factify/testimonial-card';
import CTASection from '@/components/factify/cta-section';
import TrendCard from '@/components/factify/trend-card';
import { testimonials } from '@/data/mock/testimonials';
import { trendingFakeNews } from '@/data/mock/trending';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />

      <section className="py-20 lg:py-28 bg-white">
        <div className="wrapper">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-factify-navy mb-4">
              Trending Misinformation
            </h2>
            <p className="text-factify-gray-dark">
              Currently monitored viral claims flagged by our AI monitoring system.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {trendingFakeNews.slice(0, 4).map((trend, index) => (
              <TrendCard key={trend.id} trend={trend} index={index} />
            ))}
          </div>
        </div>
      </section>

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
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
