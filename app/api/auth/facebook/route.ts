import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${request.nextUrl.origin}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Facebook OAuth error:', error);
      return NextResponse.redirect(
        new URL('/signin?error=oauth_error', request.url)
      );
    }

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    return NextResponse.redirect(
      new URL('/signin?error=oauth_failed', request.url)
    );
  } catch (err) {
    console.error('Facebook OAuth setup error:', err);
    return NextResponse.redirect(
      new URL('/signin?error=server_error', request.url)
    );
  }
}