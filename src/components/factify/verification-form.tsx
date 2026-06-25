'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FileText, Link2, AlignLeft, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type VerifyMode = 'headline' | 'url' | 'article' | 'claim';

interface VerificationFormProps {
  onSubmit: (data: { mode: VerifyMode; content: string }) => void;
  isLoading?: boolean;
  initialContent?: string;
}

interface FormData {
  content: string;
}

const modes: { id: VerifyMode; label: string; icon: typeof FileText; placeholder: string }[] = [
  {
    id: 'headline',
    label: 'Verify By Headline',
    icon: FileText,
    placeholder: 'Paste a news headline to verify...',
  },
  {
    id: 'url',
    label: 'Verify By URL',
    icon: Link2,
    placeholder: 'Paste an article URL to verify...',
  },
  {
    id: 'article',
    label: 'Verify By Full Article',
    icon: AlignLeft,
    placeholder: 'Paste the full article text to verify...',
  },
  {
    id: 'claim',
    label: 'Verify By Claim',
    icon: MessageSquare,
    placeholder: 'Paste a claim or statement to verify...',
  },
];

export default function VerificationForm({
  onSubmit,
  isLoading = false,
  initialContent = '',
}: VerificationFormProps) {
  const [mode, setMode] = useState<VerifyMode>('headline');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { content: initialContent },
  });

  const activeMode = modes.find((m) => m.id === mode)!;

  return (
    <div className="rounded-xl border border-factify-gray bg-white p-6 shadow-factify-sm">
      <h2 className="text-lg font-semibold text-factify-navy mb-4">Verify News</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all',
              mode === m.id
                ? 'border-factify-gold bg-factify-gold/10 text-factify-navy'
                : 'border-factify-gray text-factify-gray-dark hover:border-factify-navy/20'
            )}
            aria-pressed={mode === m.id}
          >
            <m.icon className="h-5 w-5" />
            <span className="text-center leading-tight">{m.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit({ mode, content: data.content }))}>
        <textarea
          {...register('content', { required: 'Please enter content to verify' })}
          placeholder={activeMode.placeholder}
          rows={6}
          className="w-full rounded-lg border border-factify-gray bg-white px-4 py-3 text-sm text-factify-navy placeholder:text-factify-gray-dark/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold focus-visible:border-factify-gold resize-none transition-colors"
          aria-label="Content to verify"
        />
        {errors.content && (
          <p className="text-sm text-factify-error mt-1">{errors.content.message}</p>
        )}

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-4">
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze News'
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
