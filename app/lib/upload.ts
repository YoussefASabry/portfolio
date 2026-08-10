import { supabase } from './supabase';

export const IMAGE_BUCKET = 'images';

/** Upload an image to Supabase Storage and return its public URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase is not configured — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(name, file, {
    cacheControl: '31536000',
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(name).data.publicUrl;
}
