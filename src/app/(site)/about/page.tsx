import type { Metadata } from 'next';
import AboutPage from './about-page';
import { getPublishedTeamMembers } from '@/lib/cms/team';
import { getSiteSettings } from '@/lib/cms/settings';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Factify, the AI-powered news verification platform helping users discover the truth.',
};

export default async function Page() {
  const [teamMembers, settings] = await Promise.all([
    getPublishedTeamMembers(),
    getSiteSettings(),
  ]);

  return (
    <AboutPage
      teamMembers={teamMembers}
      teamHeadline={settings.teamHeadline}
      teamSubheadline={settings.teamSubheadline}
    />
  );
}
