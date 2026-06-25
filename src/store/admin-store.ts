'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  cmsPages,
  cmsArticles,
  cmsTestimonials,
  defaultSiteSettings,
  DEMO_ADMIN,
  type CMSPage,
  type CMSArticle,
  type CMSTestimonial,
  type CMSSiteSettings,
  type CMSField,
} from '@/data/mock/cms-content';

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminStore {
  isAuthenticated: boolean;
  user: AdminUser | null;
  pages: CMSPage[];
  articles: CMSArticle[];
  testimonials: CMSTestimonial[];
  siteSettings: CMSSiteSettings;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePageField: (pageId: string, fieldId: string, value: string | number) => void;
  updatePageStatus: (pageId: string, status: 'published' | 'draft') => void;
  updateArticle: (id: string, data: Partial<CMSArticle>) => void;
  deleteArticle: (id: string) => void;
  addArticle: (article: Omit<CMSArticle, 'id'>) => void;
  updateTestimonial: (id: string, data: Partial<CMSTestimonial>) => void;
  deleteTestimonial: (id: string) => void;
  addTestimonial: (testimonial: Omit<CMSTestimonial, 'id'>) => void;
  updateSiteSettings: (settings: Partial<CMSSiteSettings>) => void;
  resetCMS: () => void;
}

function touchPageFields(fields: CMSField[], fieldId: string, value: string | number): CMSField[] {
  return fields.map((f) => (f.id === fieldId ? { ...f, value } : f));
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      pages: cmsPages,
      articles: cmsArticles,
      testimonials: cmsTestimonials,
      siteSettings: defaultSiteSettings,

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 800));
        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          set({
            isAuthenticated: true,
            user: {
              email: DEMO_ADMIN.email,
              name: DEMO_ADMIN.name,
              role: DEMO_ADMIN.role,
            },
          });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
      },

      logout: () => set({ isAuthenticated: false, user: null }),

      updatePageField: (pageId, fieldId, value) =>
        set({
          pages: get().pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  fields: touchPageFields(p.fields, fieldId, value),
                  lastUpdated: new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                }
              : p
          ),
        }),

      updatePageStatus: (pageId, status) =>
        set({
          pages: get().pages.map((p) => (p.id === pageId ? { ...p, status } : p)),
        }),

      updateArticle: (id, data) =>
        set({
          articles: get().articles.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }),

      deleteArticle: (id) =>
        set({ articles: get().articles.filter((a) => a.id !== id) }),

      addArticle: (article) =>
        set({
          articles: [
            ...get().articles,
            { ...article, id: `article-${Date.now()}` },
          ],
        }),

      updateTestimonial: (id, data) =>
        set({
          testimonials: get().testimonials.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }),

      deleteTestimonial: (id) =>
        set({ testimonials: get().testimonials.filter((t) => t.id !== id) }),

      addTestimonial: (testimonial) =>
        set({
          testimonials: [
            ...get().testimonials,
            { ...testimonial, id: `testimonial-${Date.now()}` },
          ],
        }),

      updateSiteSettings: (settings) =>
        set({ siteSettings: { ...get().siteSettings, ...settings } }),

      resetCMS: () =>
        set({
          pages: cmsPages,
          articles: cmsArticles,
          testimonials: cmsTestimonials,
          siteSettings: defaultSiteSettings,
        }),
    }),
    { name: 'factify-admin' }
  )
);
