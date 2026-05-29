import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🔍 VALIDATION: Fix DNS Error
if (!supabaseUrl || supabaseUrl.includes('your-project-id') || supabaseUrl.includes('placeholder')) {
  console.error('\n🚨 DNS ERROR FIX REQUIRED 🚨');
  console.error('Your Supabase URL is invalid/placeholder!');
  console.error('Run: ./setup-oauth.bat');
  console.error('Or: https://supabase.com/dashboard → New Project');
  console.error('Update .env.local:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://[real-ref].supabase.co');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]\n');
  console.warn('🟡 Continuing with limited functionality (OAuth/DB may fail)');
}

console.log('✅ Supabase URL OK:', supabaseUrl);
console.log('Supabase Key length:', supabaseAnonKey?.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
