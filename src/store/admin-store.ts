'use client';

import { create } from 'zustand';
import { toast } from 'sonner';
import type { CMSPage, CMSArticle, CMSTestimonial, CMSTeamMember, CMSSiteSettings } from '@/types';

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
  teamMembers: CMSTeamMember[];
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
  updateTeamMember: (id: string, data: Partial<CMSTeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  addTeamMember: (member: Omit<CMSTeamMember, 'id'>) => Promise<void>;
  updateSiteSettings: (settings: Partial<CMSSiteSettings>) => Promise<boolean>;
}

async function parseCmsError(res: Response) {
  try {
    const data = await res.json();
    return (data as { error?: string }).error ?? 'Request failed';
  } catch {
    return 'Request failed';
  }
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  pages: [],
  articles: [],
  testimonials: [],
  teamMembers: [],
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
      teamMembers: [],
      siteSettings: null,
    });
  },

  loadCmsData: async () => {
    const res = await fetch('/api/cms', { cache: 'no-store' });
    if (!res.ok) {
      toast.error('Could not load CMS data. Check DATABASE_URL and run db:push.');
      return;
    }
    const data = await res.json();
    set({
      pages: data.pages ?? [],
      articles: data.articles ?? [],
      testimonials: data.testimonials ?? [],
      teamMembers: data.teamMembers ?? [],
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
      return true;
    }
    toast.error(await parseCmsError(res));
    return false;
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
      return true;
    }
    toast.error(await parseCmsError(res));
    return false;
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

  updateTeamMember: async (id, data) => {
    const member = get().teamMembers.find((m) => m.id === id);
    if (!member) return false;
    const res = await fetch('/api/cms', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'team-member', id, data: { ...member, ...data } }),
    });
    if (res.ok) {
      const updated = await res.json();
      set({ teamMembers: get().teamMembers.map((m) => (m.id === id ? updated : m)) });
      return true;
    }
    toast.error(await parseCmsError(res));
    return false;
  },

  deleteTeamMember: async (id) => {
    const res = await fetch(`/api/cms?resource=team-member&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      set({ teamMembers: get().teamMembers.filter((m) => m.id !== id) });
      toast.success('Team member removed');
      return true;
    }
    toast.error(await parseCmsError(res));
    return false;
  },

  addTeamMember: async (member) => {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'team-member', data: member }),
    });
    if (res.ok) {
      const created = await res.json();
      set({ teamMembers: [...get().teamMembers, created].sort((a, b) => a.sortIndex - b.sortIndex) });
      toast.success('Team member added');
      return true;
    }
    toast.error(await parseCmsError(res));
    return false;
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
      toast.success('Site settings saved');
      return true;
    }
    toast.error(await parseCmsError(res));
    return false;
  },
}));
