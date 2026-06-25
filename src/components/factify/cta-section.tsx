'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTASection({
  headline = 'Discover the Truth Behind Every Story',
  description = 'Join thousands of journalists, researchers, and everyday users who trust Factify to verify news before sharing.',
  buttonText = 'Start Verifying News',
  buttonHref = '/verify',
}: CTASectionProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl gradient-navy px-8 py-16 lg:px-16 lg:py-20 text-center"
        >
          <div className="absolute inset-0 hero-pattern opacity-30" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{headline}</h2>
            <p className="text-white/70 mb-8 leading-relaxed">{description}</p>
            <Button size="lg" asChild>
              <Link href={buttonHref}>
                {buttonText}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-factify-gold/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-factify-gold/5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
