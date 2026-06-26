'use client';

import { create } from 'zustand';
import type { CMSPage, CMSArticle, CMSTestimonial, CMSSiteSettings } from '@/types';

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  pages: CMSPage[];
  articles: CMSArticle[];
  testimonials: CMSTestimonial[];
  siteSettings: CMSSiteSettings | null;
  checkSession: () => Promise<boolean>;
  checkSetupRequired: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  setupAdmin: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loadCmsData: () => Promise<void>;
  updatePageField: (pageId: string, fieldId: string, value: string | number) => Promise<void>;
  updatePageStatus: (pageId: string, status: 'published' | 'draft') => Promise<void>;
  updateArticle: (id: string, data: Partial<CMSArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addArticle: (article: Omit<CMSArticle, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<CMSTestimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addTestimonial: (testimonial: Omit<CMSTestimonial, 'id'>) => Promise<void>;
  updateSiteSettings: (settings: Partial<CMSSiteSettings>) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  pages: [],
  articles: [],
  testimonials: [],
  siteSettings: null,

  checkSession: async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (res.ok) {
        const data = await res.json();
        set({ isAuthenticated: true, user: data.user, isLoading: false });
        await get().loadCmsData();
        return true;
      }
      set({ isAuthenticated: false, user: null, isLoading: false });
      return false;
    } catch {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return false;
    }
  },

  checkSetupRequired: async () => {
    try {
      const res = await fetch('/api/admin/setup-status');
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data.setupRequired);
    } catch {
      return false;
    }
  },

  login: async (email, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error ?? 'Login failed' };
    }
    set({ isAuthenticated: true, user: data.user, isLoading: false });
    await get().loadCmsData();
    return { success: true };
  },

  setupAdmin: async (name, email, password) => {
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error ?? 'Setup failed' };
    }
    set({ isAuthenticated: true, user: data.user, isLoading: false });
    await get().loadCmsData();
    return { success: true };
  },

  logout: async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    set({
      isAuthenticated: false,
      user: null,
      pages: [],
      articles: [],
      testimonials: [],
      siteSettings: null,
    });
  },

  loadCmsData: async () => {
    const res = await fetch('/api/cms');
    if (!res.ok) return;
    const data = await res.json();
    set({
      pages: data.pages ?? [],
      articles: data.articles ?? [],
      testimonials: data.testimonials ?? [],
      siteSettings: data.siteSettings ?? null,
    });
  },

  updatePageField: async (pageId, fieldId, value) => {
    const res = await fetch('/api/cms', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'page-field', id: pageId, data: { fieldId, value } }),
    });
    if (res.ok) {
      const page = await res.json();
      set({ pages: get().pages.map((p) => (p.id === pageId ? page : p)) });
    }
  },

  updatePageStatus: async (pageId, status) => {
    const res = await fetch('/api/cms', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'page', id: pageId, data: { status } }),
    });
    if (res.ok) {
      const page = await res.json();
      set({ pages: get().pages.map((p) => (p.id === pageId ? page : p)) });
    }
  },

  updateArticle: async (id, data) => {
    const article = get().articles.find((a) => a.id === id);
    if (!article) return;
    const res = await fetch('/api/cms', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'article', id, data: { ...article, ...data } }),
    });
    if (res.ok) {
      const updated = await res.json();
      set({ articles: get().articles.map((a) => (a.id === id ? updated : a)) });
    }
  },

  deleteArticle: async (id) => {
    const res = await fetch(`/api/cms?resource=article&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      set({ articles: get().articles.filter((a) => a.id !== id) });
    }
  },

  addArticle: async (article) => {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'article', data: article }),
    });
    if (res.ok) {
      const created = await res.json();
      set({ articles: [...get().articles, created] });
    }
  },

  updateTestimonial: async (id, data) => {
    const testimonial = get().testimonials.find((t) => t.id === id);
    if (!testimonial) return;
    const res = await fetch('/api/cms', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'testimonial', id, data: { ...testimonial, ...data } }),
    });
    if (res.ok) {
      const updated = await res.json();
      set({ testimonials: get().testimonials.map((t) => (t.id === id ? updated : t)) });
    }
  },

  deleteTestimonial: async (id) => {
    const res = await fetch(`/api/cms?resource=testimonial&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      set({ testimonials: get().testimonials.filter((t) => t.id !== id) });
    }
  },

  addTestimonial: async (testimonial) => {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'testimonial', data: testimonial }),
    });
    if (res.ok) {
      const created = await res.json();
      set({ testimonials: [...get().testimonials, created] });
    }
  },

  updateSiteSettings: async (settings) => {
    const res = await fetch('/api/cms', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'settings', data: settings }),
    });
    if (res.ok) {
      const updated = await res.json();
      set({ siteSettings: updated });
    }
  },
}));
