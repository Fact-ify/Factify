'use client';

import { create } from 'zustand';
import type { VerificationReport } from '@/data/mock/types';

interface VerificationStore {
  currentReport: VerificationReport | null;
  isAnalyzing: boolean;
  setCurrentReport: (report: VerificationReport | null) => void;
  setIsAnalyzing: (loading: boolean) => void;
}

export const useVerificationStore = create<VerificationStore>((set) => ({
  currentReport: null,
  isAnalyzing: false,
  setCurrentReport: (report) => set({ currentReport: report }),
  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
}));
