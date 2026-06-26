'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Brain,
  Globe,
  Users,
  Target,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { defaultSiteSettings } from '@/lib/cms/defaults';
import AnimatedCounter from '@/components/factify/animated-counter';

const platformStats = [
  { value: defaultSiteSettings.statVerifications, suffix: '+', label: 'News Verifications' },
  { value: defaultSiteSettings.statAccuracy, suffix: '%', label: 'Verification Accuracy' },
  { value: defaultSiteSettings.statSources, suffix: '+', label: 'Trusted News Sources' },
  { value: 24, suffix: '/7', label: 'AI Monitoring' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Trust',
    description:
      'Every verification is backed by transparent source analysis and clear reasoning you can audit.',
  },
  {
    icon: Brain,
    title: 'Intelligence',
    description:
      'Advanced AI cross-references claims against trusted outlets, fact-check databases, and credibility signals.',
  },
  {
    icon: Globe,
    title: 'Transparency',
    description:
      'We show every source used, how it supports or contradicts a claim, and why we reached each verdict.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description:
      'Built for journalists, researchers, students, governments, and anyone who cares about truth.',
  },
];

const team = [
  { name: 'Dr. Amara Osei', role: 'Chief Science Officer', focus: 'Misinformation research' },
  { name: 'James Chen', role: 'Head of AI', focus: 'Natural language verification' },
  { name: 'Sarah Mitchell', role: 'Editorial Director', focus: 'Source credibility standards' },
  { name: 'Kwame Asante', role: 'Product Lead', focus: 'User experience & trust design' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden hero-pattern py-20 lg:py-28">
        <div className="wrapper">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-factify-gold/10 border border-factify-gold/30 text-factify-gold text-xs font-semibold mb-6">
              <Target className="h-3.5 w-3.5" />
              Our Mission
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-factify-navy mb-6">
              Helping You Verify Information Before Believing or Sharing It
            </h1>
            <p className="text-lg text-factify-gray-dark leading-relaxed">
              Factify is an AI-powered news verification platform that analyzes articles, headlines,
              claims, and URLs using source credibility analysis, fact-checking methodologies, and
              cross-referencing from trusted news outlets worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-factify-navy text-white">
        <div className="wrapper">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold text-factify-gold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="wrapper">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-factify-navy mb-6">Why Factify Exists</h2>
              <div className="space-y-4 text-factify-gray-dark leading-relaxed">
                <p>
                  In an era where misinformation spreads faster than truth, everyone needs tools to
                  verify what they read before sharing it. Factify was built to democratize
                  professional-grade fact-checking and make it accessible to journalists,
                  researchers, educators, and everyday citizens.
                </p>
                <p>
                  We combine artificial intelligence with rigorous source credibility analysis to
                  deliver transparent verification reports. Every verdict comes with supporting
                  evidence, contradicting sources, and a clear explanation of our reasoning.
                </p>
                <p>
                  Our platform monitors 500+ trusted news sources around the clock, helping users
                  stay ahead of viral fake news and make informed decisions about the information
                  they consume and share.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-factify-gray bg-white p-8 shadow-factify-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-factify-gold">
                  <Award className="h-6 w-6 text-factify-navy" />
                </div>
                <div>
                  <p className="font-bold text-factify-navy text-lg">FACTIFY</p>
                  <p className="text-sm text-factify-gray-dark">Truth in Every Story</p>
                </div>
              </div>
              <blockquote className="border-l-4 border-factify-gold pl-4 italic text-factify-navy/80">
                &ldquo;We believe that access to verified information is a fundamental right in the
                digital age. Factify exists to protect that right.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-factify-gray-dark">The Factify Team</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-factify-gray/30">
        <div className="wrapper">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-factify-navy mb-4">Our Core Values</h2>
            <p className="text-factify-gray-dark">
              The principles that guide every verification, every report, and every product decision.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl border border-factify-gray bg-white card-hover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-factify-gold/10 mb-4">
                  <value.icon className="h-5 w-5 text-factify-gold" />
                </div>
                <h3 className="font-semibold text-factify-navy mb-2">{value.title}</h3>
                <p className="text-sm text-factify-gray-dark leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28">
        <div className="wrapper">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-factify-navy mb-4">Leadership Team</h2>
            <p className="text-factify-gray-dark">
              Experts in journalism, AI, and information integrity building the future of news
              verification.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl border border-factify-gray bg-white text-center card-hover"
              >
                <div className="h-16 w-16 rounded-full gradient-gold mx-auto mb-4 flex items-center justify-center text-xl font-bold text-factify-navy">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-factify-navy">{member.name}</h3>
                <p className="text-sm text-factify-gold font-medium mt-1">{member.role}</p>
                <p className="text-xs text-factify-gray-dark mt-2">{member.focus}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-navy">
        <div className="wrapper text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Verifying?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who trust Factify to combat misinformation every day.
            </p>
            <Button size="lg" asChild>
              <Link href="/verify">
                Start Verifying News
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
