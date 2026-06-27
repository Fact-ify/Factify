import { revalidatePath } from 'next/cache';

/** Revalidate public routes that read CMS content from the database. */
export function revalidateCmsPublicPages() {
  revalidatePath('/', 'layout');
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/verify');
  revalidatePath('/search');
}
