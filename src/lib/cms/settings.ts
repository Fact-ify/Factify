import { prisma } from '@/lib/db';
import { defaultSiteSettings } from '@/lib/cms/defaults';
import { mapDbSettingsToTpl } from '@/lib/cms/mappers';
import type { CMSSiteSettings } from '@/types';

export async function getSiteSettings(): Promise<CMSSiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (!settings) return defaultSiteSettings;
    return mapDbSettingsToTpl(settings);
  } catch {
    return defaultSiteSettings;
  }
}
