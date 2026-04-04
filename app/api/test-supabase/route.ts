import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');

    // Test basic connectivity
    const { data, error } = await supabase.from('order_submissions').select('count', { count: 'exact', head: true });

    console.log('Supabase test result:', { data, error });

    return NextResponse.json({
      success: !error,
      count: data,
      error: error?.message
    });
  } catch (err) {
    console.error('Supabase test error:', err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}