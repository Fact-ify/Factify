'use client';

import { motion } from 'framer-motion';
import { FileText, Brain, FileCheck } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: FileText,
    title: 'Submit News',
    description: 'Paste an article URL, headline, full article text, or search for news to verify.',
    details: ['Paste article URL', 'Paste news headline', 'Paste article text', 'Search for news'],
  },
  {
    step: 2,
    icon: Brain,
    title: 'AI Analysis',
    description: 'Factify evaluates source credibility, evidence, language patterns, and cross-references trusted outlets.',
    details: [
      'Source credibility',
      'Supporting evidence',
      'Language patterns',
      'Related news reports',
      'Fact-check databases',
    ],
  },
  {
    step: 3,
    icon: FileCheck,
    title: 'Verification Report',
    description: 'Receive a comprehensive report with verdict, confidence score, sources, and AI explanation.',
    details: [
      'Verdict',
      'Confidence Score',
      'Supporting Sources',
      'Contradicting Sources',
      'AI Explanation',
    ],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-factify-navy mb-4">
            How Factify Works
          </h2>
          <p className="text-factify-gray-dark">
            Three simple steps to verify any news story with AI-powered analysis and trusted sources.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-factify-gray" />
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-gold mb-6 relative">
                  <item.icon className="h-7 w-7 text-factify-navy" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-factify-navy text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-factify-navy mb-3">{item.title}</h3>
                <p className="text-sm text-factify-gray-dark mb-4 leading-relaxed">{item.description}</p>
                <ul className="text-left space-y-2 max-w-xs mx-auto">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-factify-navy/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-factify-gold shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
