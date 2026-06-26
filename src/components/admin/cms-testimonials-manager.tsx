'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStore } from '@/store/admin-store';
import type { CMSTestimonial } from '@/types';

const emptyTestimonial: Omit<CMSTestimonial, 'id'> = {
  name: '',
  role: '',
  organization: '',
  content: '',
  rating: 5,
  status: 'draft',
};

export default function CMSTestimonialsManager() {
  const { testimonials, updateTestimonial, deleteTestimonial, addTestimonial } = useAdminStore();
  const [editing, setEditing] = useState<CMSTestimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<CMSTestimonial, 'id'>>(emptyTestimonial);

  const openCreate = () => {
    setForm(emptyTestimonial);
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (item: CMSTestimonial) => {
    setForm(item);
    setEditing(item);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (editing) {
      updateTestimonial(editing.id, form);
    } else {
      addTestimonial(form);
    }
    setEditing(null);
    setIsCreating(false);
    setForm(emptyTestimonial);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-factify-gray-dark">{testimonials.length} testimonials</p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {(isCreating || editing) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editing ? 'Edit Testimonial' : 'New Testimonial'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Organization</Label>
                <Input
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Content</Label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-factify-gray px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold resize-none"
                />
              </div>
              <div>
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
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
              <Button variant="secondary" onClick={() => { setIsCreating(false); setEditing(null); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {testimonials.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-5">
              <div className="flex justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-factify-navy">{item.name}</p>
                    <Badge variant={item.status === 'published' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-factify-gold">{item.role} · {item.organization}</p>
                  <p className="text-sm text-factify-gray-dark mt-2 line-clamp-2">{item.content}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Delete this testimonial?')) deleteTestimonial(item.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
