'use client';

import { useState } from 'react';
import { Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CMSPage } from '@/data/mock/cms-content';
import { useAdminStore } from '@/store/admin-store';

interface CMSPageEditorProps {
  page: CMSPage;
}

export default function CMSPageEditor({ page }: CMSPageEditorProps) {
  const { updatePageField, updatePageStatus } = useAdminStore();
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (fieldId: string, value: string | number) => {
    updatePageField(page.id, fieldId, value);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            {page.route} · Last updated {page.lastUpdated}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={page.status}
            onChange={(e) =>
              updatePageStatus(page.id, e.target.value as 'published' | 'draft')
            }
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
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {page.fields.map((field) => (
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
