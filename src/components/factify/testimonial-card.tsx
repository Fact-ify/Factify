'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

export default function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-xl border border-factify-gray bg-white card-hover h-full flex flex-col"
    >
      <Quote className="h-8 w-8 text-factify-gold/40 mb-4" />
      <p className="text-sm text-factify-navy/80 leading-relaxed flex-1 mb-6">
        &quot;{testimonial.content}&quot;
      </p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full gradient-gold flex items-center justify-center text-sm font-bold text-factify-navy">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-factify-navy">{testimonial.name}</p>
          <p className="text-xs text-factify-gray-dark">
            {testimonial.role}, {testimonial.organization}
          </p>
        </div>
        <div className="ml-auto flex gap-0.5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-factify-gold text-factify-gold" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
