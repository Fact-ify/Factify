'use client';

import { useEffect, useRef, useState } from 'react';
import { Save, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CMSPage } from '@/types';
import { useAdminStore } from '@/store/admin-store';

interface CMSPageEditorProps {
  page: CMSPage;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function CMSPageEditor({ page }: CMSPageEditorProps) {
  const { updatePageField, updatePageStatus } = useAdminStore();
  const [fields, setFields] = useState(page.fields);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Map<string, string | number>>(new Map());

  useEffect(() => {
    setFields(page.fields);
  }, [page.id, page.fields]);

  const flushPending = async () => {
    const pending = new Map(pendingRef.current);
    if (pending.size === 0) return;

    pendingRef.current.clear();
    setSaveState('saving');

    try {
      for (const [fieldId, value] of pending.entries()) {
        const ok = await updatePageField(page.id, fieldId, value);
        if (!ok) {
          setSaveState('error');
          return;
        }
      }
      const updatedPage = useAdminStore.getState().pages.find((p) => p.id === page.id);
      if (updatedPage) setFields(updatedPage.fields);
      setSaveState('saved');
      toast.success('Page content saved to database');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      setSaveState('error');
      toast.error(error instanceof Error ? error.message : 'Failed to save page content');
    }
  };

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, value } : f))
    );
    pendingRef.current.set(fieldId, value);
    setSaveState('idle');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      flushPending();
    }, 800);
  };

  const handleManualSave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    flushPending();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-factify-navy">{page.title}</h2>
            <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
              {page.status}
            </Badge>
          </div>
          <p className="text-sm text-factify-gray-dark">
            {page.route} | Last updated {page.lastUpdated}
          </p>
          {page.slug === 'home' && (
            <p className="text-xs text-factify-gold mt-1">
              Home page fields also update the live hero and CTA on the site.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={page.status}
            onChange={async (e) => {
              const status = e.target.value as 'published' | 'draft';
              await updatePageStatus(page.id, status);
              toast.success(`Page marked as ${status}`);
            }}
            className="h-10 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold"
            aria-label="Page status"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <Button variant="secondary" size="sm" asChild>
            <a href={page.route} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
              Preview
            </a>
          </Button>
          <Button size="sm" onClick={handleManualSave} disabled={saveState === 'saving'}>
            {saveState === 'saving' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {saveState === 'saved' ? 'Saved!' : 'Save now'}
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  rows={4}
                  value={String(field.value)}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-factify-gray bg-white px-4 py-3 text-sm text-factify-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold resize-none"
                />
              ) : field.type === 'number' ? (
                <Input
                  id={field.id}
                  type="number"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                  className="mt-1.5"
                />
              ) : (
                <Input
                  id={field.id}
                  value={String(field.value)}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="mt-1.5"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
