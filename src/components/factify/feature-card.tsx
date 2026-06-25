'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  Shield,
  Search,
  FileText,
  History,
  TrendingUp,
  Download,
  Globe,
  type LucideIcon,
} from 'lucide-react';

const iconMap = {
  brain: Brain,
  shield: Shield,
  search: Search,
  fileText: FileText,
  history: History,
  trendingUp: TrendingUp,
  download: Download,
  globe: Globe,
} satisfies Record<string, LucideIcon>;

export type FeatureIconName = keyof typeof iconMap;

interface FeatureCardProps {
  iconName: FeatureIconName;
  title: string;
  description: string;
  index?: number;
}

export default function FeatureCard({
  iconName,
  title,
  description,
  index = 0,
}: FeatureCardProps) {
  const Icon = iconMap[iconName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group p-6 rounded-xl border border-factify-gray bg-white card-hover"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-factify-gold/10 group-hover:bg-factify-gold/20 transition-colors mb-4">
        <Icon className="h-6 w-6 text-factify-gold" />
      </div>
      <h3 className="text-base font-semibold text-factify-navy mb-2">{title}</h3>
      <p className="text-sm text-factify-gray-dark leading-relaxed">{description}</p>
    </motion.div>
  );
}
