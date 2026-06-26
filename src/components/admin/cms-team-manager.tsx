'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Users, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ImageUploadField from '@/components/admin/image-upload-field';
import { useAdminStore } from '@/store/admin-store';
import type { CMSTeamMember } from '@/types';

const emptyMember: Omit<CMSTeamMember, 'id'> = {
  name: '',
  level: '',
  bio: '',
  imageUrl: '',
  sortIndex: 1,
  status: 'draft',
};

export default function CMSTeamManager() {
  const { teamMembers, updateTeamMember, deleteTeamMember, addTeamMember } = useAdminStore();
  const [editing, setEditing] = useState<CMSTeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<CMSTeamMember, 'id'>>(emptyMember);

  const sortedMembers = useMemo(
    () => [...teamMembers].sort((a, b) => a.sortIndex - b.sortIndex),
    [teamMembers]
  );

  const publishedCount = teamMembers.filter((m) => m.status === 'published').length;

  const openCreate = () => {
    const nextIndex =
      teamMembers.length > 0 ? Math.max(...teamMembers.map((m) => m.sortIndex)) + 1 : 1;
    setForm({ ...emptyMember, sortIndex: nextIndex });
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (member: CMSTeamMember) => {
    setForm(member);
    setEditing(member);
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditing(null);
    setIsCreating(false);
    setForm(emptyMember);
  };

  const handleSave = async () => {
    if (editing) {
      await updateTeamMember(editing.id, form);
    } else {
      await addTeamMember(form);
    }
    closeForm();
  };

  const moveIndex = async (member: CMSTeamMember, direction: 'up' | 'down') => {
    const sorted = sortedMembers;
    const idx = sorted.findIndex((m) => m.id === member.id);
    const swapWith = direction === 'up' ? sorted[idx - 1] : sorted[idx + 1];
    if (!swapWith) return;
    await Promise.all([
      updateTeamMember(member.id, { sortIndex: swapWith.sortIndex }),
      updateTeamMember(swapWith.id, { sortIndex: member.sortIndex }),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-factify-gray bg-gradient-to-br from-factify-navy to-factify-navy-light p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-factify-gold text-factify-navy">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Leadership Team</h2>
              <p className="text-sm text-white/70 mt-1 max-w-xl">
                Manage team leaders shown on the About page and optionally on the home page.
                Set name, level, display order, photo, and publish status.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-white/10 text-white border-white/20">
              {teamMembers.length} total
            </Badge>
            <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
              {publishedCount} published
            </Badge>
            <Button onClick={openCreate} className="bg-factify-gold text-factify-navy hover:bg-factify-gold-light">
              <Plus className="h-4 w-4" />
              Add leader
            </Button>
          </div>
        </div>
      </div>

      {(isCreating || editing) && (
        <Card className="border-factify-gold/30 shadow-factify-md">
          <CardHeader>
            <CardTitle className="text-lg">
              {editing ? 'Edit team leader' : 'New team leader'}
            </CardTitle>
            <CardDescription>
              Leaders are sorted by index number on the public site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadField
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Full name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                  placeholder="Dr. Amara Osei"
                />
              </div>
              <div>
                <Label>Level / title</Label>
                <Input
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="mt-1.5"
                  placeholder="Chief Science Officer"
                />
              </div>
              <div>
                <Label>Display index</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.sortIndex}
                  onChange={(e) => setForm({ ...form, sortIndex: Number(e.target.value) })}
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
              <div className="sm:col-span-2">
                <Label>Short bio / focus</Label>
                <textarea
                  rows={3}
                  value={form.bio ?? ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-factify-gray px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold resize-none"
                  placeholder="Misinformation research"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save leader
              </Button>
              <Button variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedMembers.map((member, index) => (
          <Card key={member.id} className="overflow-hidden card-hover">
            <div className="relative h-44 bg-factify-gray/30">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-bold text-factify-navy/30">
                  {member.name.charAt(0) || '?'}
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="navy">#{member.sortIndex}</Badge>
                <Badge variant={member.status === 'published' ? 'success' : 'warning'}>
                  {member.status}
                </Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold text-factify-navy">{member.name || 'Untitled'}</h3>
              <p className="text-sm text-factify-gold font-medium mt-0.5">{member.level}</p>
              {member.bio && (
                <p className="text-xs text-factify-gray-dark mt-2 line-clamp-2">{member.bio}</p>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-factify-gray/60">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => moveIndex(member, 'up')}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === sortedMembers.length - 1}
                    onClick={() => moveIndex(member, 'down')}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(member)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Remove ${member.name}?`)) deleteTeamMember(member.id);
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

      {sortedMembers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-10 w-10 text-factify-gray mx-auto mb-3" />
            <p className="text-factify-gray-dark">No team leaders yet. Add your first leader above.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
