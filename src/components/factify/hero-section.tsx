'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle2, Globe, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './search-bar';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-pattern pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="wrapper">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-factify-gold/10 border border-factify-gold/30 text-factify-gold text-xs font-semibold mb-6">
              <Shield className="h-3.5 w-3.5" />
              AI-Powered News Verification
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-factify-navy leading-tight tracking-tight">
              Verify News Before{' '}
              <span className="text-gradient-gold">You Believe It</span>
            </h1>

            <p className="mt-6 text-lg text-factify-gray-dark leading-relaxed max-w-xl">
              Factify uses AI and trusted news sources to analyze articles, claims, and URLs,
              helping you identify misinformation and discover the truth behind every story.
            </p>

            <div className="mt-8">
              <SearchBar size="large" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" asChild>
                <Link href="/about">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-factify-gray-dark">
              {[
                { icon: CheckCircle2, text: '95% Accuracy' },
                { icon: Globe, text: '500+ Sources' },
                { icon: Brain, text: 'AI Analysis' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-factify-gold" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border border-factify-gray bg-white p-6 shadow-factify-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-factify-gray-dark">AI Analysis Engine</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-factify-navy/5 border border-factify-gray">
                  <p className="text-xs text-factify-gray-dark mb-1">Analyzing claim...</p>
                  <p className="text-sm font-medium text-factify-navy">
                    &quot;Government announces free electricity for all citizens&quot;
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Sources', value: '12', color: 'text-factify-gold' },
                    { label: 'Confidence', value: '91%', color: 'text-factify-navy' },
                    { label: 'Risk', value: 'High', color: 'text-red-500' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-factify-gray/30 text-center">
                      <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                      <p className="text-xs text-factify-gray-dark">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {['Reuters — Contradicts', 'BBC — Contradicts', 'Unknown Source — Supports'].map(
                    (source, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-factify-gray text-xs"
                      >
                        <span className="font-medium text-factify-navy">{source.split(' — ')[0]}</span>
                        <span
                          className={
                            source.includes('Contradicts')
                              ? 'text-green-600'
                              : 'text-red-500'
                          }
                        >
                          {source.split(' — ')[1]}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <div className="p-3 rounded-lg gradient-gold text-center">
                  <p className="text-sm font-bold text-factify-navy">Verdict: Likely False</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-factify-gold/20 blur-2xl floating" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-factify-navy/10 blur-2xl floating" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
