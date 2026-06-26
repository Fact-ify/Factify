'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStore } from '@/store/admin-store';
import { defaultSiteSettings } from '@/lib/cms/defaults';
import type { CMSSiteSettings } from '@/types';

export default function CMSSettingsForm() {
  const { siteSettings, updateSiteSettings } = useAdminStore();
  const [form, setForm] = useState<CMSSiteSettings>(defaultSiteSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (siteSettings) setForm(siteSettings);
  }, [siteSettings]);

  const handleSave = () => {
    updateSiteSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site Name</Label>
            <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Headline</Label>
            <Input value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Subheadline</Label>
            <textarea
              rows={3}
              value={form.heroSubheadline}
              onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-factify-gray px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Verifications Count</Label>
            <Input type="number" value={form.statVerifications} onChange={(e) => setForm({ ...form, statVerifications: Number(e.target.value) })} className="mt-1.5" />
          </div>
          <div>
            <Label>Accuracy (%)</Label>
            <Input type="number" value={form.statAccuracy} onChange={(e) => setForm({ ...form, statAccuracy: Number(e.target.value) })} className="mt-1.5" />
          </div>
          <div>
            <Label>Trusted Sources</Label>
            <Input type="number" value={form.statSources} onChange={(e) => setForm({ ...form, statSources: Number(e.target.value) })} className="mt-1.5" />
          </div>
          <div>
            <Label>AI Monitoring</Label>
            <Input value={form.statMonitoring} onChange={(e) => setForm({ ...form, statMonitoring: e.target.value })} className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>CTA Headline</Label>
            <Input value={form.ctaHeadline} onChange={(e) => setForm({ ...form, ctaHeadline: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>CTA Button Text</Label>
            <Input value={form.ctaButtonText} onChange={(e) => setForm({ ...form, ctaButtonText: e.target.value })} className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Section headline</Label>
            <Input
              value={form.teamHeadline}
              onChange={(e) => setForm({ ...form, teamHeadline: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Section description</Label>
            <textarea
              rows={2}
              value={form.teamSubheadline}
              onChange={(e) => setForm({ ...form, teamSubheadline: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-factify-gray px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.showTeamOnHome}
              onChange={(e) => setForm({ ...form, showTeamOnHome: e.target.checked })}
              className="h-4 w-4 rounded border-factify-gray text-factify-gold focus:ring-factify-gold"
            />
            <span className="text-sm text-factify-navy">Show leadership team on the home page</span>
          </label>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>
        <Save className="h-4 w-4" />
        {saved ? 'Saved!' : 'Save Settings'}
      </Button>
    </div>
  );
}
