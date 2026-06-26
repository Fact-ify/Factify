'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { CMSTeamMember } from '@/types';

interface TeamSectionProps {
  members: CMSTeamMember[];
  headline: string;
  subheadline: string;
  variant?: 'default' | 'compact';
}

export default function TeamSection({
  members,
  headline,
  subheadline,
  variant = 'default',
}: TeamSectionProps) {
  if (members.length === 0) return null;

  const isCompact = variant === 'compact';

  return (
    <section className={isCompact ? 'py-16 lg:py-20 bg-factify-gray/20' : 'py-20 lg:py-28'}>
      <div className="wrapper">
        <div className={`text-center max-w-2xl mx-auto ${isCompact ? 'mb-10' : 'mb-16'}`}>
          <h2 className={`font-bold text-factify-navy mb-4 ${isCompact ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-4xl'}`}>
            {headline}
          </h2>
          <p className="text-factify-gray-dark">{subheadline}</p>
        </div>

        <div
          className={
            isCompact
              ? 'grid sm:grid-cols-2 lg:grid-cols-4 gap-5'
              : 'grid sm:grid-cols-2 lg:grid-cols-4 gap-6'
          }
        >
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-2xl border border-factify-gray bg-white overflow-hidden card-hover"
            >
              <div className="relative aspect-[4/5] bg-factify-gray/30 overflow-hidden">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-factify-gold/20 to-factify-navy/10">
                    <span className="text-5xl font-bold text-factify-navy/40">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-factify-navy/80 text-xs font-bold text-white">
                  {member.sortIndex}
                </div>
              </div>

              <div className="p-5 text-center">
                <h3 className="font-semibold text-factify-navy text-lg">{member.name}</h3>
                <p className="text-sm text-factify-gold font-medium mt-1">{member.level}</p>
                {member.bio && (
                  <p className="text-xs text-factify-gray-dark mt-2 leading-relaxed">{member.bio}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
