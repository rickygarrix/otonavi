import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env vars are missing');
}

/**
 * クライアントサイド用 (Anon Key)
 * 主にブラウザからのデータ取得に使用
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * サーバーサイド用 (Service Role Key)
 * 管理者権限が必要な操作や API Route で使用
 */
export function getSupabaseServer() {
  if (!serviceRoleKey) {
    throw new Error("SERVICE_ROLE_KEY is missing");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}