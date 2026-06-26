'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from './animated-counter';
import type { CMSSiteSettings } from '@/types';

interface StatsSectionProps {
  settings?: CMSSiteSettings;
}

export default function StatsSection({ settings }: StatsSectionProps) {
  const platformStats = [
    { value: settings?.statVerifications ?? 100000, suffix: '+', label: 'News Verifications' },
    { value: settings?.statAccuracy ?? 95, suffix: '%', label: 'Verification Accuracy' },
    { value: settings?.statSources ?? 500, suffix: '+', label: 'Trusted News Sources' },
    { value: 24, suffix: '/7', label: 'AI Monitoring' },
  ];

  return (
    <section className="py-16 bg-factify-navy">
      <div className="wrapper">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {platformStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="text-3xl lg:text-4xl font-bold text-factify-gold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
