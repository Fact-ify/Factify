'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStore } from '@/store/admin-store';
import type { CMSArticle } from '@/types';
import { newsSources } from '@/lib/sources';

const emptyArticle: Omit<CMSArticle, 'id'> = {
  title: '',
  summary: '',
  sourceId: 'reuters',
  category: 'Politics',
  region: 'Global',
  status: 'draft',
  publishedAt: new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
};

export default function CMSArticlesManager() {
  const { articles, updateArticle, deleteArticle, addArticle } = useAdminStore();
  const [editing, setEditing] = useState<CMSArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<CMSArticle, 'id'>>(emptyArticle);

  const openCreate = () => {
    setForm(emptyArticle);
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (article: CMSArticle) => {
    setForm(article);
    setEditing(article);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (editing) {
      updateArticle(editing.id, form);
    } else {
      addArticle(form);
    }
    setEditing(null);
    setIsCreating(false);
    setForm(emptyArticle);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this article?')) deleteArticle(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-factify-gray-dark">{articles.length} articles total</p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Article
        </Button>
      </div>

      {(isCreating || editing) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editing ? 'Edit Article' : 'New Article'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Summary</Label>
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-factify-gray px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold resize-none"
                />
              </div>
              <div>
                <Label>Source</Label>
                <select
                  value={form.sourceId}
                  onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
                  className="mt-1.5 w-full h-11 rounded-lg border border-factify-gray px-3 text-sm"
                >
                  {newsSources.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as 'published' | 'draft' })
                  }
                  className="mt-1.5 w-full h-11 rounded-lg border border-factify-gray px-3 text-sm"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCreating(false);
                  setEditing(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-xl border border-factify-gray bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-factify-gray bg-factify-gray/20">
              <th className="text-left py-3 px-4 font-medium text-factify-navy">Title</th>
              <th className="text-left py-3 px-4 font-medium text-factify-navy hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 font-medium text-factify-navy hidden lg:table-cell">Source</th>
              <th className="text-left py-3 px-4 font-medium text-factify-navy">Status</th>
              <th className="text-right py-3 px-4 font-medium text-factify-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-factify-gray/50 hover:bg-factify-gray/10">
                <td className="py-3 px-4">
                  <p className="font-medium text-factify-navy line-clamp-1">{article.title}</p>
                  <p className="text-xs text-factify-gray-dark">{article.publishedAt}</p>
                </td>
                <td className="py-3 px-4 hidden md:table-cell text-factify-gray-dark">
                  {article.category}
                </td>
                <td className="py-3 px-4 hidden lg:table-cell text-factify-gray-dark">
                  {newsSources.find((s) => s.id === article.sourceId)?.name ?? article.sourceId}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={article.status === 'published' ? 'success' : 'warning'}>
                    {article.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(article)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
