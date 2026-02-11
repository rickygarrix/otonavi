import { createClient } from '@supabase/supabase-js';

/* =========================
   Supabase Config
========================= */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env vars are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseServer() {
  if (!serviceRoleKey) throw new Error("SERVICE_ROLE_KEY is missing");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/* =========================
   Cloudflare R2 (R2 Worker) Config
========================= */
export async function uploadToR2({
  file,
  type,
  id,
}: {
  file: File;
  type: 'avatar' | 'store'; // avatar 以外にも store 画像などで使えるように拡張
  id: string;
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('id', id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_R2_WORKER_URL}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) throw new Error('Upload failed');

  return res.json() as Promise<{
    ok: boolean;
    key: string;
  }>;
}