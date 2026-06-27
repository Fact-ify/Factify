import type { CMSSiteSettings } from '@/types';

/** CMS home page field keys that map to SiteSettings columns. */
export const HOME_SETTINGS_FIELD_KEYS: (keyof CMSSiteSettings)[] = [
  'heroHeadline',
  'heroSubheadline',
  'ctaHeadline',
  'ctaButtonText',
];

export function buildHomeSettingsPatch(
  fields: { key: string; value: string | number }[]
): Partial<CMSSiteSettings> {
  const patch: Partial<CMSSiteSettings> = {};
  for (const field of fields) {
    if (HOME_SETTINGS_FIELD_KEYS.includes(field.key as keyof CMSSiteSettings)) {
      (patch as Record<string, string | number | boolean>)[field.key] = field.value;
    }
  }
  return patch;
}
