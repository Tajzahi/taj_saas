// Server-side Supabase client
// File ini HANYA berjalan di Next.js server (API routes, Server Actions).
// TIDAK pernah di-bundle ke browser. Aman untuk menggunakan service role key.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

// Service role key bypass RLS — untuk operasi server yang membutuhkan full access.
// Jika tidak ada, fallback ke anon key (insert orders tetap bisa karena ada policy anon).
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase client untuk API routes — menggunakan service role key (jika tersedia)
 * agar server bisa bypass RLS dan menghitung harga dari DB secara aman.
 */
export function createServerSupabaseClient() {
  const key = serviceRoleKey || anonKey;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Supabase client untuk read-only data publik (menu, kategori).
 * Menggunakan anon key — aman karena RLS public read sudah ada.
 */
export function createPublicSupabaseClient() {
  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
}
