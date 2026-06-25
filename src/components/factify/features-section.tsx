'use client';

import FeatureCard, { type FeatureIconName } from './feature-card';

const features: {
  iconName: FeatureIconName;
  title: string;
  description: string;
}[] = [
  {
    iconName: 'brain',
    title: 'AI News Verification',
    description:
      'Analyze articles using advanced AI to detect misinformation patterns and verify claims.',
  },
  {
    iconName: 'shield',
    title: 'Source Credibility Analysis',
    description:
      'Measure trustworthiness of publishers with our comprehensive credibility scoring system.',
  },
  {
    iconName: 'globe',
    title: 'Cross Source Validation',
    description:
      'Compare multiple trusted outlets to validate claims across diverse perspectives.',
  },
  {
    iconName: 'search',
    title: 'News Search Engine',
    description: 'Search trending news instantly and verify stories before sharing them.',
  },
  {
    iconName: 'fileText',
    title: 'Detailed Reports',
    description:
      'Transparent explanations with supporting and contradicting evidence for every verdict.',
  },
  {
    iconName: 'history',
    title: 'Verification History',
    description: 'Track previous checks and build a personal archive of verified information.',
  },
  {
    iconName: 'trendingUp',
    title: 'Trending Misinformation',
    description:
      'Monitor viral fake news and stay ahead of emerging misinformation campaigns.',
  },
  {
    iconName: 'download',
    title: 'Export Reports',
    description:
      'Download and share professional verification reports with colleagues and audiences.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-factify-gray/30">
      <div className="wrapper">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-factify-navy mb-4">
            Powerful Features for Truth Seekers
          </h2>
          <p className="text-factify-gray-dark">
            Everything you need to verify news, analyze sources, and combat misinformation.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
